/* eslint-disable prettier/prettier */
import { GoodDeedCreateDto } from 'src/entities/good_deed_dto/good.deed.create.dto';
import { GoodDeedDeleteDto } from 'src/entities/good_deed_dto/good.deed.delete.dto';
import { GoodDeedUpdateDto } from 'src/entities/good_deed_dto/good.geed.update.dto';
import { GoodDeedDto } from 'src/entities/good_deed_dto/good.deed.dto';
import { Result } from 'src/entities/result';

export interface IGoodDeedService {
  createGoodDeed(goodDeedCreate: GoodDeedCreateDto, userId: number): Promise<Result>;
  findByUserId(userId: number): Promise<GoodDeedDto[] | null>;
  updateGoodDeed(goodDeedUpdate: GoodDeedUpdateDto): Promise<Result>;
  deleteGoodDeed(goodDeedDelete: GoodDeedDeleteDto): Promise<Result>;
}