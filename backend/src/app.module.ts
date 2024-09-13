/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AutoMapperModule } from './automapper/autoMapper.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { GoodDeedModule } from './good_deed/good.deed.module';
import { AuthenticationGuardModule } from './authentication_guard/authentication.guard.module';
import { GoodDeed } from './entities/db_entities/good.deed';
import { User } from './entities/db_entities/user';
import { UserFriend } from './entities/db_entities/user.friend';

@Module({
  imports: [
    UserModule,
    GoodDeedModule,
    AutoMapperModule, 
    AuthenticationGuardModule,
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USERNAME'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB_NAME'),
        entities: [User, GoodDeed, UserFriend],
        synchronize: true,
        migrations: ['dist/migration/*.js'],
        migrationsTableName: 'migrations',
      }),
    }), 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
