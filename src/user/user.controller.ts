import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiSummary,
  Auth,
  CurrentUser,
  SuccessMessage,
} from '../common/decorators';
import { AuthUserType, RoleType } from '../common/types';
import { apiDesc, message } from '../common/assets';
import { ChangePasswordDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Auth(RoleType.admin, RoleType.user)
  @ApiSummary(apiDesc.user.changePassword)
  @SuccessMessage(message.user.SUCCESS_PASSWORD_CHANGED)
  @Post('change-password')
  async changePassword(
    @CurrentUser() authUser: AuthUserType,
    @Body() body: ChangePasswordDto,
  ) {
    const { password } = body;
    return this.usersService.changePassword(authUser, password);
  }
}
