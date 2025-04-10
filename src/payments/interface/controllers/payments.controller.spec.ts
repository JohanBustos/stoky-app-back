import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from '../../application/services/payments.service';
import {
  Payment,
  PaymentStatus,
  PaymentMethod,
} from '../../domain/entities/payments.entity';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { FindPaymentsDto } from '../dtos/find-payments.dto';
import { UpdatePaymentStatusDto } from '../dtos/update-payment-status.dto';
import { PaymentResponseDto } from '../dtos/payment-response.dto';
import { PaginatedResponseDto } from '../dtos/paginated-response.dto';
import { PaymentMapper } from '../mappers/payment.mapper';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

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

  const mockPaymentsService = {
    createPayment: jest.fn(),
    getPaymentsByQuote: jest.fn(),
    getAllPayments: jest.fn(),
    findWithFilters: jest.fn(),
    updatePaymentStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPayment', () => {
    it('should create a payment', async () => {
      const createPaymentDto: CreatePaymentDto = {
        quoteId: 'quote1',
        amount: 100,
        method: PaymentMethod.CARD,
        reference: 'ref1',
      };

      mockPaymentsService.createPayment.mockResolvedValue(mockPayment);

      const result = await controller.createPayment(createPaymentDto);

      expect(result).toEqual(PaymentMapper.toDto(mockPayment));
      expect(mockPaymentsService.createPayment).toHaveBeenCalled();
    });
  });

  describe('getPaymentsByQuote', () => {
    it('should return payments by quote id', async () => {
      mockPaymentsService.getPaymentsByQuote.mockResolvedValue(mockPayments);

      const result = await controller.getPaymentsByQuote('quote1');

      expect(result).toEqual(mockPayments.map(PaymentMapper.toDto));
      expect(mockPaymentsService.getPaymentsByQuote).toHaveBeenCalledWith('quote1');
    });
  });

  describe('getAllPayments', () => {
    it('should return all payments', async () => {
      mockPaymentsService.getAllPayments.mockResolvedValue(mockPayments);

      const result = await controller.getAllPayments();

      expect(result).toEqual(mockPayments.map(PaymentMapper.toDto));
      expect(mockPaymentsService.getAllPayments).toHaveBeenCalled();
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

      mockPaymentsService.findWithFilters.mockResolvedValue(expectedResult);

      const result = await controller.findWithFilters(filters);

      expect(result).toEqual({
        payments: mockPayments.map(PaymentMapper.toDto),
        total: 1,
      });
      expect(mockPaymentsService.findWithFilters).toHaveBeenCalledWith(filters);
    });
  });

  describe('updatePaymentStatus', () => {
    it('should update payment status', async () => {
      const updatePaymentStatusDto: UpdatePaymentStatusDto = {
        status: PaymentStatus.COMPLETED,
      };

      mockPaymentsService.updatePaymentStatus.mockResolvedValue(undefined);

      const result = await controller.updatePaymentStatus('1', updatePaymentStatusDto);

      expect(result).toEqual({ message: 'Payment status updated successfully' });
      expect(mockPaymentsService.updatePaymentStatus).toHaveBeenCalledWith('1', PaymentStatus.COMPLETED);
    });
  });
});
