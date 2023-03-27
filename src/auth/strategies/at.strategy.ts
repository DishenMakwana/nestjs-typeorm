import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/entities';
import { Repository } from 'typeorm';

type Payload = {
  sub: string;
  email: string;
};

@Injectable()
export class ATStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: Payload) {
    const access_token = request
      .get('authorization')
      .replace('Bearer ', '')
      .trim();

    /**
     * Check if access_token is valid or you can write a custom check here
     */

    const user = await this.userRepository.findOne({
      where: { id: Number(payload.sub) },
      select: ['id', 'role_id', 'status'],
    });

    if (!user || !user.status) {
      throw new UnauthorizedException();
    }

    return {
      ...user,
      access_token,
    };
  }
}
