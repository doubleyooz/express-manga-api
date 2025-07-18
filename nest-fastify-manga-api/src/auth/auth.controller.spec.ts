import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../models/users/users.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';
import { Types } from 'mongoose';

// Mock Response object
const mockResponse = () => ({
  cookie: jest.fn().mockReturnThis(),
  clearCookie: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Mock dependencies
  const mockAuthService = {
    verifyUser: jest.fn(),
    login: jest.fn(),
    googleLogin: jest.fn(),
    logout: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'REFRESH_TOKEN_SECRET':
          return 'refresh-secret';
        case 'REFRESH_TOKEN_EXPIRATION':
          return 604800; // 7 days in seconds
        case 'ACCESS_TOKEN_SECRET':
          return 'access-secret';
        default:
          return null;
      }
    }),
    getOrThrow: jest.fn((key: string) => {
      switch (key) {
        case 'ACCESS_TOKEN_SECRET':
          return 'access-secret';
        default:
          throw new Error(`Config key ${key} not found`);
      }
    }),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUsersService = {
    getUser: jest.fn(),
    updateTokenVersion: jest.fn(),
  };

  const mockLocalAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue(mockLocalAuthGuard)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
