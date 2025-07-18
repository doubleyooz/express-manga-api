import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nest-lab/fastify-multer';

import { Chapter, ChapterSchema } from './chapters.schema';
import { MangasModule } from '../mangas/mangas.module';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ParseFilePipe } from '../../common/pipes/image.pipe';

import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { ChaptersRepository } from './chapters.repository';
import { LocalStorageService } from '../../common/storage/local-storage.service';

import { CreateChapterRequest } from './dto/create-chapter.request';
import { FindChaptersRequest } from './dto/find-chapters.request';
import { UpdateChapterRequest } from './dto/update-chapter.request';
import { ImageInterface } from '../../common/interfaces/image.interface';

describe('ChaptersController', () => {
  let controller: ChaptersController;
  let chaptersService: ChaptersService;

  // Mock ChaptersService
  const mockChaptersService = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    deleteById: jest.fn(),
  };

  // Mock ChaptersRepository
  const mockChaptersRepository = {
    // Add repository methods if needed
  };

  // Mock LocalStorageService
  const mockLocalStorageService = {
    // Mock file upload methods if used by ChaptersService
    uploadFile: jest.fn(),
  };

  // Mock JwtAuthGuard
  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  // Mock ParseFilePipe
  const mockParseFilePipe = {
    transform: jest.fn((files) => files), // Pass through files for simplicity
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([
          { name: Chapter.name, schema: ChapterSchema },
        ]),
        // Mock MangasModule to handle forwardRef
        {
          provide: 'MangasModule',
          useValue: {},
        },
      ],
      controllers: [ChaptersController],
      providers: [
        {
          provide: ChaptersService,
          useValue: mockChaptersService,
        },
        {
          provide: ChaptersRepository,
          useValue: mockChaptersRepository,
        },
        {
          provide: LocalStorageService,
          useValue: mockLocalStorageService,
        },
        {
          provide: ParseFilePipe,
          useValue: mockParseFilePipe,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideInterceptor(FileInterceptor)
      .useValue({
        intercept: jest.fn((ctx, next) => next()), // Mock FileInterceptor
      })
      .compile();

    controller = module.get<ChaptersController>(ChaptersController);
    chaptersService = module.get<ChaptersService>(ChaptersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createChapterRequest: CreateChapterRequest = {
      title: 'Test Chapter',
      mangaId: new Types.ObjectId(),
      number: 1,
      description: '',
      language: 'pt',
      views: 0,
    };
    const files: ImageInterface[] = [
      {
        originalname: 'file1.jpg',
        buffer: Buffer.from('file1'),
        mimetype: 'image/jpeg',
        destination: '.uploads/',
        size: 1000,
        filename: '',
        fieldname: '',
        encoding: '',
      },
    ];
    const createdChapter = {
      _id: new Types.ObjectId(),
      ...createChapterRequest,
    };

    it('should create a chapter successfully', async () => {
      mockChaptersService.create.mockResolvedValue(createdChapter);
      mockParseFilePipe.transform.mockResolvedValue(files);

      const result = await controller.create(createChapterRequest, files);

      expect(chaptersService.create).toHaveBeenCalledWith(createChapterRequest);
      expect(mockParseFilePipe.transform).toHaveBeenCalledWith(
        files,
        expect.anything(),
      );
      expect(result).toEqual(createdChapter);
    });

    it('should log request and files', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      mockChaptersService.create.mockResolvedValue(createdChapter);
      mockParseFilePipe.transform.mockResolvedValue(files);

      await controller.create(createChapterRequest, files);

      expect(consoleLogSpy).toHaveBeenCalledWith(createChapterRequest, files);
      consoleLogSpy.mockRestore();
    });
  });

  describe('findAll', () => {
    const findChaptersRequest: FindChaptersRequest = {
      mangaId: new Types.ObjectId(),

    };
    const chapters: Chapter[] = [
      {
        _id: new Types.ObjectId(),
        title: 'Chapter 1',
        mangaId: findChaptersRequest.mangaId,
        number: 1,
        views: 0,
        description: '',
        language: ''
      },
      {
        _id: new Types.ObjectId(),
        title: 'Chapter 2',
        mangaId: findChaptersRequest.mangaId,
        number: 2,
        views: 0,
        description: '',
        language: ''
      },
    ];

    it('should return a list of chapters', async () => {
      mockChaptersService.find.mockResolvedValue(chapters);

      const result = await controller.findAll(findChaptersRequest);

      expect(chaptersService.find).toHaveBeenCalledWith(findChaptersRequest);
      expect(result).toEqual(chapters);
    });
  });

  describe('findOne', () => {
    const chapterId = new Types.ObjectId();
    const chapter = {
      _id: chapterId,
      title: 'Test Chapter',
      mangaId: new Types.ObjectId(),
      chapterNumber: 1,
    };

    it('should return a chapter by ID', async () => {
      mockChaptersService.findById.mockResolvedValue(chapter);

      const result = await controller.findOne(chapterId);

      expect(chaptersService.findById).toHaveBeenCalledWith(chapterId);
      expect(result).toEqual(chapter);
    });

    it('should throw NotFoundException if chapter is not found', async () => {
      mockChaptersService.findById.mockResolvedValue(null);

      await expect(controller.findOne(chapterId)).rejects.toThrow(
        new NotFoundException(`Chapter with ID ${chapterId} not found`),
      );
      expect(chaptersService.findById).toHaveBeenCalledWith(chapterId);
    });
  });

  describe('update', () => {
    const chapterId = new Types.ObjectId();
    const updateChapterRequest: UpdateChapterRequest = {
      title: 'Updated Chapter',
      number: 3,
    };
    const updatedChapter = {
      _id: chapterId,
      ...updateChapterRequest,
      mangaId: new Types.ObjectId(),
    };

    it('should update a chapter successfully', async () => {
      mockChaptersService.update.mockResolvedValue(updatedChapter);

      const result = await controller.update(chapterId, updateChapterRequest);

      expect(chaptersService.update).toHaveBeenCalledWith(
        chapterId,
        updateChapterRequest,
      );
      expect(result).toEqual(updatedChapter);
    });

    it('should throw NotFoundException if chapter is not found', async () => {
      mockChaptersService.update.mockResolvedValue(null);

      await expect(
        controller.update(chapterId, updateChapterRequest),
      ).rejects.toThrow(
        new NotFoundException(`Chapter with ID ${chapterId} not found`),
      );
      expect(chaptersService.update).toHaveBeenCalledWith(
        chapterId,
        updateChapterRequest,
      );
    });
  });

  describe('delete', () => {
    const chapterId = new Types.ObjectId();

    it('should delete a chapter successfully', async () => {
      mockChaptersService.deleteById.mockResolvedValue(true);

      const result = await controller.delete(chapterId);

      expect(chaptersService.deleteById).toHaveBeenCalledWith(chapterId);
      expect(result).toEqual({
        message: `Chapter with ID ${chapterId} deleted successfully`,
      });
    });

    it('should throw NotFoundException if chapter is not found', async () => {
      mockChaptersService.deleteById.mockResolvedValue(false);

      await expect(controller.delete(chapterId)).rejects.toThrow(
        new NotFoundException(`Chapter with ID ${chapterId} not found`),
      );
      expect(chaptersService.deleteById).toHaveBeenCalledWith(chapterId);
    });
  });
});
