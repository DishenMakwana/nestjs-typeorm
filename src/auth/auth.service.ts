import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HelperService } from '../helper/helper.service';
import { RoleType } from '../common/types';
import { message } from '../common/assets';
import * as bcryptjs from 'bcryptjs';
import { MailService } from '../mail/mail.service';
import { Code, User } from '../user/entities';
import { UserTransformer } from '../user/user.transformer';

export type Tokens = {
  access_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Code) private readonly codeRepository: Repository<Code>,
    private readonly jwtService: JwtService,
    private readonly userTransformer: UserTransformer,
    private readonly helper: HelperService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, password: string, role: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
        role_id: RoleType[role],
      },
    });

    if (!user) throw new ForbiddenException(message.user.INVALID_CRED);

    if (!user.status)
      throw new ForbiddenException(message.user.USER_ACCOUNT_DEACTIVATED);

    const isValid = await bcryptjs.compare(password, user.password);

    if (!isValid) {
      throw new ForbiddenException(message.user.INVALID_CRED);
    }

    const { access_token }: Tokens = await this.getToken(user.id, user.email);

    return {
      user: this.userTransformer.transform(user),
      access_token,
    };
  }

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    mobile: string,
  ) {
    let user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (user) throw new BadRequestException(message.user.EMAIL_ALREADY_PRESENT);

    if (mobile) {
      user = await this.userRepository.findOne({
        where: {
          mobile,
        },
      });

      if (user)
        throw new BadRequestException(message.user.MOBILE_NUMBER_ALREADY_EXIST);
    }

    const hashedPassword = await bcryptjs.hash(
      password,
      +this.configService.get<number>('BCRYPT_ROUNDS'),
    );

    user = await this.userRepository.save({
      first_name: firstName,
      last_name: lastName,
      name: `${firstName} ${lastName}`,
      email,
      mobile,
      password: hashedPassword,
      role_id: RoleType.user,
    });

    await this.sendEmail(email);

    return this.userTransformer.transform(user);
  }

  async userActivation(code: string) {
    const userCode = await this.codeRepository.findOne({
      where: {
        code,
      },
    });

    if (!userCode) throw new BadRequestException(message.user.INVALID_CODE);

    const user = await this.userRepository.update(
      {
        id: userCode.user_id,
      },
      {
        status: true,
      },
    );

    await this.codeRepository.delete({
      user_id: userCode.user_id,
    });

    return this.userTransformer.transform(user);
  }

  async sendEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (user.status) {
      throw new ForbiddenException(message.user.ALREADY_VERIFY_EMAIL);
    }

    const code = this.helper.randomString(25);

    // upsert in typeorm

    const currentUserCode = await this.codeRepository.findOne({
      where: {
        user_id: user.id,
      },
    });

    await this.codeRepository.save({
      id: currentUserCode?.id,
      user_id: user.id,
      code: code,
    });

    // await this.codeRepository.upsert(
    //   [
    //     {
    //       user_id: user.id,
    //       code: code,
    //     },
    //   ],
    //   ['user_id'],
    // );

    await this.mailService.sendUserConfirmation(user, code);
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) throw new BadRequestException(message.user.USER_DOES_NOT_EXIST);

    if (!user.status)
      throw new BadRequestException(message.user.USER_ACCOUNT_DEACTIVATED);

    const code = Math.floor(Math.random() * (9999 - 1000) + 1000);

    // upsert in typeorm

    const currentUserCode = await this.codeRepository.findOne({
      where: {
        user_id: user.id,
      },
    });

    await this.codeRepository.save({
      id: currentUserCode?.id,
      user_id: user.id,
      code: code.toString(),
    });

    // await this.codeRepository.upsert(
    //   [
    //     {
    //       user_id: user.id,
    //       code: code.toString(),
    //     },
    //   ],
    //   ['user_id'],
    // );

    await this.mailService.sendForgotPasswordEmail(user, code.toString());

    return true;
  }

  async verifyOtp(email: string, code: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) throw new BadRequestException(message.user.INVALID_OTP);

    const userCode = await this.codeRepository.findOne({
      where: {
        user_id: user.id,
        code,
      },
    });

    if (!userCode) throw new BadRequestException(message.user.INVALID_OTP);

    return this.userTransformer.transform(user);
  }

  async resetPassword(email: string, otp: string, password: string) {
    const user = await this.verifyOtp(email, otp);

    const hashedPassword = await bcryptjs.hash(password, 10);

    await this.userRepository.update(
      {
        id: user.id,
      },
      {
        password: hashedPassword,
      },
    );

    await this.codeRepository.delete({
      user_id: user.id,
    });

    return this.userTransformer.transform(user);
  }

  async getToken(user_id: number, email: string): Promise<Tokens> {
    const [at] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user_id,
          email,
        },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
        },
      ),
    ]);

    return {
      access_token: at,
    };
  }
}
