import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SignInDto, SignUpDto } from './dto/auth.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  // @POST /auth/login
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signin(@Body() dto: SignInDto) {
    return this.auth.signin(dto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() dto: SignUpDto) {
    return this.auth.signup(dto);
  }
}
