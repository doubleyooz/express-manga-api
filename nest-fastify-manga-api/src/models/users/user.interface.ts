export interface IUser {
  _id: string;
  email: string;
  password: string;
  tokenVersion: number;
  resetLink: string;
  active: boolean;
  role: string;
}
