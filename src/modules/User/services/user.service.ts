import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserProfileEntity } from '../entities/user-profile.entity';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    private readonly configService: ConfigService
  ) {}

  async getUserByPhone(phone: string) {
    return await this.userRepository.findOneBy({ phone });
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const bytes = randomBytes(length);

    for (let i = 0; i < length; i++) {
      result += chars[bytes[i] % chars.length];
    }

    return result;
  }

  async createUser(phone: string) {
    const userProfile = this.userProfileRepository.create();
    const randomString = this.generateRandomString(16);
    const user = await this.userRepository.save({
      phone,
      nickname: `${randomString.slice(0, 8)}`,
      user_profile: userProfile,
      photo: `${this.configService.get('DOMAIN')}/public/images/anonymous.svg`,
    });
    if (!user) {
      throw new InternalServerErrorException('用户创建失败');
    }
    return user;
  }

  async updateUser(user_id: number, data: any) {
    const { nickname, photo, background_image } = data;
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['user_profile'],
    });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    user.nickname = nickname;
    user.photo = photo;
    user.user_profile.background_image = background_image;

    return await this.userRepository.save(user);
  }

  async validateCode(code: string) {
    if (this.configService.get('NODE_ENV') !== 'production' && code === '000000') {
      return true;
    }
    // todo: 校验验证码
    return false;
  }

  async updatePhone(data: any) {
    const { user_id, old_phone, new_phone, code } = data;
    const isValidCode = await this.validateCode(code);
    if (!isValidCode) {
      throw new BadRequestException('验证码无效');
    }
    const user = await this.userRepository.findOneBy({ id: user_id });
    if (!user || user?.phone !== old_phone) {
      throw new BadRequestException('旧手机号不匹配');
    }
    user.phone = new_phone;
    return await this.userRepository.save(user);
  }

  async deleteAccount(user_id: number) {
    return await this.userRepository.delete(user_id);
  }

  async getUser(user_id: number) {
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['user_profile'],
    });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    return user;
  }
}
