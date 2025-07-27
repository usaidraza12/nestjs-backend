// src/user/user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserCreate = SignUser & Document;

@Schema({ timestamps: true })
export class SignUser {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String })
  phone?: string;

  @Prop({ type: String, required: true }) // ✅ Fixed here
  password: string;
}

export const UserSign = SchemaFactory.createForClass(SignUser);
