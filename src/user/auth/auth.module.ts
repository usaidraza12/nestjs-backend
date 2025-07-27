import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SignUser, UserSign } from '../signup';
import { LoginSchema, Loguser } from 'src/login';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'process';

@Module({
  imports: [
  
    MongooseModule.forFeature([
      { name: SignUser.name, schema: UserSign },
      { name: Loguser.name, schema: LoginSchema },
    ]),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: (config: ConfigService)=>({
        secret:"secret1234",
        signOptions:{expiresIn:'1d'}
      })
    }),
    //   ConfigModule,
    // PassportModule,
    // JwtModule.register({
    //   secret: 'secretkey123', // Ideally use ConfigService.get('JWT_SECRET')
    //   signOptions: { expiresIn: '1d' },
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  exports: [AuthService,JwtModule],
})
export class AuthModule {}

