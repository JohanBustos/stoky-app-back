import { Test, TestingModule } from '@nestjs/testing';
import { FirebasePaymentsRepository } from './firebase-payments.repository';
import {
  Payment,
  PaymentStatus,
  PaymentMethod,
} from '../../domain/entities/payments.entity';
import { v4 as uuidv4 } from 'uuid';
import { FindPaymentsDto } from '../../interface/dtos/find-payments.dto';

describe('FirebasePaymentsRepository', () => {
  let repository: FirebasePaymentsRepository;
  let firebaseAdmin: any;

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

  const mockFirestore = {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    get: jest.fn(),
    add: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FirebasePaymentsRepository,
        {
          provide: 'FIREBASE_ADMIN',
          useValue: {
            firestore: jest.fn().mockReturnValue(mockFirestore),
          },
        },
      ],
    }).compile();

    repository = module.get<FirebasePaymentsRepository>(FirebasePaymentsRepository);
    firebaseAdmin = module.get('FIREBASE_ADMIN');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a payment', async () => {
      mockFirestore.add.mockResolvedValue({ id: '1' });

      const result = await repository.create(mockPayment);

      expect(result).toEqual(mockPayment);
      expect(mockFirestore.collection).toHaveBeenCalledWith('payments');
      expect(mockFirestore.add).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find a payment by id', async () => {
      mockFirestore.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: '1',
          quoteId: 'quote1',
          amount: 100,
          method: PaymentMethod.CARD,
          status: PaymentStatus.PENDING,
          createdAt: new Date('2024-01-01'),
          reference: 'ref1',
        }),
      });

      const result = await repository.findById('1');

      expect(result).toEqual(mockPayment);
      expect(mockFirestore.collection).toHaveBeenCalledWith('payments');
      expect(mockFirestore.doc).toHaveBeenCalledWith('1');
    });
  });

  describe('findByQuoteId', () => {
    it('should find payments by quote id', async () => {
      mockFirestore.get.mockResolvedValue({
        docs: [
          {
            data: () => ({
              id: '1',
              quoteId: 'quote1',
              amount: 100,
              method: PaymentMethod.CARD,
              status: PaymentStatus.PENDING,
              createdAt: new Date('2024-01-01'),
              reference: 'ref1',
            }),
          },
        ],
      });

      const result = await repository.findByQuoteId('quote1');

      expect(result).toEqual(mockPayments);
      expect(mockFirestore.collection).toHaveBeenCalledWith('payments');
      expect(mockFirestore.where).toHaveBeenCalledWith('quoteId', '==', 'quote1');
    });
  });

  describe('findWithFilters', () => {
    it('should find payments with filters', async () => {
      const filters: FindPaymentsDto = {
        page: 1,
        limit: 10,
        status: PaymentStatus.PENDING,
      };

      mockFirestore.get.mockResolvedValue({
        docs: [
          {
            data: () => ({
              id: '1',
              quoteId: 'quote1',
              amount: 100,
              method: PaymentMethod.CARD,
              status: PaymentStatus.PENDING,
              createdAt: new Date('2024-01-01'),
              reference: 'ref1',
            }),
          },
        ],
      });

      const result = await repository.findWithFilters(filters);

      expect(result).toEqual({
        payments: mockPayments,
        total: 1,
      });
      expect(mockFirestore.collection).toHaveBeenCalledWith('payments');
      expect(mockFirestore.where).toHaveBeenCalledWith('status', '==', PaymentStatus.PENDING);
      expect(mockFirestore.orderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(mockFirestore.limit).toHaveBeenCalledWith(10);
      expect(mockFirestore.offset).toHaveBeenCalledWith(0);
    });
  });

  describe('updateStatus', () => {
    it('should update payment status', async () => {
      mockFirestore.update.mockResolvedValue(undefined);

      await repository.updateStatus('1', PaymentStatus.COMPLETED);

      expect(mockFirestore.collection).toHaveBeenCalledWith('payments');
      expect(mockFirestore.doc).toHaveBeenCalledWith('1');
      expect(mockFirestore.update).toHaveBeenCalledWith({
        status: PaymentStatus.COMPLETED,
      });
    });
  });
});
