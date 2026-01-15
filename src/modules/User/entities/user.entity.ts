import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserProfileEntity } from './user-profile.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 关联：用户资料
  @OneToOne(() => UserProfileEntity, (userProfile) => userProfile.user, {
    cascade: true,
  })
  user_profile: UserProfileEntity;

  @Column({ length: 11, unique: true, comment: '手机号' })
  phone: string;

  @Column({ length: 16, comment: '昵称' })
  nickname: string;

  @Column({ length: 255, comment: '头像' })
  photo: string;

  @CreateDateColumn({ type: 'timestamptz', comment: '创建时间' })
  create_time: Date;

  @UpdateDateColumn({ type: 'timestamptz', comment: '更新时间' })
  update_time: Date;
}
