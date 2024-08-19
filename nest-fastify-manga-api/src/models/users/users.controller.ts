import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NoFilesInterceptor } from '@nestjs/platform-express';

import { CreateUserRequest } from './dto/create-user.request';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/current-user.decorator';
import { TokenPayload } from '../../auth/interfaces/token-payload.interface';
import { FindAllUsersRequest } from './dto/find-all-users.request';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  createUser(@Body() request: CreateUserRequest) {
    return this.usersService.createUser(request);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: TokenPayload) {
    return user;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() request: FindAllUsersRequest) {
    return this.usersService.findAll({ ...request });
  }
}
