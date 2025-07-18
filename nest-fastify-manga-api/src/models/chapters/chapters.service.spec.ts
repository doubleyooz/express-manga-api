import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Chapter } from './chapters.schema';
import { ChaptersService } from './chapters.service';
import { ChaptersRepository } from './chapters.repository';
import { MangasRepository } from '../mangas/mangas.repository';
import { LocalStorageService } from '../../common/storage/local-storage.service';

import { CreateChapterRequest } from './dto/create-chapter.request';
import { FindChaptersRequest } from './dto/find-chapters.request';
import { UpdateChapterRequest } from './dto/update-chapter.request';
// Example DTOs (adjust based on actual DTO definitions)

describe('ChaptersService', () => {
  let service: ChaptersService;
  let chaptersRepository: ChaptersRepository;
  let mangasRepository: MangasRepository;
  let localStorageService: LocalStorageService;

  // Mock dependencies
  const mockChaptersRepository = {
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

  const mockMangasRepository = {
    findOneAndUpdate: jest.fn(),
  };

  const mockLocalStorageService = {
    deleteFiles: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
    getOrThrow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChaptersService,
        {
          provide: ChaptersRepository,
          useValue: mockChaptersRepository,
        },
        {
          provide: MangasRepository,
          useValue: mockMangasRepository,
        },
        {
          provide: LocalStorageService,
          useValue: mockLocalStorageService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ChaptersService>(ChaptersService);
    chaptersRepository = module.get<ChaptersRepository>(ChaptersRepository);
    mangasRepository = module.get<MangasRepository>(MangasRepository);
    localStorageService = module.get<LocalStorageService>(LocalStorageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createChapterRequest: CreateChapterRequest = {
      title: 'Test Chapter',
      mangaId: new Types.ObjectId(),
      number: 1,
      description: '',
      language: '',
      views: 0
    };
    const createdChapter: Chapter = {
      _id: new Types.ObjectId(),
      ...createChapterRequest,
    };

    it('should create a chapter successfully', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      mockChaptersRepository.create.mockResolvedValue(createdChapter);

      const result = await service.create(createChapterRequest);

      expect(consoleLogSpy).toHaveBeenCalledWith(createChapterRequest);
      expect(chaptersRepository.create).toHaveBeenCalledWith(createChapterRequest);
      expect(result).toEqual(createdChapter);
      consoleLogSpy.mockRestore();
    });

    it('should throw InternalServerErrorException on error', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const error = { code: 'DB_ERROR', message: 'Database error' };
      mockChaptersRepository.create.mockRejectedValue(error);

      await expect(service.create(createChapterRequest)).rejects.toThrow(
        new InternalServerErrorException({ code: error.code, msg: 'Error while creating chapter' }),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(createChapterRequest);
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(chaptersRepository.create).toHaveBeenCalledWith(createChapterRequest);
      consoleLogSpy.mockRestore();
    });
  });

  describe('find', () => {
    const findChaptersRequest: FindChaptersRequest = {
      mangaId: new Types.ObjectId(),
    };
    const chapters: Chapter[] = [
      {
        _id: new Types.ObjectId(),
        title: 'Chapter 1',
        mangaId: findChaptersRequest.mangaId,
        number: 1,
        files: [],
        views: 0,
        description: '',
        language: 'pt'
      },
    ];

    it('should return a list of chapters', async () => {
      mockChaptersRepository.find.mockResolvedValue(chapters);

      const result = await service.find(findChaptersRequest);

      expect(chaptersRepository.find).toHaveBeenCalledWith(findChaptersRequest);
      expect(result).toEqual(chapters);
    });
  });

  describe('findById', () => {
    const chapterId = new Types.ObjectId();
    const chapter: Chapter = {
      _id: chapterId,
      title: 'Test Chapter',
      mangaId: new Types.ObjectId(),
      number: 1,
      files: [],
      views: 0,
      description: '',
      language: 'en'
    };

    it('should return a chapter by ID', async () => {
      mockChaptersRepository.findOne.mockResolvedValue(chapter);

      const result = await service.findById({ _id: chapterId });

      expect(chaptersRepository.findOne).toHaveBeenCalledWith(chapterId);
      expect(result).toEqual(chapter);
    });

    it('should throw NotFoundException if chapter is not found', async () => {
      mockChaptersRepository.findOne.mockResolvedValue(null);

      await expect(service.findById({ _id: chapterId })).rejects.toThrow(
        new NotFoundException('Chapter not found.'),
      );
      expect(chaptersRepository.findOne).toHaveBeenCalledWith(chapterId);
    });
  });

  describe('update', () => {
    const chapterId = new Types.ObjectId();
    const updateChapterRequest: UpdateChapterRequest = {
      title: 'Updated Chapter',
      number: 2,
    };
    const updatedChapter: Chapter = {
      _id: chapterId,
      title: 'Updated Chapter',
      mangaId: new Types.ObjectId(),
      number: 2,
      files: [],
      views: 0,
      description: '',
      language: 'en'
    };

    it('should update a chapter successfully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockChaptersRepository.findOneAndUpdate.mockResolvedValue(updatedChapter);

      const result = await service.update(chapterId, updateChapterRequest);

      expect(chaptersRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: chapterId },
        { $set: updateChapterRequest },
        { new: true },
      );
      expect(result).toEqual(updatedChapter);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should throw NotFoundException if chapter is not found', async () => {
      mockChaptersRepository.findOneAndUpdate.mockResolvedValue(null);

      await expect(service.update(chapterId, updateChapterRequest)).rejects.toThrow(
        new NotFoundException('Chapter not found'),
      );
      expect(chaptersRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: chapterId },
        { $set: updateChapterRequest },
        { new: true },
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = { code: 'DB_ERROR', message: 'Database error' };
      mockChaptersRepository.findOneAndUpdate.mockRejectedValue(error);

      await expect(service.update(chapterId, updateChapterRequest)).rejects.toThrow(
        new InternalServerErrorException({ code: error.code, msg: 'Error while updating cover' }),
      );
      expect(chaptersRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: chapterId },
        { $set: updateChapterRequest },
        { new: true },
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating cover:', error);
      consoleErrorSpy.mockRestore();
    });
  });

  describe('deleteById', () => {
    const chapterId = new Types.ObjectId();
    const mangaId = new Types.ObjectId();
    const chapter: Chapter = {
      _id: chapterId,
      title: 'Test Chapter',
      mangaId,
      number: 1,
      files: [{
        filename: 'file1.jpg',
        size: 0,
        destination: '/uploads/',
        mimetype: '',
        fieldname: '',
        originalname: '',
        encoding: ''
      }, {
        filename: 'file2.jpg',
        size: 0,
        destination: '',
        mimetype: '',
        fieldname: '',
        originalname: 'dasdasdas.jpg',
        encoding: ''
      }],
      views: 0,
      description: '',
      language: ''
    };
    const session = { id: 'session-id' };

    it('should delete a chapter successfully and remove files', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockChaptersRepository.startTransaction.mockResolvedValue(session);
      mockChaptersRepository.findOneAndDelete.mockResolvedValue(chapter);
      mockMangasRepository.findOneAndUpdate.mockResolvedValue({ _id: mangaId });
      mockLocalStorageService.deleteFiles.mockResolvedValue(undefined);
      mockChaptersRepository.commitTransaction.mockResolvedValue(undefined);
      mockChaptersRepository.endSession.mockResolvedValue(undefined);

      const result = await service.deleteById(chapterId);

      expect(chaptersRepository.startTransaction).toHaveBeenCalled();
      expect(chaptersRepository.findOneAndDelete).toHaveBeenCalledWith({ _id: chapterId });
      expect(mangasRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: chapter.mangaId },
        { $pull: { chapters: chapterId } },
        { session },
      );
      expect(consoleLogSpy).toHaveBeenCalledWith('Total images to delete:', chapter.files.length);
      expect(localStorageService.deleteFiles).toHaveBeenCalledWith(chapter.files);
      expect(chaptersRepository.commitTransaction).toHaveBeenCalledWith(session);
      expect(chaptersRepository.endSession).toHaveBeenCalledWith(session);
      expect(result).toEqual({ deleted: chapter, deletedFiles: chapter.files.length });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      consoleLogSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should throw NotFoundException if chapter is not found', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockChaptersRepository.startTransaction.mockResolvedValue(session);
      mockChaptersRepository.findOneAndDelete.mockResolvedValue(null);

      await expect(service.deleteById(chapterId)).rejects.toThrow(new NotFoundException());
      expect(chaptersRepository.findOneAndDelete).toHaveBeenCalledWith({ _id: chapterId });
      expect(mangasRepository.findOneAndUpdate).not.toHaveBeenCalled();
      expect(localStorageService.deleteFiles).not.toHaveBeenCalled();
      expect(chaptersRepository.abortTransaction).toHaveBeenCalledWith(session);
      expect(chaptersRepository.endSession).toHaveBeenCalledWith(session);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', expect.any(NotFoundException));
      consoleErrorSpy.mockRestore();
    });

    it('should handle file deletion failure without throwing', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const fileError = new Error('File deletion failed');
      mockChaptersRepository.startTransaction.mockResolvedValue(session);
      mockChaptersRepository.findOneAndDelete.mockResolvedValue(chapter);
      mockMangasRepository.findOneAndUpdate.mockResolvedValue({ _id: mangaId });
      mockLocalStorageService.deleteFiles.mockRejectedValue(fileError);
      mockChaptersRepository.commitTransaction.mockResolvedValue(undefined);
      mockChaptersRepository.endSession.mockResolvedValue(undefined);

      const result = await service.deleteById(chapterId);

      expect(chaptersRepository.findOneAndDelete).toHaveBeenCalledWith({ _id: chapterId });
      expect(mangasRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: chapter.mangaId },
        { $pull: { chapters: chapterId } },
        { session },
      );
      expect(localStorageService.deleteFiles).toHaveBeenCalledWith(chapter.files);
      expect(consoleErrorSpy).toHaveBeenCalledWith('File deletion failed:', fileError);
      expect(chaptersRepository.commitTransaction).toHaveBeenCalledWith(session);
      expect(result).toEqual({ deleted: chapter, deletedFiles: chapter.files.length });
      consoleLogSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });
});