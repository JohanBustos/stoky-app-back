import { Test, TestingModule } from '@nestjs/testing';
import { FindWithFiltersUseCase } from './find-with-filters.use-case';
import { QuotesRepository } from '../../domain/repositories/quotes.repository';
import {
  Quote,
  QuoteItem,
  QuotePaymentStatus,
} from '../../domain/entities/quote.entity';
import { FindQuotesDto } from '../../interface/dtos/find-quotes.dto';

describe('FindWithFiltersUseCase', () => {
  let useCase: FindWithFiltersUseCase;
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
    findWithFilters: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindWithFiltersUseCase,
        {
          provide: QuotesRepository,
          useValue: mockQuotesRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindWithFiltersUseCase>(FindWithFiltersUseCase);
    quotesRepository = module.get<QuotesRepository>(QuotesRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return quotes and total count with default pagination', async () => {
      const filters: FindQuotesDto = {};
      const expectedResult = {
        quotes: mockQuotes,
        total: mockQuotes.length,
      };

      mockQuotesRepository.findWithFilters.mockResolvedValue(expectedResult);

      const result = await useCase.execute(filters);

      expect(result).toEqual(expectedResult);
      expect(mockQuotesRepository.findWithFilters).toHaveBeenCalledWith(
        filters,
      );
    });

    it('should return filtered quotes with custom pagination', async () => {
      const filters: FindQuotesDto = {
        page: 2,
        limit: 5,
        status: QuotePaymentStatus.PAID,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        search: 'customer2',
      };

      const expectedResult = {
        quotes: [mockQuotes[1]],
        total: 1,
      };

      mockQuotesRepository.findWithFilters.mockResolvedValue(expectedResult);

      const result = await useCase.execute(filters);

      expect(result).toEqual(expectedResult);
      expect(mockQuotesRepository.findWithFilters).toHaveBeenCalledWith(
        filters,
      );
    });

    it('should return empty result when no quotes match filters', async () => {
      const filters: FindQuotesDto = {
        status: QuotePaymentStatus.FAILED,
      };

      const expectedResult = {
        quotes: [],
        total: 0,
      };

      mockQuotesRepository.findWithFilters.mockResolvedValue(expectedResult);

      const result = await useCase.execute(filters);

      expect(result).toEqual(expectedResult);
      expect(mockQuotesRepository.findWithFilters).toHaveBeenCalledWith(
        filters,
      );
    });

    it('should throw error when repository fails', async () => {
      const filters: FindQuotesDto = {};
      const error = new Error('Database error');
      mockQuotesRepository.findWithFilters.mockRejectedValue(error);

      await expect(useCase.execute(filters)).rejects.toThrow(error);
      expect(mockQuotesRepository.findWithFilters).toHaveBeenCalledWith(
        filters,
      );
    });
  });
});
