import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

import { MangasController } from './mangas.controller';
import { MangasService } from './mangas.service';
import { CreateMangaRequest } from './dto/create-manga.request';
import { UpdateMangaRequest } from './dto/update-manga.request';
import { FindMangasRequest } from './dto/find-mangas.request';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

describe('MangasController', () => {
  let controller: MangasController;
  let mangasService: MangasService;

  // Mock MangasService
  const mockMangasService = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    deleteById: jest.fn(),
  };

  // Mock JwtAuthGuard
  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true), // Allow all requests to pass
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MangasController],
      providers: [
        {
          provide: MangasService,
          useValue: mockMangasService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<MangasController>(MangasController);
    mangasService = module.get<MangasService>(MangasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
    const createdManga = {
      _id: new Types.ObjectId(),
      ...createMangaRequest,
    };

    it('should create a manga successfully', async () => {
      mockMangasService.create.mockResolvedValue(createdManga);

      const result = await controller.create(createMangaRequest);

      expect(mangasService.create).toHaveBeenCalledWith(createMangaRequest);
      expect(result).toEqual(createdManga);
    });
  });

  describe('findAll', () => {
    const findMangasRequest: FindMangasRequest = { genres: ['Action'] };
    const mangas = [
      { _id: new Types.ObjectId(), title: 'Manga 1', author: 'Author 1', genre: 'Action' },
      { _id: new Types.ObjectId(), title: 'Manga 2', author: 'Author 2', genre: 'Action' },
    ];

    it('should return a list of mangas', async () => {
      mockMangasService.find.mockResolvedValue(mangas);

      const result = await controller.findAll(findMangasRequest);

      expect(mangasService.find).toHaveBeenCalledWith(findMangasRequest);
      expect(result).toEqual(mangas);
    });
  });

  describe('findOne', () => {
    const mangaId = new Types.ObjectId();
    const manga = { _id: mangaId, title: 'Test Manga', author: 'Test Author', genre: 'Action' };

    it('should return a manga by ID', async () => {
      mockMangasService.findById.mockResolvedValue(manga);

      const result = await controller.findOne(mangaId);

      expect(mangasService.findById).toHaveBeenCalledWith(mangaId);
      expect(result).toEqual(manga);
    });

    it('should throw NotFoundException if manga is not found', async () => {
      mockMangasService.findById.mockResolvedValue(null);

      await expect(controller.findOne(mangaId)).rejects.toThrow(
        new NotFoundException(`Manga with ID ${mangaId} not found`),
      );
      expect(mangasService.findById).toHaveBeenCalledWith(mangaId);
    });
  });

  describe('update', () => {
    const mangaId = new Types.ObjectId();
    const updateMangaRequest: UpdateMangaRequest = {
      title: 'Updated Manga',
      synopsis: 'Updated Description',
    };
    const updatedManga = { _id: mangaId, ...updateMangaRequest, genre: 'Action' };

    it('should update a manga successfully', async () => {
      mockMangasService.update.mockResolvedValue(updatedManga);

      const result = await controller.update(mangaId, updateMangaRequest);

      expect(mangasService.update).toHaveBeenCalledWith(mangaId, updateMangaRequest);
      expect(result).toEqual(updatedManga);
    });

    it('should throw NotFoundException if manga is not found', async () => {
      mockMangasService.update.mockResolvedValue(null);

      await expect(controller.update(mangaId, updateMangaRequest)).rejects.toThrow(
        new NotFoundException(`Manga with ID ${mangaId} not found`),
      );
      expect(mangasService.update).toHaveBeenCalledWith(mangaId, updateMangaRequest);
    });
  });

  describe('delete', () => {
    const mangaId = new Types.ObjectId();

    it('should delete a manga successfully', async () => {
      mockMangasService.deleteById.mockResolvedValue(true);

      const result = await controller.delete(mangaId);

      expect(mangasService.deleteById).toHaveBeenCalledWith(mangaId);
      expect(result).toEqual({ message: `Manga with ID ${mangaId} deleted successfully` });
    });

    it('should throw NotFoundException if manga is not found', async () => {
      mockMangasService.deleteById.mockResolvedValue(false);

      await expect(controller.delete(mangaId)).rejects.toThrow(
        new NotFoundException(`Manga with ID ${mangaId} not found`),
      );
      expect(mangasService.deleteById).toHaveBeenCalledWith(mangaId);
    });
  });
});