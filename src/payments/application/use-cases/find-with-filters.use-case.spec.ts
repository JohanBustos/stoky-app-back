import { Test, TestingModule } from '@nestjs/testing';
import { FindWithFiltersUseCase } from './find-with-filters.use-case';
import { PaymentRepository } from '../../domain/repositories/payments.repository';
import {
  Payment,
  PaymentStatus,
  PaymentMethod,
} from '../../domain/entities/payments.entity';
import { FindPaymentsDto } from '../../interface/dtos/find-payments.dto';

describe('FindWithFiltersUseCase', () => {
  let useCase: FindWithFiltersUseCase;
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
    findWithFilters: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindWithFiltersUseCase,
        {
          provide: PaymentRepository,
          useValue: mockPaymentRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindWithFiltersUseCase>(FindWithFiltersUseCase);
    paymentRepository = module.get<PaymentRepository>(PaymentRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return payments and total count with default pagination', async () => {
      const filters: FindPaymentsDto = {};
      const expectedResult = {
        payments: mockPayments,
        total: mockPayments.length,
      };

      mockPaymentRepository.findWithFilters.mockResolvedValue(expectedResult);

      const result = await useCase.execute(filters);

      expect(result).toEqual(expectedResult);
      expect(mockPaymentRepository.findWithFilters).toHaveBeenCalledWith(
        filters,
      );
    });

    it('should return filtered payments with custom pagination', async () => {
      const filters: FindPaymentsDto = {
        page: 2,
        limit: 5,
        status: PaymentStatus.COMPLETED,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        quotationId: 'quote1',
      };

      const expectedResult = {
        payments: [mockPayments[0], mockPayments[2]],
        total: 2,
      };

      mockPaymentRepository.findWithFilters.mockResolvedValue(expectedResult);

      const result = await useCase.execute(filters);

      expect(result).toEqual(expectedResult);
      expect(mockPaymentRepository.findWithFilters).toHaveBeenCalledWith(
        filters,
      );
    });

    it('should return empty result when no payments match filters', async () => {
      const filters: FindPaymentsDto = {
        status: PaymentStatus.FAILED,
      };

      const expectedResult = {
        payments: [],
        total: 0,
      };

      mockPaymentRepository.findWithFilters.mockResolvedValue(expectedResult);

      const result = await useCase.execute(filters);

      expect(result).toEqual(expectedResult);
      expect(mockPaymentRepository.findWithFilters).toHaveBeenCalledWith(
        filters,
      );
    });
  });
});
