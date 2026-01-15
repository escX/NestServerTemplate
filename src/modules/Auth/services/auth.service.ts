import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateCode(code: string) {
    if (this.configService.get('NODE_ENV') !== 'production' && code === '000000') {
      return true;
    }
    // todo: 校验验证码
    throw new BadRequestException('验证码无效');
  }

  async signIn(user_id: number) {
    // 生成JWT Token
    const token = await this.jwtService.signAsync({ sub: user_id, user_id });
    return token;
  }
}
