import { Test, TestingModule } from '@nestjs/testing';
import { FindPaymentsByQuoteUseCase } from './detail-payments-by-quote.use-case';
import { PaymentRepository } from '../../domain/repositories/payments.repository';
import {
  Payment,
  PaymentStatus,
  PaymentMethod,
} from '../../domain/entities/payments.entity';

describe('FindPaymentsByQuoteUseCase', () => {
  let useCase: FindPaymentsByQuoteUseCase;
  let paymentRepository: PaymentRepository;

  const mockPayments = [
    new Payment(
      '1',
      'quote1',
      100,
      PaymentMethod.CARD,
      PaymentStatus.COMPLETED,
      new Date('2024-01-01'),
      'ref1',
    ),
    new Payment(
      '2',
      'quote1',
      200,
      PaymentMethod.CASH,
      PaymentStatus.PENDING,
      new Date('2024-01-02'),
      'ref2',
    ),
  ];

  const mockPaymentRepository = {
    findByQuoteId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindPaymentsByQuoteUseCase,
        {
          provide: PaymentRepository,
          useValue: mockPaymentRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindPaymentsByQuoteUseCase>(
      FindPaymentsByQuoteUseCase,
    );
    paymentRepository = module.get<PaymentRepository>(PaymentRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return all payments for a given quote ID', async () => {
      const quoteId = 'quote1';
      mockPaymentRepository.findByQuoteId.mockResolvedValue(mockPayments);

      const result = await useCase.execute(quoteId);

      expect(result).toEqual(mockPayments);
      expect(mockPaymentRepository.findByQuoteId).toHaveBeenCalledWith(quoteId);
    });

    it('should return empty array when no payments are found', async () => {
      const quoteId = 'nonexistent';
      mockPaymentRepository.findByQuoteId.mockResolvedValue([]);

      const result = await useCase.execute(quoteId);

      expect(result).toEqual([]);
      expect(mockPaymentRepository.findByQuoteId).toHaveBeenCalledWith(quoteId);
    });
  });
});
