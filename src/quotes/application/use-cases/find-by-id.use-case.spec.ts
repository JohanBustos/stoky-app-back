import { Test, TestingModule } from '@nestjs/testing';
import { FindByIdUseCase } from './find-by-id.use-case';
import { QuotesRepository } from '../../domain/repositories/quotes.repository';
import {
  Quote,
  QuoteItem,
  QuotePaymentStatus,
} from '../../domain/entities/quote.entity';
import { NotFoundException } from '@nestjs/common';

describe('FindByIdUseCase', () => {
  let useCase: FindByIdUseCase;
  let quotesRepository: QuotesRepository;

  const mockQuoteItems = [
    new QuoteItem('product1', 'Product 1', 2, 100),
    new QuoteItem('product2', 'Product 2', 1, 200),
  ];

  const mockQuote = new Quote(
    'quote1',
    'customer1',
    new Date('2024-01-01'),
    400,
    mockQuoteItems,
    QuotePaymentStatus.PENDING,
  );

  const mockQuotesRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindByIdUseCase,
        {
          provide: QuotesRepository,
          useValue: mockQuotesRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindByIdUseCase>(FindByIdUseCase);
    quotesRepository = module.get<QuotesRepository>(QuotesRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a quote when found', async () => {
      const quoteId = 'quote1';
      mockQuotesRepository.findById.mockResolvedValue(mockQuote);

      const result = await useCase.execute(quoteId);

      expect(result).toEqual(mockQuote);
      expect(mockQuotesRepository.findById).toHaveBeenCalledWith(quoteId);
    });

    it('should throw NotFoundException when quote is not found', async () => {
      const quoteId = 'nonexistent';
      mockQuotesRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(quoteId)).rejects.toThrow(NotFoundException);
      expect(mockQuotesRepository.findById).toHaveBeenCalledWith(quoteId);
    });

    it('should throw error when repository fails', async () => {
      const quoteId = 'quote1';
      const error = new Error('Database error');
      mockQuotesRepository.findById.mockRejectedValue(error);

      await expect(useCase.execute(quoteId)).rejects.toThrow(error);
      expect(mockQuotesRepository.findById).toHaveBeenCalledWith(quoteId);
    });
  });
});
