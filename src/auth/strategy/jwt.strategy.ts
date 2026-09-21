import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('ACCESS_TOKEN_SECRET')!,
    });
  }
  async validate(payload: { sub: string; role: string; orgId: string }) {
    return {
      sub: payload.sub?.toString(),
      role: payload.role,
      organisationId: payload.orgId?.toString(),
    };
  }
}
