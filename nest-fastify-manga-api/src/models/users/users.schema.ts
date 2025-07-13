import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';
import { USER } from './constants/user';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends AbstractDocument {
  @Prop({ unique: true })
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop({ default: 0 })
  tokenVersion: number;

  @Prop({ select: false })
  resetLink: string;

  @Prop({ default: false })
  active: boolean;

  @Prop({ default: USER })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
