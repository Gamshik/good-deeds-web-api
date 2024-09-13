/* eslint-disable prettier/prettier */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { IGoodDeedRepository } from 'src/interfaces/repositories/good.deed.repository.interface';
import { IGoodDeedService } from 'src/interfaces/services/good.deed.service.interface';
import { GoodDeed } from 'src/entities/db_entities/good.deed';
import { GoodDeedCreateDto } from 'src/entities/good_deed_dto/good.deed.create.dto';
import { GoodDeedDeleteDto } from 'src/entities/good_deed_dto/good.deed.delete.dto';
import { Result } from 'src/entities/result';
import { GoodDeedUpdateDto } from 'src/entities/good_deed_dto/good.geed.update.dto';
import { GoodDeedDto } from 'src/entities/good_deed_dto/good.deed.dto';
import { IUserFriendService } from 'src/interfaces/services/user.friend.service.interfaces';
import { PaginationParameter } from 'src/entities/pagination/pagination.parameters';
import { MetaData } from 'src/entities/pagination/meta.data';
import { GoodDeedsWithPagingMetaData } from 'src/entities/wrapers/good.deeds.with.paging.meta.data';

@Injectable()
export class GoodDeedService implements IGoodDeedService {
  constructor(
    @Inject('IGoodDeedRepository') private readonly goodDeedRepository: IGoodDeedRepository,
    @Inject('IUserFriendService') private readonly userFriendService: IUserFriendService,
    @InjectMapper() private readonly mapper: Mapper) {}

    private goodDeedList: GoodDeedDto[] = []; 

    async createGoodDeed(goodDeedCreate: GoodDeedCreateDto): Promise<Result> {
        const goodDeed = this.mapper.map(goodDeedCreate, GoodDeedCreateDto, GoodDeed)


        const newGoodDeed = await this.goodDeedRepository.create(goodDeed);

        if (!newGoodDeed) {
            return { IsSuccess: false, StatusCode: HttpStatus.INTERNAL_SERVER_ERROR, Message: `Internal server error.` };
        }

        return { IsSuccess: true, StatusCode: HttpStatus.CREATED, Message: `Good deed has been created.` };
    }

    async findByUserId(userId: string,  pagingParam: PaginationParameter): Promise<GoodDeedsWithPagingMetaData | null> {
        const userGoodDeeds = await this.goodDeedRepository.findByUserId(userId);

        if (!userGoodDeeds) {
            return null;
        }

        const start = (pagingParam.currentPage - 1) * pagingParam.pageSize ;
        const end = start + Number(pagingParam.pageSize);
        const slicedGoodDeedsArray = userGoodDeeds.slice(start, end);

        const metaData = new MetaData(pagingParam.pageSize, pagingParam.currentPage, userGoodDeeds.length)

        this.goodDeedList.splice(0)

        slicedGoodDeedsArray.forEach(element => {
            this.goodDeedList.push({ Id: element.Id, GoodDeed: element.GoodDeed });
        });

        return { GoodDeeds: slicedGoodDeedsArray, MetaData: metaData };
    }

    async updateGoodDeed(goodDeedUpdate: GoodDeedUpdateDto): Promise<Result> {
        const foundGoodDeed = await this.goodDeedRepository.findById(goodDeedUpdate.Id);
        
        if (!foundGoodDeed) {
            return { IsSuccess: false, StatusCode: HttpStatus.NOT_FOUND, Message: `Good deed is not exist.` };
        }

        if (foundGoodDeed.UserId != goodDeedUpdate.UserId) {
            return { IsSuccess: false, StatusCode: HttpStatus.BAD_REQUEST, Message: `This user don\`t have such good deed.` };   
        }

        const updateGoodDeed = this.mapper.map(goodDeedUpdate, GoodDeedUpdateDto, GoodDeed);

        const countUpdatedGoodDeed = await this.goodDeedRepository.update(updateGoodDeed);

        if (countUpdatedGoodDeed != 1) {
            return { IsSuccess: false, StatusCode: HttpStatus.INTERNAL_SERVER_ERROR, Message: `Internal server error.` };
          }
      
          return { IsSuccess: true, StatusCode: HttpStatus.CREATED, Message: `Good deed has been updated.` };
    }

    async deleteGoodDeed(goodDeedDelete: GoodDeedDeleteDto): Promise<Result> {
        const foundGoodDeed = await this.goodDeedRepository.findById(goodDeedDelete.Id);

        if (!foundGoodDeed) {
          return { IsSuccess: false, StatusCode: HttpStatus.NOT_FOUND, Message: `Good deed don\`t exist.` };
        }

        if (foundGoodDeed.UserId !== goodDeedDelete.UserId) {
            return { IsSuccess: false, StatusCode: HttpStatus.BAD_REQUEST, Message: `This user don\`t have such good deed.` };   
        }
    
        const deletedGoodDeed = await this.goodDeedRepository.delete(foundGoodDeed);
    
        if (!deletedGoodDeed) {
          return { IsSuccess: false, StatusCode: HttpStatus.INTERNAL_SERVER_ERROR, Message: `Internal server error.` };
        }
    
        return { IsSuccess: true, StatusCode: HttpStatus.OK, Message: `Good deed has been deleted.` };
    }
}
