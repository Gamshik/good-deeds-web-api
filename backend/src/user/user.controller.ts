/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpStatus, Inject, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { UserUpdateDto } from 'src/entities/user.dto/user.update.dto';
import { IUserService } from 'src/interfaces/services/user.service.interface';
import { UserDto } from 'src/entities/user.dto/user.dto';
import { UserCreateDto } from 'src/entities/user.dto/user.create.dto';
import { Response } from 'express';
import { Jwt } from 'src/entities/jwt';
import { UserLoginDto } from 'src/entities/user.dto/user.login.dto';
import { AuthenticationGuard } from './guard/authentication.guard';

@Controller('user')
export class UserController {
  constructor(@Inject('IUserService') private readonly userService: IUserService) {}

  @Post('register')
  registerUser(@Body() userCreateDto: UserCreateDto, @Res({ passthrough: true }) res: Response): string {
    const result = this.userService.registerUser(userCreateDto);

    res.status(result.statusCode);

    return result.message;
  }

  @Post('login')
  loginUser(@Body() userLoginDto: UserLoginDto, @Res({ passthrough: true }) res: Response): Jwt {
    const token = this.userService.loginUser(userLoginDto);

    if (token === undefined){
      res.status(HttpStatus.BAD_REQUEST);
      return;
    }

    res.status(HttpStatus.OK);
    return token;
  }

  @Get()
  getUser(@Query('name') name: string): UserDto {
    return this.userService.findUserByName(name);
  }

  @UseGuards(AuthenticationGuard)
  @Get('all')
  getAllUser(): UserDto[] {
    return this.userService.getAllUsers();
  }

  @UseGuards(AuthenticationGuard)
  @Put('update')
  updateUser(@Body() userUpdateDto: UserUpdateDto, @Res({ passthrough: true }) res: Response): string {
    const result = this.userService.updateUser(userUpdateDto);

    res.status(result.statusCode);

    return result.message;
  }
}
