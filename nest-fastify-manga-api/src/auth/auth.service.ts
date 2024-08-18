import { Request, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../models/users/users.service';
import { TokenPayload } from './interfaces/token-payload.interface';
import { IUser } from 'src/models/users/user.interface';
import { AUTHENTICATION_COOKIE } from './constants/auth-cookie';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async verifyUser(email: string, password: string) {
    const user = await this.usersService.getUser(
      { email },
      { password: true, tokenVersion: true },
    );
    if (!user) throw new UnauthorizedException('Credentials are not valid.');

    const authenticated = await bcrypt.compare(password, user.password);
    if (!authenticated)
      throw new UnauthorizedException('Credentials are not valid.');

    return user;
  }

  async login(user: IUser, res: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id,
      tokenVersion: user.tokenVersion,
    };

    const refreshTokenExpiration = new Date();

    refreshTokenExpiration.setSeconds(
      refreshTokenExpiration.getSeconds() +
        this.configService.get<number>('REFRESH_TOKEN_EXPIRATION'),
    );

    const accessToken = this.jwtService.sign(tokenPayload);
    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn:
        this.configService.get<number>('REFRESH_TOKEN_EXPIRATION') + 's',
    });

    res.cookie(AUTHENTICATION_COOKIE, refreshToken, {
      secure: true,
      httpOnly: true,
      expires: refreshTokenExpiration,
    });

    return { accessToken };
  }

  async googleLogin(@Request() req, res: Response) {
    const user = await this.usersService.getUser(
      { email: req.user.email },
      { tokenVersion: true },
    );
    if (!user) throw new UnauthorizedException('Credentials are not valid.');

    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      tokenVersion: user.tokenVersion,
    };

    const refreshTokenExpiration = new Date();

    refreshTokenExpiration.setSeconds(
      refreshTokenExpiration.getSeconds() +
        this.configService.get<number>('REFRESH_TOKEN_EXPIRATION'),
    );

    const accessToken = this.jwtService.sign(tokenPayload);
    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn:
        this.configService.get<number>('REFRESH_TOKEN_EXPIRATION') + 's',
    });

    res.cookie(AUTHENTICATION_COOKIE, refreshToken, {
      secure: true,
      httpOnly: true,
      expires: refreshTokenExpiration,
    });

    return { accessToken };
  }

  async logout(user: IUser, response: Response) {
    await this.usersService.updateTokenVersion(user._id);
    response.clearCookie(AUTHENTICATION_COOKIE);
  }
}
