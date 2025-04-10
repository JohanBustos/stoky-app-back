import {
  Payment,
  PaymentStatus,
  PaymentMethod,
} from '../../domain/entities/payments.entity';
import { PaymentMapper } from './payment.mapper';
import * as admin from 'firebase-admin';

describe('PaymentMapper', () => {
  const mockPayment = new Payment(
    '1',
    'quote1',
    100,
    PaymentMethod.CARD,
    PaymentStatus.COMPLETED,
    new Date('2024-01-01'),
    'ref1',
  );

  describe('toDto', () => {
    it('should correctly map Payment entity to PaymentResponseDto', () => {
      const result = PaymentMapper.toDto(mockPayment);

      expect(result).toEqual({
        id: mockPayment.id,
        quoteId: mockPayment.quoteId,
        amount: mockPayment.amount,
        method: mockPayment.method,
        status: mockPayment.status,
        createdAt: mockPayment.createdAt,
        reference: mockPayment.reference,
      });
    });
  });

  describe('toFirestore', () => {
    it('should correctly map Payment entity to Firestore format', () => {
      const result = PaymentMapper.toFirestore(mockPayment);

      expect(result).toEqual({
        id: mockPayment.id,
        quoteId: mockPayment.quoteId,
        amount: mockPayment.amount,
        method: mockPayment.method,
        status: mockPayment.status,
        createdAt: expect.any(admin.firestore.Timestamp),
        reference: mockPayment.reference,
      });
    });
  });

  describe('fromFirestore', () => {
    it('should correctly map Firestore data to Payment entity', () => {
      const firestoreData = {
        quoteId: 'quote1',
        amount: 100,
        method: PaymentMethod.CARD,
        status: PaymentStatus.COMPLETED,
        createdAt: admin.firestore.Timestamp.fromDate(new Date('2024-01-01')),
        reference: 'ref1',
      };

      const result = PaymentMapper.fromFirestore('1', firestoreData);

      expect(result).toBeInstanceOf(Payment);
      expect(result.id).toBe('1');
      expect(result.quoteId).toBe(firestoreData.quoteId);
      expect(result.amount).toBe(firestoreData.amount);
      expect(result.method).toBe(firestoreData.method);
      expect(result.status).toBe(firestoreData.status);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.reference).toBe(firestoreData.reference);
    });

    it('should handle missing createdAt date', () => {
      const firestoreData = {
        quoteId: 'quote1',
        amount: 100,
        method: PaymentMethod.CARD,
        status: PaymentStatus.COMPLETED,
        reference: 'ref1',
      };

      const result = PaymentMapper.fromFirestore('1', firestoreData);

      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should handle missing reference', () => {
      const firestoreData = {
        quoteId: 'quote1',
        amount: 100,
        method: PaymentMethod.CARD,
        status: PaymentStatus.COMPLETED,
        createdAt: admin.firestore.Timestamp.fromDate(new Date('2024-01-01')),
      };

      const result = PaymentMapper.fromFirestore('1', firestoreData);

      expect(result.reference).toBeUndefined();
    });
  });
});
