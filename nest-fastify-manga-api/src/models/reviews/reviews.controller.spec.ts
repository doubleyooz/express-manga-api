import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { ReviewsRepository } from './reviews.repository';
import { ReviewsService } from './reviews.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './reviews.schema';

describe('ReviewsController', () => {
  let controller: ReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
       imports: [
              MongooseModule.forFeature([
                { name: Review.name, schema: ReviewSchema },
              ]),
              // Mock UsersModule to handle forwardRef
              {
                provide: 'UsersModule',
                useValue: {},
              },
            ],
      controllers: [ReviewsController],
      providers: [ReviewsService, ReviewsRepository],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
