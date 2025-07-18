import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../models/users/users.service';
const mockResponse = () => ({
  cookie: jest.fn(),
  clearCookie: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let response: ReturnType<typeof mockResponse>;

  // Mock dependencies
  const mockUsersService = {
    getUser: jest.fn(),
    updateTokenVersion: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    response = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
