import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import { User, UserDocument } from '../User/user.schema.js';
import { SignInDto, SignUpDto } from './dto/auth.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signin(dto: SignInDto) {
    const existingUser = await this.userModel.findOne({ email: dto.email });

    if (!existingUser) {
      throw new ForbiddenException('No user found');
    }

    const isPasswordCorrect = await argon.verify(
      existingUser.password,
      dto.password,
    );

    if (!isPasswordCorrect) {
      throw new ForbiddenException('Password Incorrect');
    }

    const refresh_token = await this.signRefreshToken(
      existingUser._id.toString(),
    );

    const access_token = await this.signAccessToken(
      existingUser._id.toString(),
      existingUser.role,
      existingUser.organisation_id,
    );

    const loggedInUser = await this.userModel
      .findByIdAndUpdate(
        existingUser._id,
        {
          $set: {
            refreshToken: refresh_token.refreshToken,
          },
        },
        {
          returnDocument: 'after',
        },
      )
      .select('-password -refreshToken');

    return {
      user: loggedInUser,
      msg: 'user logged in successfully',
      access_token: access_token.accessToken,
      refresh_token: refresh_token.refreshToken,
    };
  }

  async signup(dto: SignUpDto) {
    const existingUser = await this.userModel.findOne({ email: dto.email });

    if (existingUser) {
      throw new ForbiddenException('Credentials already taken');
    }

    const hashPassword = await argon.hash(dto.password);

    await this.userModel.create({
      username: dto.username,
      email: dto.email,
      password: hashPassword,
    });

    return {
      msg: 'user created successfully',
    };
  }

  async signRefreshToken(userId: string): Promise<{ refreshToken: string }> {
    const payload = {
      sub: userId,
    };

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
    });

    return { refreshToken: refreshToken };
  }

  async signAccessToken(
    userId: string,
    role: string,
    orgId: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      role: role,
      orgId: orgId,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
    });

    return { accessToken: accessToken };
  }
}
