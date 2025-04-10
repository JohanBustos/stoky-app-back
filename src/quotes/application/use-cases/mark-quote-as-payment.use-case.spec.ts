import { Test, TestingModule } from '@nestjs/testing';
import { MarkQuoteAsPaidUseCase } from './mark-quote-as-payment.use-case';
import { QuotesRepository } from '../../domain/repositories/quotes.repository';
import {
  Quote,
  QuoteItem,
  QuotePaymentStatus,
} from '../../domain/entities/quote.entity';
import { NotFoundException } from '@nestjs/common';

describe('MarkQuoteAsPaidUseCase', () => {
  let useCase: MarkQuoteAsPaidUseCase;
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
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarkQuoteAsPaidUseCase,
        {
          provide: QuotesRepository,
          useValue: mockQuotesRepository,
        },
      ],
    }).compile();

    useCase = module.get<MarkQuoteAsPaidUseCase>(MarkQuoteAsPaidUseCase);
    quotesRepository = module.get<QuotesRepository>(QuotesRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should mark quote as paid successfully', async () => {
      mockQuotesRepository.findById.mockResolvedValue(mockQuote);
      mockQuotesRepository.update.mockResolvedValue(mockQuote);

      await useCase.execute(mockQuote.id!);

      expect(mockQuotesRepository.findById).toHaveBeenCalledWith(mockQuote.id);
      expect(mockQuotesRepository.update).toHaveBeenCalledWith(mockQuote);
      expect(mockQuote.paymentStatus).toBe(QuotePaymentStatus.PAID);
    });

    it('should throw NotFoundException when quote is not found', async () => {
      mockQuotesRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockQuotesRepository.findById).toHaveBeenCalledWith('nonexistent');
      expect(mockQuotesRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error when repository update fails', async () => {
      const error = new Error('Failed to update quote');
      mockQuotesRepository.findById.mockResolvedValue(mockQuote);
      mockQuotesRepository.update.mockRejectedValue(error);

      await expect(useCase.execute(mockQuote.id!)).rejects.toThrow(error);
      expect(mockQuotesRepository.findById).toHaveBeenCalledWith(mockQuote.id);
      expect(mockQuotesRepository.update).toHaveBeenCalledWith(mockQuote);
    });

    it('should throw error when quote has invalid data', async () => {
      const invalidQuote = new Quote(
        'quote1',
        'customer1',
        new Date('2024-01-01'),
        0,
        [],
        QuotePaymentStatus.PENDING,
      );

      mockQuotesRepository.findById.mockResolvedValue(invalidQuote);

      await expect(useCase.execute(invalidQuote.id!)).rejects.toThrow(
        'Invalid quote. Cannot mark as paid.',
      );
      expect(mockQuotesRepository.findById).toHaveBeenCalledWith(
        invalidQuote.id,
      );
      expect(mockQuotesRepository.update).not.toHaveBeenCalled();
    });
  });
});
