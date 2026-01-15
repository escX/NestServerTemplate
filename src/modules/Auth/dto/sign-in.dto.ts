import { Type } from 'class-transformer';
import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class SignInDto {
  @IsPhoneNumber('CN')
  @Type(() => String)
  phone: string;

  @IsString()
  @Length(6, 6)
  @Type(() => String)
  code: string;
}
