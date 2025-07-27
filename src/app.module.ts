import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './user/auth/auth.module';

@Module({
  imports: [
     MongooseModule.forRoot('mongodb+srv://usaidmalik455:gTZBd11o431qhUGP@cluster0.ansuc.mongodb.net/nest-crud'), 
    UserModule,
    ConfigModule.forRoot({
      isGlobal:true
    }),
     AuthModule,
    

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
