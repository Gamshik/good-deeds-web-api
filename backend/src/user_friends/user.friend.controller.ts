/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpStatus, Inject, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationGuard } from 'src/authentication_guard/authentication.guard';
import { UserFriendCreateDto } from 'src/entities/user_friend_dto/user.friend.create.dto';
import { IUserFriendService } from 'src/interfaces/services/user.friend.service.interfaces';
import { UserFriendDto } from 'src/entities/user_friend_dto/user.friend.dto';
import { UserFriendDeleteDto } from 'src/entities/user_friend_dto/user.friend.delete.dto';

@Controller('user-friend')
export class UserFriendController {
  constructor(@Inject('IUserFriendService') private readonly userFriendService: IUserFriendService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  async addFriend(@Body() userFriendCreate: UserFriendCreateDto, @Res({ passthrough: true }) res: Response): Promise<string> {
    const result = await this.userFriendService.createUserFriend(userFriendCreate);

    res.status(result.statusCode);

    return result.message;
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async findByUserId(@Query('userId') userId: string, @Res({ passthrough: true }) res: Response): Promise<UserFriendDto[]> {
    const numberUserId = Number(userId);

    if (!numberUserId) {
      res.status(HttpStatus.BAD_REQUEST);
      return;
    }

    const userFriends = await this.userFriendService.findByUserId(Number(userId));

    if (!userFriends) {
      res.status(HttpStatus.NOT_FOUND);
      return;
    }

    return userFriends;
  }

  @UseGuards(AuthenticationGuard)
  @Delete()
  async deleteUserFriend(@Body() userFriendDeleteDto: UserFriendDeleteDto, @Res({ passthrough: true }) res: Response): Promise<string> {
    const result = await this.userFriendService.deleteUserFriend(userFriendDeleteDto);

    res.status(result.statusCode);

    return result.message;
  }
}