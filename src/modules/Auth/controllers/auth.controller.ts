import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from 'src/modules/User/services/user.service';
import { SignInDto } from '../dto/sign-in.dto';
import { Public } from 'src/guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Public()
  @Post('sign_up_in')
  async signUpIn(@Body() data: SignInDto) {
    await this.authService.validateCode(data.code);

    let user = await this.userService.getUserByPhone(data.phone);
    if (!user) {
      user = await this.userService.createUser(data.phone);
    }

    const token = await this.authService.signIn(user.id);
    return {
      token,
      user_id: user.id,
    };
  }
}
