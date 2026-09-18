import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../User/user.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

@Module({
  imports: [UserModule,JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
