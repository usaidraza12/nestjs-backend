// src/user/user.controller.ts

import { Controller, Post, Get, Put, Delete, Param, Body,Req, Res ,Query} from '@nestjs/common';
import { UserService } from './user.service';
import { Patch, UseGuards,} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './dto/changepassword.dto';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import {Response,Request} from "express" 
import { ForgotPasswordDto } from './dto/forgot-password.dto';
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userfind : AuthService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('signup')
  usercreate(@Body() userCre:UserDto){
    return this.userfind.createUser(userCre);
  }
 @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userfind.login(loginDto);
  }

///user forget password///


  @Post('forgot-password')
forgotPassw(@Body('email') email: string) {
  return this.userfind.forgotPass(email);
}

@Patch('reset-password')
resetPassword(
  @Query('token') token: string,
  @Body('newPassword') newPassword: string
) {
  return this.userfind.resetPassword(token, newPassword);
}

///user forget password///


  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    // If using cookie-based auth
    res.clearCookie('jwt'); // optional if cookie used
    res.status(200).json({ message: 'Logout successful' });
  }
  // @Post('forgot-password')
  //  async forgotPassword(@Body() body: ForgotPasswordDto) {
  //  return this.userfind.forgotPassword(body);
  // }

///user forget password///


//   @Patch('change-password')
// // @UseGuards(AuthGuard('jwt')) // User must be logged in
// async changePa( @Body() body: ChangePasswordDto) {
//   console.log("user in token ===================", body);
//   return "okk"
//   // const userId = req.user; // 👈 this is correct
//   // return this.userfind.changePassword( body);
// }
// @UseGuards(AuthGuard('jwt'))

  // @Patch('change-password')
  //  async changePassword(@Req() req, @Body() body) {
  //   console.log("USER =====>", req.user);
  //    console.log("BODY =====>", body);
  // // const userId = req.user.userId; // ya req.user.id, jo aap token me bhej rahe ho
  // // return this.userfind.changePassword(userId, body);
  // }

  @Patch('change-password')
  @UseGuards(AuthGuard('jwt'))
  changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    // console.log("USER ID ===>", req.user);
    return this.userfind.changePassword(req.user.id, dto);
  }

 

  @Get()
  findAll() {
    return this.userService.findAll();
    
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
