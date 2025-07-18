import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { ReviewsRepository } from './reviews.repository';
import { UsersRepository } from '../users/users.repository';
import { ConfigService } from '@nestjs/config';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateReviewRequest } from './dto/create-review.request';
import { UpdateReviewRequest } from './dto/update-review.request';
import { Review } from './reviews.schema';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let reviewsRepository: ReviewsRepository;
  let usersRepository: UsersRepository;

  // Mock dependencies
  const mockReviewsRepository = {
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

  const mockUsersRepository = {
    findOneAndUpdate: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
    getOrThrow: jest.fn(),
  };

  const mockSession = { session: 'mock-session' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
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
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    reviewsRepository = module.get<ReviewsRepository>(ReviewsRepository);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createReviewRequest: CreateReviewRequest = {
      userId: new Types.ObjectId(),
      mangaId: new Types.ObjectId(),
      rating: 5,
      text: 'Great manga!',
    };
    const createdReview: Review = {
      _id: new Types.ObjectId(),
      ...createReviewRequest,
    } as Review;

    it('should create a review successfully', async () => {
      mockReviewsRepository.create.mockResolvedValue(createdReview);
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.create(createReviewRequest);

      expect(reviewsRepository.create).toHaveBeenCalledWith(
        createReviewRequest,
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(createReviewRequest);
      expect(consoleLogSpy).toHaveBeenCalledWith(createdReview);
      expect(result).toEqual(createdReview);
      consoleLogSpy.mockRestore();
    });

    it('should throw InternalServerErrorException on error', async () => {
      const error = { code: 'ERR123', message: 'Database error' };
      mockReviewsRepository.create.mockRejectedValue(error);
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      await expect(service.create(createReviewRequest)).rejects.toThrow(
        new InternalServerErrorException({
          code: error.code,
          msg: 'Error while creating review',
        }),
      );
      expect(reviewsRepository.create).toHaveBeenCalledWith(
        createReviewRequest,
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(createReviewRequest);
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      consoleLogSpy.mockRestore();
    });
  });

  describe('find', () => {
    const filter = { mangaId: new Types.ObjectId() };
    const reviews: Review[] = [
      {
        _id: new Types.ObjectId(),
        userId: new Types.ObjectId(),
        mangaId: filter.mangaId,
        rating: 5,
        text: 'Great!',
      },
    ];

    it('should return reviews for a valid filter', async () => {
      mockReviewsRepository.find.mockResolvedValue(reviews);
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.find(filter);

      expect(reviewsRepository.find).toHaveBeenCalledWith({ where: filter });
      expect(consoleLogSpy).toHaveBeenCalledWith({ filter });
      expect(result).toEqual(reviews);
      consoleLogSpy.mockRestore();
    });

    it('should return reviews for an empty filter', async () => {
      mockReviewsRepository.find.mockResolvedValue(reviews);
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.find({});

      expect(reviewsRepository.find).toHaveBeenCalledWith({ where: undefined });
      expect(consoleLogSpy).toHaveBeenCalledWith({ filter: {} });
      expect(result).toEqual(reviews);
      consoleLogSpy.mockRestore();
    });

    it('should throw NotFoundException if no reviews are found', async () => {
      mockReviewsRepository.find.mockResolvedValue([]);
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      await expect(service.find(filter)).rejects.toThrow(
        new NotFoundException('Review not found'),
      );
      expect(reviewsRepository.find).toHaveBeenCalledWith({ where: filter });
      expect(consoleLogSpy).toHaveBeenCalledWith({ filter });
      consoleLogSpy.mockRestore();
    });
  });

  describe('findById', () => {
    const reviewId = new Types.ObjectId();
    const review: Review = {
      _id: reviewId,
      userId: new Types.ObjectId(),
      mangaId: new Types.ObjectId(),
      rating: 5,
      text: 'Great!',
    } as Review;

    it('should return a review by ID', async () => {
      mockReviewsRepository.findOne.mockResolvedValue(review);

      const result = await service.findById({ _id: reviewId });

      expect(reviewsRepository.findOne).toHaveBeenCalledWith(reviewId);
      expect(result).toEqual(review);
    });

    it('should throw NotFoundException if review is not found', async () => {
      mockReviewsRepository.findOne.mockResolvedValue(null);

      await expect(service.findById({ _id: reviewId })).rejects.toThrow(
        new NotFoundException('Review not found.'),
      );
      expect(reviewsRepository.findOne).toHaveBeenCalledWith(reviewId);
    });
  });

  describe('update', () => {
    const reviewId = new Types.ObjectId();
    const updateReviewRequest: UpdateReviewRequest = {
      rating: 4,
      text: 'Updated comment',
    };
    const updatedReview: Review = {
      _id: reviewId,
      userId: new Types.ObjectId(),
      mangaId: new Types.ObjectId(),
      ...updateReviewRequest,
    } as Review;

    it('should update a review successfully', async () => {
      mockReviewsRepository.findOneAndUpdate.mockResolvedValue(updatedReview);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.update(reviewId, updateReviewRequest);

      expect(reviewsRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: reviewId },
        { $set: updateReviewRequest },
        { new: true },
      );
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(result).toEqual(updatedReview);
      consoleErrorSpy.mockRestore();
    });

    it('should throw NotFoundException if review is not found', async () => {
      mockReviewsRepository.findOneAndUpdate.mockResolvedValue(null);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(
        service.update(reviewId, updateReviewRequest),
      ).rejects.toThrow(new NotFoundException('Review not found'));
      expect(reviewsRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: reviewId },
        { $set: updateReviewRequest },
        { new: true },
      );
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should throw InternalServerErrorException on error', async () => {
      const error = { code: 'ERR123', message: 'Database error' };
      mockReviewsRepository.findOneAndUpdate.mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(
        service.update(reviewId, updateReviewRequest),
      ).rejects.toThrow(
        new InternalServerErrorException({
          code: error.code,
          msg: 'Error while updating review',
        }),
      );
      expect(reviewsRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: reviewId },
        { $set: updateReviewRequest },
        { new: true },
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error updating review:',
        error,
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe('deleteById', () => {
    const reviewId = new Types.ObjectId();
    const userId = new Types.ObjectId();
    const review: Review = {
      _id: reviewId,
      userId,
      mangaId: new Types.ObjectId(),
      rating: 5,
      text: 'lame!',
    } as Review;

    it('should delete a review successfully', async () => {
      mockReviewsRepository.startTransaction.mockResolvedValue(mockSession);
      mockReviewsRepository.findOneAndDelete.mockResolvedValue(review);
      mockUsersRepository.findOneAndUpdate.mockResolvedValue({ _id: userId });
      mockReviewsRepository.commitTransaction.mockResolvedValue(undefined);
      mockReviewsRepository.endSession.mockResolvedValue(undefined);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.deleteById(reviewId);

      expect(reviewsRepository.startTransaction).toHaveBeenCalled();
      expect(reviewsRepository.findOneAndDelete).toHaveBeenCalledWith({
        _id: reviewId,
      });
      expect(usersRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: review.userId },
        { $pull: { reviews: reviewId } },
        { session: mockSession },
      );
      expect(reviewsRepository.commitTransaction).toHaveBeenCalledWith(
        mockSession,
      );
      expect(reviewsRepository.endSession).toHaveBeenCalledWith(mockSession);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(result).toEqual({ deleted: review });
      consoleErrorSpy.mockRestore();
    });

    it('should throw NotFoundException if review is not found', async () => {
      mockReviewsRepository.startTransaction.mockResolvedValue(mockSession);
      mockReviewsRepository.findOneAndDelete.mockResolvedValue(null);
      mockReviewsRepository.abortTransaction.mockResolvedValue(undefined);
      mockReviewsRepository.endSession.mockResolvedValue(undefined);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(service.deleteById(reviewId)).rejects.toThrow(
        new NotFoundException(),
      );
      expect(reviewsRepository.findOneAndDelete).toHaveBeenCalledWith({
        _id: reviewId,
      });
      expect(usersRepository.findOneAndUpdate).not.toHaveBeenCalled();
      expect(reviewsRepository.abortTransaction).toHaveBeenCalledWith(
        mockSession,
      );
      expect(reviewsRepository.endSession).toHaveBeenCalledWith(mockSession);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should throw error and abort transaction on failure', async () => {
      const error = { code: 'ERR123', message: 'Database error' };
      mockReviewsRepository.startTransaction.mockResolvedValue(mockSession);
      mockReviewsRepository.findOneAndDelete.mockRejectedValue(error);
      mockReviewsRepository.abortTransaction.mockResolvedValue(undefined);
      mockReviewsRepository.endSession.mockResolvedValue(undefined);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(service.deleteById(reviewId)).rejects.toThrow(error.message);
      expect(reviewsRepository.findOneAndDelete).toHaveBeenCalledWith({
        _id: reviewId,
      });
      expect(usersRepository.findOneAndUpdate).not.toHaveBeenCalled();
      expect(reviewsRepository.abortTransaction).toHaveBeenCalledWith(
        mockSession,
      );
      expect(reviewsRepository.endSession).toHaveBeenCalledWith(mockSession);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', error);
      consoleErrorSpy.mockRestore();
    });
  });
});
