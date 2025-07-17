import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  tokenVersion: number;
  resetLink: string;
  active: boolean;
  role: string;
}
