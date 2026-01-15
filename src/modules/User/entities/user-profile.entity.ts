import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

export enum GenderEnum {
  UNKNOWN,
  MALE,
  FEMALE,
}

@Entity('user_profile')
export class UserProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 关联：用户
  @OneToOne(() => UserEntity, (user) => user.user_profile, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ comment: '关联用户ID' })
  user_id: number;

  @Column({ length: 255, nullable: true, comment: '背景图' })
  background_image: string;
}
