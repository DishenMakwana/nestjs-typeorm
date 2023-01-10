import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Render,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ApiSummary, Auth, SuccessMessage } from '../common/decorators';
import { apiDesc, message } from '../common/assets';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResendEmailDto,
  ResetPasswordDto,
  UpsertDto,
  VerifyOtpDto,
} from './dto/auth.dto';
import { RoleType } from '../common/types';
import { I18n, I18nContext } from 'nestjs-i18n';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SuccessMessage(message.user.SUCCESS_LOGIN)
  @ApiSummary(apiDesc.auth.login)
  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password, role } = body;
    return this.authService.login(email, password, role);
  }

  @SuccessMessage(message.user.SUCCESS_REGISTER)
  @ApiSummary(apiDesc.auth.register)
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const { firstName, lastName, email, password, mobile } = body;
    return this.authService.register(
      firstName,
      lastName,
      email,
      password,
      mobile,
    );
  }

  @SuccessMessage(message.user.RESEND_EMAIL)
  @ApiSummary(apiDesc.auth.resendEmail)
  @Post('resend-email')
  async resendEmail(@Body() body: ResendEmailDto) {
    const { email } = body;
    return this.authService.sendEmail(email);
  }

  @SuccessMessage(message.user.SUCCESS_SEND_OTP)
  @ApiSummary(apiDesc.auth.forgotPassword)
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const { email } = body;
    return this.authService.forgotPassword(email);
  }

  @SuccessMessage(message.user.SUCCESS_VERIFY_OTP)
  @ApiSummary(apiDesc.auth.verifyOtp)
  @Post('verify-otp')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    const { email, otp } = body;
    return this.authService.verifyOtp(email, otp);
  }

  @SuccessMessage(message.user.SUCCESS_PASSWORD_RESET)
  @ApiSummary(apiDesc.auth.resetPassword)
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    const { email, otp, password } = body;
    return this.authService.resetPassword(email, otp, password);
  }

  @Render('user-activation')
  @ApiSummary(apiDesc.auth.userActivation)
  @Get('user-activation/:code')
  async activationUser(@Param('code') code: string) {
    try {
      const response = await this.authService.userActivation(code);

      return {
        success: true,
        message: message.user.VERIFY_EMAIL,
        user: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Auth(RoleType.admin)
  @Get('get-user')
  async getUser(@Req() req) {
    return req.user;
  }

  @SuccessMessage(message.user.INTERNALIZATION)
  @ApiSummary(apiDesc.user.internalization)
  @Post('internalization')
  async internalization(@I18n() i18n: I18nContext) {
    return i18n.t('test.HELLO');
  }

  @SuccessMessage(message.user.SUCCESS_REGISTER)
  @ApiSummary(apiDesc.auth.register)
  @Post('upsert')
  async internalizationWithLang(@Body() body: UpsertDto) {
    return this.authService.userUpsert(body);
  }
}
