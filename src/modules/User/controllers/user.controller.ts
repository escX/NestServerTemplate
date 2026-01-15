import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePhoneDto } from '../dto/change-phone.dto';
import { Mine } from 'src/decorator/mine.decorator';
import { ValidateNumberPipe } from 'src/pipe/ValidNumberPipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 获取用户信息
  @Get('get_user')
  async getUser(@Query('user_id', ValidateNumberPipe) user_id: number) {
    return await this.userService.getUser(user_id);
  }

  // 修改手机号
  @Post('change_phone')
  async changePhone(@Mine('user_id') user_id: number, @Body() data: ChangePhoneDto) {
    return await this.userService.updatePhone({
      user_id,
      ...data,
    });
  }

  // 更新用户信息
  @Post('update_user')
  async updateUser(@Mine('user_id') user_id: number, @Body() data: UpdateUserDto) {
    return await this.userService.updateUser(user_id, data);
  }

  // 注销
  @Post('delete_user')
  async deleteAccount(@Mine('user_id') user_id: number) {
    return await this.userService.deleteAccount(user_id);
  }
}
