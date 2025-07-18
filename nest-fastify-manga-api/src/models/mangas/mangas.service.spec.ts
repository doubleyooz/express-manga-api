import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MangasService } from './mangas.service';
import { MangasRepository } from './mangas.repository';
import { LocalStorageService } from '../../common/storage/local-storage.service';
import { CreateMangaRequest } from './dto/create-manga.request';
import { UpdateMangaRequest } from './dto/update-manga.request';
import { Manga } from './mangas.schema';
import { ChaptersRepository } from '../chapters/chapters.repository';
import { CoversRepository } from '../covers/covers.repository';
import { ReviewsRepository } from '../reviews/reviews.repository';
import { UsersRepository } from '../users/users.repository';

describe('MangasService', () => {
  let service: MangasService;
  let mangasRepository: MangasRepository;
  let chaptersRepository: ChaptersRepository;
  let coversRepository: CoversRepository;
  let reviewsRepository: ReviewsRepository;
  let usersRepository: UsersRepository;
  let localStorageService: LocalStorageService;

  // Mock dependencies
  const mockMangasRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
  };

  const mockChaptersRepository = {
    deleteMany: jest.fn(),
    find: jest.fn(),
  };

  const mockCoversRepository = {
    deleteMany: jest.fn(),
  };

  const mockReviewsRepository = {
    deleteMany: jest.fn(),
  };

  const mockUsersRepository = {
    updateMany: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
    getOrThrow: jest.fn(),
  };

  const mockLocalStorageService = {
    uploadFile: jest.fn(),
  };

  const mockSession = { session: 'mock-session' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MangasService,
        {
          provide: MangasRepository,
          useValue: mockMangasRepository,
        },
        {
          provide: ChaptersRepository,
          useValue: mockChaptersRepository,
        },
        {
          provide: CoversRepository,
          useValue: mockCoversRepository,
        },
        {
          provide: ReviewsRepository,
          useValue: mockReviewsRepository,
        },
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: LocalStorageService,
          useValue: mockLocalStorageService,
        },
      ],
    }).compile();

    service = module.get<MangasService>(MangasService);
    mangasRepository = module.get<MangasRepository>(MangasRepository);
    chaptersRepository = module.get<ChaptersRepository>(ChaptersRepository);
    coversRepository = module.get<CoversRepository>(CoversRepository);
    reviewsRepository = module.get<ReviewsRepository>(ReviewsRepository);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    localStorageService = module.get<LocalStorageService>(LocalStorageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createMangaRequest: CreateMangaRequest = {
      title: 'Test Manga',
      synopsis: 'Test Author',
      genres: ['Action'],
      themes: [],
      type: '',
      status: '',
      nsfw: false,
      userId: new Types.ObjectId(),
      covers: [],
      chapters: [],
      subscribers: [],
      likes: []
    };
    const createdManga: Manga = {
      _id: new Types.ObjectId(),
      ...createMangaRequest,
    } as Manga;

    it('should create a manga successfully', async () => {
      mockMangasRepository.create.mockResolvedValue(createdManga);

      const result = await service.create(createMangaRequest);

      expect(mangasRepository.create).toHaveBeenCalledWith(createMangaRequest);
      expect(result).toEqual(createdManga);
    });

    it('should throw InternalServerErrorException on error', async () => {
      const error = { code: 'ERR123', message: 'Database error' };
      mockMangasRepository.create.mockRejectedValue(error);

      await expect(service.create(createMangaRequest)).rejects.toThrow(
        new InternalServerErrorException('Error while creating manga'),
      );
      expect(mangasRepository.create).toHaveBeenCalledWith(createMangaRequest);
    });
  });

  describe('find', () => {
    const filter = { genre: 'Action' };
    const mangas: Manga[] = [
      {
        _id: new Types.ObjectId(),
        title: 'Manga 1',
        genres: [],
        themes: [],
        type: '',
        status: '',
        synopsis: 'dasdasdas',
        nsfw: false,
        covers: [],
        chapters: [],
        subscribers: [],
        likes: [],
        userId: new Types.ObjectId()
      },
    ];

    it('should return mangas for a valid filter', async () => {
      mockMangasRepository.find.mockResolvedValue(mangas);

      const result = await service.find(filter);

      expect(mangasRepository.find).toHaveBeenCalledWith({ where: filter });
      expect(result).toEqual(mangas);
    });

    it('should throw NotFoundException if no mangas are found', async () => {
      mockMangasRepository.find.mockResolvedValue([]);

      await expect(service.find(filter)).rejects.toThrow(
        new NotFoundException('Manga not found'),
      );
      expect(mangasRepository.find).toHaveBeenCalledWith({ where: filter });
    });
  });

  describe('findById', () => {
    const mangaId = new Types.ObjectId();
    const manga: Manga = {
      _id: mangaId,
      title: 'Test Manga2',
      genres: [],
      themes: [],
      type: '',
      status: '',
      synopsis: 'dasdasdasdas',
      nsfw: false,
      covers: [],
      chapters: [],
      subscribers: [],
      likes: [],
      userId: new Types.ObjectId()
    };

    it('should return a manga by ID', async () => {
      mockMangasRepository.findOne.mockResolvedValue(manga);

      const result = await service.findById(mangaId);

      expect(mangasRepository.findOne).toHaveBeenCalledWith(mangaId);
      expect(result).toEqual(manga);
    });

    it('should throw NotFoundException if manga is not found', async () => {
      mockMangasRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(mangaId)).rejects.toThrow(
        new NotFoundException(`Manga with ID ${mangaId} not found`),
      );
      expect(mangasRepository.findOne).toHaveBeenCalledWith(mangaId);
    });
  });

  describe('update', () => {
    const mangaId = new Types.ObjectId();
    const updateMangaRequest: UpdateMangaRequest = {
      title: 'Updated Manga',
      synopsis: 'Updated Author',
    };
    const updatedManga: Manga = {
      _id: mangaId,
      ...updateMangaRequest,
    
    
    } as Manga;

    it('should update a manga successfully', async () => {
      mockMangasRepository.findOneAndUpdate.mockResolvedValue(updatedManga);

      const result = await service.update(mangaId, updateMangaRequest);

      expect(mangasRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mangaId },
        { $set: updateMangaRequest },
        { new: true },
      );
      expect(result).toEqual(updatedManga);
    });

    it('should throw NotFoundException if manga is not found', async () => {
      mockMangasRepository.findOneAndUpdate.mockResolvedValue(null);

      await expect(service.update(mangaId, updateMangaRequest)).rejects.toThrow(
        new NotFoundException(`Manga with ID ${mangaId} not found`),
      );
      expect(mangasRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mangaId },
        { $set: updateMangaRequest },
        { new: true },
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      const error = { code: 'ERR123', message: 'Database error' };
      mockMangasRepository.findOneAndUpdate.mockRejectedValue(error);

      await expect(service.update(mangaId, updateMangaRequest)).rejects.toThrow(
        new InternalServerErrorException('Error while updating manga'),
      );
      expect(mangasRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mangaId },
        { $set: updateMangaRequest },
        { new: true },
      );
    });
  });

  describe('deleteById', () => {
    const mangaId = new Types.ObjectId();
    const manga: Manga = {
      _id: mangaId,
      title: 'Test Manga',
      genres: [],
      themes: [],
      type: '',
      status: '',
      synopsis: '',
      nsfw: false,
      covers: [],
      chapters: [],
      subscribers: [],
      likes: [],
      userId: new Types.ObjectId()
    };

    it('should delete a manga successfully', async () => {
      mockMangasRepository.findOneAndDelete.mockResolvedValue(manga);

      const result = await service.deleteById(mangaId);

      expect(mangasRepository.findOneAndDelete).toHaveBeenCalledWith({ _id: mangaId });
      expect(result).toBe(true);
    });

    it('should throw NotFoundException if manga is not found', async () => {
      mockMangasRepository.findOneAndDelete.mockResolvedValue(null);

      await expect(service.deleteById(mangaId)).rejects.toThrow(
        new NotFoundException(`Manga with ID ${mangaId} not found`),
      );
      expect(mangasRepository.findOneAndDelete).toHaveBeenCalledWith({ _id: mangaId });
    });
  });
});