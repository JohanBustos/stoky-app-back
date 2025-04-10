import { Inject, Injectable } from '@nestjs/common';
import { QuotesRepository } from '../../domain/repositories/quotes.repository';
import { Quote, QuotePaymentStatus } from '../../domain/entities/quote.entity';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';
import { QuoteMapper } from '../../interface/mappers/quote.mapper';
import { FindQuotesDto } from '../../interface/dtos/find-quotes.dto';

@Injectable()
export class FirebaseQuoteRepository implements QuotesRepository {
  private db: FirebaseFirestore.Firestore;

  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: typeof admin,
  ) {
    this.db = firebaseAdmin.firestore();
  }

  async create(quote: Quote): Promise<Quote> {
    const id = quote.id ?? uuidv4();
    const newQuote = new Quote(
      id,
      quote.customerId,
      quote.createdAt ?? new Date(),
      quote.totalAmount,
      quote.items,
      quote.paymentStatus ?? QuotePaymentStatus.PENDING,
    );

    const docRef = this.db.collection('quotes').doc(id);

    const doc = await docRef.get();
    if (doc.exists) {
      throw new Error(`Quote with ID ${id} already exists.`);
    }

    await docRef.set(QuoteMapper.toFirestore(newQuote));

    return newQuote;
  }

  async findById(id: string): Promise<Quote | null> {
    const doc = await this.db.collection('quotes').doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data();
    if (!data) {
      throw new Error(`Quote data is undefined for document with ID ${id}`);
    }

    return new Quote(
      id,
      data.customerId,
      data.createdAt?.toDate?.() ?? new Date(data.createdAt),
      data.totalAmount,
      data.items,
      data.paymentStatus,
    );
  }

  async findAll(): Promise<Quote[]> {
    const snapshot = await this.db.collection('quotes').get();
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      if (!data) throw new Error(`Quote data missing in document ${doc.id}`);

      return new Quote(
        doc.id,
        data.customerId,
        data.createdAt?.toDate?.() ?? new Date(data.createdAt),
        data.totalAmount,
        data.items,
        data.paymentStatus,
      );
    });
  }

  async update(quote: Quote): Promise<Quote> {
    if (!quote.id) {
      throw new Error('Quote ID is required for update.');
    }

    const docRef = this.db.collection('quotes').doc(quote.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error(`Quote with ID ${quote.id} not found.`);
    }

    await docRef.update({
      ...quote,
      createdAt: admin.firestore.Timestamp.fromDate(
        quote.createdAt ?? new Date(),
      ),
    });

    return quote;
  }

  async findWithFilters(
    filters: FindQuotesDto,
  ): Promise<{ quotes: Quote[]; total: number }> {
    let query: FirebaseFirestore.Query = this.db.collection('quotes');

    // Apply filters
    if (filters.status) {
      query = query.where('paymentStatus', '==', filters.status);
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

    // Get all quotes first
    const snapshot = await query.get();
    let quotes = snapshot.docs.map((doc) => {
      const data = doc.data();
      if (!data) throw new Error(`Quote data missing in document ${doc.id}`);

      return new Quote(
        doc.id,
        data.customerId,
        data.createdAt?.toDate?.() ?? new Date(data.createdAt),
        data.totalAmount,
        data.items,
        data.paymentStatus,
      );
    });

    // Apply search filter if provided
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      quotes = quotes.filter(
        (quote) =>
          quote.customerId.toLowerCase().includes(searchLower) ||
          quote.items.some((item) =>
            item.name.toLowerCase().includes(searchLower),
          ),
      );
    }

    // Sort by createdAt in descending order
    quotes = quotes.sort(
      (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
    );

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedQuotes = quotes.slice(startIndex, endIndex);

    return {
      quotes: paginatedQuotes,
      total: quotes.length,
    };
  }
}
