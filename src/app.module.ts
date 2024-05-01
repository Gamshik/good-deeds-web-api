import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [UserModule, AuthenticationModule],
  controllers: [AppController, AuthenticationController],
  providers: [AppService, UserService, AuthenticationService],
})
export class AppModule {}
