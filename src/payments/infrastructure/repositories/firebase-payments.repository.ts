import { Inject, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../../domain/repositories/payments.repository';
import { Payment, PaymentStatus } from '../../domain/entities/payments.entity';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';
import { PaymentMapper } from '../../interface/mappers/payment.mapper';
import { FindPaymentsDto } from '../../interface/dtos/find-payments.dto';

@Injectable()
export class FirebasePaymentsRepository implements PaymentRepository {
  private db: FirebaseFirestore.Firestore;

  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: typeof admin,
  ) {
    this.db = firebaseAdmin.firestore();
  }

  async create(payment: Payment): Promise<Payment> {
    const id = payment.id ?? uuidv4();
    const newPayment = new Payment(
      id,
      payment.quoteId,
      payment.amount,
      payment.method,
      payment.status ?? PaymentStatus.PENDING,
      payment.createdAt ?? new Date(),
      payment.reference,
    );

    const docRef = this.db.collection('payments').doc(id);
    await docRef.set(PaymentMapper.toFirestore(newPayment));

    return newPayment;
  }

  async findById(id: string): Promise<Payment | null> {
    const doc = await this.db.collection('payments').doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data();
    if (!data) return null;

    return PaymentMapper.fromFirestore(doc.id, data);
  }

  async findByQuoteId(quoteId: string): Promise<Payment[]> {
    const snapshot = await this.db
      .collection('payments')
      .where('quoteId', '==', quoteId)
      .get();

    return snapshot.docs.map((doc) =>
      PaymentMapper.fromFirestore(doc.id, doc.data()),
    );
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<void> {
    const docRef = this.db.collection('payments').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error(`Payment ${id} not found`);

    await docRef.update({ status });
  }

  async delete(id: string): Promise<void> {
    await this.db.collection('payments').doc(id).delete();
  }

  async findAllPayments(): Promise<Payment[]> {
    const snapshot = await this.db.collection('payments').get();

    return snapshot.docs.map((doc) =>
      PaymentMapper.fromFirestore(doc.id, doc.data()),
    );
  }

  async findWithFilters(
    filters: FindPaymentsDto,
  ): Promise<{ payments: Payment[]; total: number }> {
    let query: FirebaseFirestore.Query = this.db.collection('payments');

    // Apply filters
    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }

    if (filters.quotationId) {
      query = query.where('quoteId', '==', filters.quotationId);
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      query = query.where(
        'createdAt',
        '>=',
        admin.firestore.Timestamp.fromDate(startDate),
      );
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      query = query.where(
        'createdAt',
        '<=',
        admin.firestore.Timestamp.fromDate(endDate),
      );
    }

    // Get all payments first
    const snapshot = await query.get();
    let payments = snapshot.docs.map((doc) =>
      PaymentMapper.fromFirestore(doc.id, doc.data()),
    );

    // Sort by createdAt in descending order
    payments = payments.sort(
      (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
    );

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedPayments = payments.slice(startIndex, endIndex);

    return {
      payments: paginatedPayments,
      total: payments.length,
    };
  }
}
