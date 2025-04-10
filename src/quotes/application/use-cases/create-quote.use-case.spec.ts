import { Test, TestingModule } from '@nestjs/testing';
import { CreateQuoteUseCase } from './create-quote.use-case';
import { QuotesRepository } from '../../domain/repositories/quotes.repository';
import {
  Quote,
  QuoteItem,
  QuotePaymentStatus,
} from '../../domain/entities/quote.entity';

describe('CreateQuoteUseCase', () => {
  let useCase: CreateQuoteUseCase;
  let quotesRepository: QuotesRepository;

  const mockQuoteItems = [
    new QuoteItem('product1', 'Product 1', 2, 100),
    new QuoteItem('product2', 'Product 2', 1, 200),
  ];

  const mockQuote = new Quote(
    undefined,
    'customer1',
    undefined,
    400,
    mockQuoteItems,
    QuotePaymentStatus.PENDING,
  );

  const mockCreatedQuote = new Quote(
    'quote1',
    'customer1',
    new Date('2024-01-01'),
    400,
    mockQuoteItems,
    QuotePaymentStatus.PENDING,
  );

  const mockQuotesRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateQuoteUseCase,
        {
          provide: QuotesRepository,
          useValue: mockQuotesRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateQuoteUseCase>(CreateQuoteUseCase);
    quotesRepository = module.get<QuotesRepository>(QuotesRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a quote successfully', async () => {
      mockQuotesRepository.create.mockResolvedValue(mockCreatedQuote);

      const result = await useCase.execute(mockQuote);

      expect(result).toEqual(mockCreatedQuote);
      expect(mockQuotesRepository.create).toHaveBeenCalledWith(mockQuote);
    });

    it('should throw error when repository fails', async () => {
      const error = new Error('Failed to create quote');
      mockQuotesRepository.create.mockRejectedValue(error);

      await expect(useCase.execute(mockQuote)).rejects.toThrow(error);
      expect(mockQuotesRepository.create).toHaveBeenCalledWith(mockQuote);
    });
  });
});
