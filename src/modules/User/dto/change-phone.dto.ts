import { Type } from 'class-transformer';
import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class ChangePhoneDto {
  @IsPhoneNumber('CN')
  @Type(() => String)
  old_phone: string;

  @IsPhoneNumber('CN')
  @Type(() => String)
  new_phone: string;

  @IsString()
  @Length(6, 6)
  @Type(() => String)
  code: string;
}
