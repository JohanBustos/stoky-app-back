import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaymentUseCase } from './create-payment.use-case';
import { PaymentRepository } from '../../domain/repositories/payments.repository';
import { QuotesRepository } from '../../../quotes/domain/repositories/quotes.repository';
import { MarkQuoteAsPaidUseCase } from '../../../quotes/application/use-cases/mark-quote-as-payment.use-case';
import {
  Payment,
  PaymentStatus,
  PaymentMethod,
} from '../../domain/entities/payments.entity';
import {
  Quote,
  QuotePaymentStatus,
} from '../../../quotes/domain/entities/quote.entity';
import { NotFoundException } from '@nestjs/common';

describe('CreatePaymentUseCase', () => {
  let useCase: CreatePaymentUseCase;
  let paymentRepository: PaymentRepository;
  let quoteRepository: QuotesRepository;
  let markQuoteAsPaidUseCase: MarkQuoteAsPaidUseCase;

  const mockPayment = new Payment(
    '1',
    'quote1',
    100,
    PaymentMethod.CARD,
    PaymentStatus.PENDING,
    new Date('2024-01-01'),
    'ref1',
  );

  const mockQuote = new Quote(
    'quote1',
    'customer1',
    new Date('2024-01-01'),
    200,
    [],
    QuotePaymentStatus.PENDING,
  );

  const mockPaymentRepository = {
    create: jest.fn(),
    findByQuoteId: jest.fn(),
  };

  const mockQuoteRepository = {
    findById: jest.fn(),
  };

  const mockMarkQuoteAsPaidUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePaymentUseCase,
        {
          provide: PaymentRepository,
          useValue: mockPaymentRepository,
        },
        {
          provide: QuotesRepository,
          useValue: mockQuoteRepository,
        },
        {
          provide: MarkQuoteAsPaidUseCase,
          useValue: mockMarkQuoteAsPaidUseCase,
        },
      ],
    }).compile();

    useCase = module.get<CreatePaymentUseCase>(CreatePaymentUseCase);
    paymentRepository = module.get<PaymentRepository>(PaymentRepository);
    quoteRepository = module.get<QuotesRepository>(QuotesRepository);
    markQuoteAsPaidUseCase = module.get<MarkQuoteAsPaidUseCase>(
      MarkQuoteAsPaidUseCase,
    );
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a payment and not mark quote as paid when total paid is less than quote amount', async () => {
      mockPaymentRepository.create.mockResolvedValue(mockPayment);
      mockPaymentRepository.findByQuoteId.mockResolvedValue([mockPayment]);
      mockQuoteRepository.findById.mockResolvedValue(mockQuote);

      const result = await useCase.execute(mockPayment);

      expect(result).toEqual(mockPayment);
      expect(mockPaymentRepository.create).toHaveBeenCalledWith(mockPayment);
      expect(mockPaymentRepository.findByQuoteId).toHaveBeenCalledWith(
        mockPayment.quoteId,
      );
      expect(mockQuoteRepository.findById).toHaveBeenCalledWith(
        mockPayment.quoteId,
      );
      expect(mockMarkQuoteAsPaidUseCase.execute).not.toHaveBeenCalled();
    });

    it('should create a payment and mark quote as paid when total paid equals quote amount', async () => {
      const existingPayment = new Payment(
        '2',
        'quote1',
        100,
        PaymentMethod.CARD,
        PaymentStatus.COMPLETED,
        new Date('2024-01-01'),
        'ref2',
      );

      mockPaymentRepository.create.mockResolvedValue(mockPayment);
      mockPaymentRepository.findByQuoteId.mockResolvedValue([
        existingPayment,
        mockPayment,
      ]);
      mockQuoteRepository.findById.mockResolvedValue(mockQuote);

      const result = await useCase.execute(mockPayment);

      expect(result).toEqual(mockPayment);
      expect(mockPaymentRepository.create).toHaveBeenCalledWith(mockPayment);
      expect(mockPaymentRepository.findByQuoteId).toHaveBeenCalledWith(
        mockPayment.quoteId,
      );
      expect(mockQuoteRepository.findById).toHaveBeenCalledWith(
        mockPayment.quoteId,
      );
      expect(mockMarkQuoteAsPaidUseCase.execute).toHaveBeenCalledWith(
        mockQuote.id,
      );
    });

    it('should throw NotFoundException when quote is not found', async () => {
      mockPaymentRepository.create.mockResolvedValue(mockPayment);
      mockPaymentRepository.findByQuoteId.mockResolvedValue([mockPayment]);
      mockQuoteRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(mockPayment)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPaymentRepository.create).toHaveBeenCalledWith(mockPayment);
      expect(mockPaymentRepository.findByQuoteId).toHaveBeenCalledWith(
        mockPayment.quoteId,
      );
      expect(mockQuoteRepository.findById).toHaveBeenCalledWith(
        mockPayment.quoteId,
      );
      expect(mockMarkQuoteAsPaidUseCase.execute).not.toHaveBeenCalled();
    });

    it('should not mark quote as paid when quote is already paid', async () => {
      const paidQuote = new Quote(
        'quote1',
        'customer1',
        new Date('2024-01-01'),
        200,
        [],
        QuotePaymentStatus.PAID,
      );

      mockPaymentRepository.create.mockResolvedValue(mockPayment);
      mockPaymentRepository.findByQuoteId.mockResolvedValue([mockPayment]);
      mockQuoteRepository.findById.mockResolvedValue(paidQuote);

      const result = await useCase.execute(mockPayment);

      expect(result).toEqual(mockPayment);
      expect(mockPaymentRepository.create).toHaveBeenCalledWith(mockPayment);
      expect(mockPaymentRepository.findByQuoteId).toHaveBeenCalledWith(
        mockPayment.quoteId,
      );
      expect(mockQuoteRepository.findById).toHaveBeenCalledWith(
        mockPayment.quoteId,
      );
      expect(mockMarkQuoteAsPaidUseCase.execute).not.toHaveBeenCalled();
    });
  });
});
