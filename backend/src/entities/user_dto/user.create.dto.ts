import { AutoMap } from '@automapper/classes';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @AutoMap()
  Name: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 5,
    minUppercase: 2,
    minNumbers: 2,
  })
  @AutoMap()
  Password: string;
}