import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User,UserSchema } from './user.schema';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserSign,SignUser } from './signup';

@Module({
   imports: [
    
     MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      // { name: SignUser.name, schema: UserSign }
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
