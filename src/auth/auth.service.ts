import { ForbiddenException, Injectable } from '@nestjs/common';
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

    const loggedInUser = await this.userModel
      .findById(existingUser._id)
      .select('-password -_id');

    return {
      user: loggedInUser,
      msg: 'user logged in successfully',
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
}
