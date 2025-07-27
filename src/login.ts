// src/user/user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type Userlogin = Loguser & Document;

@Schema()
export class Loguser {

  @Prop({ required: true, unique: true })
  email: string;

@Prop({ type: String, required: true })
password: string;

}

export const LoginSchema = SchemaFactory.createForClass(Loguser);
