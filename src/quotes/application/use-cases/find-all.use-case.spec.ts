import { Test, TestingModule } from '@nestjs/testing';
import { FindAllUseCase } from './find-all.use-case';
import { QuotesRepository } from '../../domain/repositories/quotes.repository';
import {
  Quote,
  QuoteItem,
  QuotePaymentStatus,
} from '../../domain/entities/quote.entity';

describe('FindAllUseCase', () => {
  let useCase: FindAllUseCase;
  let quotesRepository: QuotesRepository;

  const mockQuoteItems = [
    new QuoteItem('product1', 'Product 1', 2, 100),
    new QuoteItem('product2', 'Product 2', 1, 200),
  ];

  const mockQuotes = [
    new Quote(
      'quote1',
      'customer1',
      new Date('2024-01-01'),
      400,
      mockQuoteItems,
      QuotePaymentStatus.PENDING,
    ),
    new Quote(
      'quote2',
      'customer2',
      new Date('2024-01-02'),
      300,
      [mockQuoteItems[0]],
      QuotePaymentStatus.PAID,
    ),
  ];

  const mockQuotesRepository = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllUseCase,
        {
          provide: QuotesRepository,
          useValue: mockQuotesRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindAllUseCase>(FindAllUseCase);
    quotesRepository = module.get<QuotesRepository>(QuotesRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return all quotes', async () => {
      mockQuotesRepository.findAll.mockResolvedValue(mockQuotes);

      const result = await useCase.execute();

      expect(result).toEqual(mockQuotes);
      expect(mockQuotesRepository.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no quotes exist', async () => {
      mockQuotesRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
      expect(mockQuotesRepository.findAll).toHaveBeenCalled();
    });

    it('should throw error when repository fails', async () => {
      const error = new Error('Database error');
      mockQuotesRepository.findAll.mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow(error);
      expect(mockQuotesRepository.findAll).toHaveBeenCalled();
    });
  });
});
