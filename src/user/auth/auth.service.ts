import { Injectable, NotFoundException ,UnauthorizedException,BadRequestException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User,UserDocument } from '../user.schema';
import { UserDto } from '../dto/signup.dto';
import { ChangePasswordDto } from '../dto/changepassword.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { SignUser, UserCreate } from '../signup';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt'
import { Loguser, Userlogin } from 'src/login';
import { LoginDto } from '../dto/login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(SignUser.name) private createu:Model<UserCreate>,
    @InjectModel(Loguser.name)  private check:Model<Userlogin>,
    private jwtService: JwtService,
  ) {}

   async createUser(createUserDto: UserDto): Promise<SignUser> {
  const { name, email, password, phone } = createUserDto;

  // Check if user already exists
  const existingUser = await this.createu.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new this.createu({
    name,
    email,
    password: hashedPassword,
    phone,
  });

    return newUser.save();
   }

  //    async login(email: string, password: string): Promise<{ user:SignUser; token: string }> {
  //   const userinfo = await this.createu.findOne({ email });

  //   if (!userinfo) {
  //     console.log(" con err")
  //     throw new UnauthorizedException('Invalid email or password');
  //   }

  //   const isMatch = await bcrypt.compare(password,password);
  //   if (!isMatch) {
  //     console.log(" con err2")

  //     throw new UnauthorizedException('Invalid email or password');
  //   }

  //   const payload = {
  //     email: userinfo.email,
  //   };

  //   const token = this.jwtService.sign(payload);
  //     console.log("con err2")

  //   return {
  //     token,
  //     user:userinfo,
  //   };
  // }
 async login(loginDto: LoginDto) {
    const user = await this.createu.findOne({email: loginDto.email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid email or password');
  }

    const payload = { email: user.email, sub: user._id };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      token,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    };
  }
//  async changePassword(userId: string, body: ChangePasswordDto) {
//   const user = await this.createu.findById(userId);
//   if (!user) throw new NotFoundException('User not found');

//   const isMatch = await bcrypt.compare(body.oldPassword, user.password);
//   if (!isMatch) throw new BadRequestException('Current password is incorrect');

//   const hashedNewPassword = await bcrypt.hash(body.newPassword, 10);
//   user.password = hashedNewPassword;
//   await user.save();

//   return { message: 'Password updated successfully' };
// }

async changePassword(userId: string, dto: ChangePasswordDto) {
  // console.log("body==========================================")
  const user = await this.createu.findById(userId);
  if (!user) throw new NotFoundException('User not found');

  const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
  if (!isMatch) throw new BadRequestException('Old password is incorrect');

  const hashed = await bcrypt.hash(dto.newPassword, 10);
  user.password = hashed;
  await user.save();

  return { message: 'Password changed successfully' };
}
async forgotPassword(body: ForgotPasswordDto) {
  const user = await this.createu.findOne({ email: body.email });
  if (!user) throw new NotFoundException('Email not found');

  const hashedPassword = await bcrypt.hash(body.newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return { message: 'Password reset successfully' };
}
  async findAll(): Promise<SignUser[]> {
    return this.createu.find().exec();
  }

  async resetPassword(token: string, newPassword: string) {
  try {
    const decoded = jwt.verify(token, "secret1234") as { id: string };
    const user = await this.createu.findById(decoded.id).exec();

    if (!user) throw new NotFoundException('Invalid or expired token');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { message: 'Password has been reset successfully' };
  } catch (err) {
    throw new BadRequestException('Invalid or expired token');
  }
}

  async forgotPass(email: string) {
  const user = await this.createu.findOne({ email }).exec();
  if (!user) throw new NotFoundException('User not found');

  const payload = { id: user._id };
  const token = jwt.sign(payload, 'secret1234', { expiresIn: '15m' });

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  // Email logic aap baad mein lagao, abhi console pe print karo
  console.log('Password reset link:', resetLink);

  return { message: 'Reset link sent (console)', resetLink };
}

  async findOne(id: string): Promise<SignUser> {
    const user = await this.createu.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return  user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<SignUser> {
    const updatedUser = await this.createu.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    }).exec();
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async remove(id: string): Promise<SignUser> {
    const deletedUser = await this.createu.findByIdAndDelete(id).exec();
    if (!deletedUser) throw new NotFoundException('User not found');
    return deletedUser;
  }
}
