import { Types } from 'mongoose';

export interface TokenPayload {
  userId: Types.ObjectId;
  tokenVersion: number;
}
