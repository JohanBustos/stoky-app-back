import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PaymentRepository } from '../../domain/repositories/payments.repository';
import { Payment, PaymentStatus, PaymentMethod } from '../../domain/entities/payments.entity';
import { FindPaymentsDto } from '../../interface/dtos/find-payments.dto';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let repository: PaymentRepository;

  const mockPayment = new Payment(
    '1',
    'quote1',
    100,
    PaymentMethod.CARD,
    PaymentStatus.PENDING,
    new Date('2024-01-01'),
    'ref1',
  );

  const mockPayments = [mockPayment];

  const mockPaymentsRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByQuoteId: jest.fn(),
    findWithFilters: jest.fn(),
    updateStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PaymentRepository,
          useValue: mockPaymentsRepository,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    repository = module.get<PaymentRepository>(PaymentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPayment', () => {
    it('should create a payment', async () => {
      const payment = new Payment(
        '1',
        'quote1',
        100,
        PaymentMethod.CARD,
        PaymentStatus.PENDING,
        new Date('2024-01-01'),
        'ref1',
      );

      mockPaymentsRepository.create.mockResolvedValue(payment);

      const result = await service.createPayment(payment);

      expect(result).toEqual(payment);
      expect(mockPaymentsRepository.create).toHaveBeenCalledWith(payment);
    });
  });

  describe('getPaymentsByQuote', () => {
    it('should return payments by quote id', async () => {
      mockPaymentsRepository.findByQuoteId.mockResolvedValue(mockPayments);

      const result = await service.getPaymentsByQuote('quote1');

      expect(result).toEqual(mockPayments);
      expect(mockPaymentsRepository.findByQuoteId).toHaveBeenCalledWith('quote1');
    });
  });

  describe('findWithFilters', () => {
    it('should return filtered payments with pagination', async () => {
      const filters: FindPaymentsDto = {
        page: 1,
        limit: 10,
        status: PaymentStatus.PENDING,
      };

      const expectedResult = {
        payments: mockPayments,
        total: 1,
      };

      mockPaymentsRepository.findWithFilters.mockResolvedValue(expectedResult);

      const result = await service.findWithFilters(filters);

      expect(result).toEqual(expectedResult);
      expect(mockPaymentsRepository.findWithFilters).toHaveBeenCalledWith(filters);
    });
  });

  describe('updatePaymentStatus', () => {
    it('should update payment status', async () => {
      mockPaymentsRepository.updateStatus.mockResolvedValue(undefined);

      await service.updatePaymentStatus('1', PaymentStatus.COMPLETED);

      expect(mockPaymentsRepository.updateStatus).toHaveBeenCalledWith('1', PaymentStatus.COMPLETED);
    });
  });
});
