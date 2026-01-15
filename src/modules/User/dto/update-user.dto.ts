import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(2, 16)
  nickname: string;

  @IsUrl()
  @Length(1, 255)
  photo: string;

  @IsUrl()
  @Length(1, 255)
  @IsOptional()
  background_image?: string;
}
