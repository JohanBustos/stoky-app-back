import { Test, TestingModule } from '@nestjs/testing';
import { FindAllPaymentsUseCase } from './find-all-payments.use-case';
import { PaymentRepository } from '../../domain/repositories/payments.repository';
import {
  Payment,
  PaymentStatus,
  PaymentMethod,
} from '../../domain/entities/payments.entity';

describe('FindAllPaymentsUseCase', () => {
  let useCase: FindAllPaymentsUseCase;
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
      'quote2',
      200,
      PaymentMethod.CASH,
      PaymentStatus.PENDING,
      new Date('2024-01-02'),
      'ref2',
    ),
    new Payment(
      '3',
      'quote1',
      300,
      PaymentMethod.TRANSFER,
      PaymentStatus.COMPLETED,
      new Date('2024-01-03'),
      'ref3',
    ),
  ];

  const mockPaymentRepository = {
    findAllPayments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllPaymentsUseCase,
        {
          provide: PaymentRepository,
          useValue: mockPaymentRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindAllPaymentsUseCase>(FindAllPaymentsUseCase);
    paymentRepository = module.get<PaymentRepository>(PaymentRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return all payments', async () => {
      mockPaymentRepository.findAllPayments.mockResolvedValue(mockPayments);

      const result = await useCase.execute();

      expect(result).toEqual(mockPayments);
      expect(mockPaymentRepository.findAllPayments).toHaveBeenCalled();
    });

    it('should return empty array when no payments exist', async () => {
      mockPaymentRepository.findAllPayments.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
      expect(mockPaymentRepository.findAllPayments).toHaveBeenCalled();
    });
  });
});
