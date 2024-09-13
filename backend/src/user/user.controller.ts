/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Post, Put, Query, Req, Request, Res, UseGuards } from '@nestjs/common';
import { UserUpdateDto } from '../entities/user_dto/user.update.dto';
import { IUserService } from '../interfaces/services/user.service.interface';
import { UserDto } from '../entities/user_dto/user.dto';
import { UserCreateDto } from '../entities/user_dto/user.create.dto';
import { Response } from 'express';
import { UserLoginDto } from '../entities/user_dto/user.login.dto';
import { AuthenticationGuard } from '../authentication_guard/authentication.guard';
import { LoginResponse } from 'src/entities/login.response';
import { ResponseMessage } from 'src/entities/response.message';
import { IUserFriendService } from 'src/interfaces/services/user.friend.service.interfaces';
import { PaginationParameter } from 'src/entities/pagination/pagination.parameters';
import { UserDeleteDto } from 'src/entities/user_dto/user.delete.dto';

@Controller('user')
export class UserController {
  constructor(@Inject('IUserService') private readonly userService: IUserService,
    @Inject('IUserFriendService') private readonly friendService: IUserFriendService) {}

  @Post('register')
  async registerUser(@Body() userCreateDto: UserCreateDto, @Res({ passthrough: true }) res: Response): Promise<ResponseMessage> {
    const result = await this.userService.registerUser(userCreateDto);

    res.status(result.StatusCode);

    return { message: result.Message };
  }

  @Post('login')
  async loginUser(@Body() userLoginDto: UserLoginDto, @Res({ passthrough: true }) res: Response): Promise<LoginResponse> {
    const loginResult = await this.userService.loginUser(userLoginDto);

    if (loginResult.StatusCode == 400){
      res.status(HttpStatus.BAD_REQUEST);
      return { Message: loginResult.Message };
    }

    res.cookie('Token', 'loginResult', { httpOnly: true, sameSite: 'none' })
    console.log(res.getHeaders());
    res.status(HttpStatus.OK);
    return { Jwt: loginResult.Jwt, UserId: loginResult.UserId };
  }

  @UseGuards(AuthenticationGuard)
  @Get('my')
  async getMyData(@Query('id') id: string, @Res({ passthrough: true }) res: Response): Promise<UserDto> {

    const user = await this.userService.findById(id);

    if (!user) {
      res.status(HttpStatus.NOT_FOUND);
      return;
    }

    return user;
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async getUserData(@Query('userId') userId: string, @Req() req, @Res({ passthrough: true }) res: Response): Promise<UserDto> {
    if (!userId) {
      res.status(HttpStatus.BAD_REQUEST);
      return;
    }

    const user = await this.userService.findById(userId);

    if (!user) {
      res.status(HttpStatus.NOT_FOUND);
      return;
    }
    
    res.status(HttpStatus.OK);

    if (!await this.friendService.isFriendship({ UserId: req.user['sub'], FriendId: user.Id })) {
      res.set('X-IsFriend', 'false');
      return user;
    }

    res.set('X-IsFriend', 'true');
    return user;
  }
  
  @UseGuards(AuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  @Get('other')
  async getOtherUsers(@Query() pagingParam: PaginationParameter, @Request() req, @Res({ passthrough: true }) res: Response): Promise<UserDto[]> {
    const result = await this.userService.getOtherUsers(req.user['sub'], pagingParam);

    if (!result) {
      res.status(HttpStatus.NOT_FOUND);
      return;
    }

    res.set('X-Pagination', JSON.stringify(result.MetaData));

    return result.UsersDto;
  }

  @UseGuards(AuthenticationGuard)
  @Put()
  async updateUser(@Body() userUpdateDto: UserUpdateDto, @Res({ passthrough: true }) res: Response): Promise<ResponseMessage> {
    const result = await this.userService.updateUser(userUpdateDto);

    res.status(result.StatusCode);

    return { message: result.Message }
  }

  @UseGuards(AuthenticationGuard)
  @Delete()
  async deleteMyAccount(@Body() userDeleteDto: UserDeleteDto, @Res({ passthrough: true }) res: Response): Promise<ResponseMessage> {
    const result = await this.userService.deleteMyAccount(userDeleteDto);

    res.status(result.StatusCode);

    return { message: result.Message }
  }
}
