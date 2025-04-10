import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePaymentStatusUseCase } from './update-payment-status.use-case';
import { PaymentRepository } from '../../domain/repositories/payments.repository';
import {
  Payment,
  PaymentStatus,
  PaymentMethod,
} from '../../domain/entities/payments.entity';
import { NotFoundException } from '@nestjs/common';

describe('UpdatePaymentStatusUseCase', () => {
  let useCase: UpdatePaymentStatusUseCase;
  let paymentRepository: PaymentRepository;

  const mockPayment = new Payment(
    '1',
    'quote1',
    100,
    PaymentMethod.CARD,
    PaymentStatus.PENDING,
    new Date('2024-01-01'),
    'ref1',
  );

  const mockPaymentRepository = {
    findById: jest.fn(),
    updateStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePaymentStatusUseCase,
        {
          provide: PaymentRepository,
          useValue: mockPaymentRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdatePaymentStatusUseCase>(
      UpdatePaymentStatusUseCase,
    );
    paymentRepository = module.get<PaymentRepository>(PaymentRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update payment status successfully', async () => {
      mockPaymentRepository.findById.mockResolvedValue(mockPayment);
      mockPaymentRepository.updateStatus.mockResolvedValue(undefined);

      await useCase.execute(mockPayment.id!, PaymentStatus.COMPLETED);

      expect(mockPaymentRepository.findById).toHaveBeenCalledWith(
        mockPayment.id,
      );
      expect(mockPaymentRepository.updateStatus).toHaveBeenCalledWith(
        mockPayment.id,
        PaymentStatus.COMPLETED,
      );
    });

    it('should throw NotFoundException when payment is not found', async () => {
      mockPaymentRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute('nonexistent', PaymentStatus.COMPLETED),
      ).rejects.toThrow(NotFoundException);
      expect(mockPaymentRepository.findById).toHaveBeenCalledWith(
        'nonexistent',
      );
      expect(mockPaymentRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('should throw error when repository update fails', async () => {
      const error = new Error('Failed to update payment');
      mockPaymentRepository.findById.mockResolvedValue(mockPayment);
      mockPaymentRepository.updateStatus.mockRejectedValue(error);

      await expect(
        useCase.execute(mockPayment.id!, PaymentStatus.COMPLETED),
      ).rejects.toThrow(error);
      expect(mockPaymentRepository.findById).toHaveBeenCalledWith(
        mockPayment.id,
      );
      expect(mockPaymentRepository.updateStatus).toHaveBeenCalledWith(
        mockPayment.id,
        PaymentStatus.COMPLETED,
      );
    });
  });
});
