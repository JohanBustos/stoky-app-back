// infrastructure/quote/repositories/firebase-quote.repository.ts
import { Injectable } from '@nestjs/common';
import { QuotesRepository } from '../../domain/repositories/quotes.repository';
import { Quote, QuotePaymentStatus } from '../../domain/entities/quote.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FirebaseQuoteRepository implements QuotesRepository {
  private quotes: Quote[] = [];

  async create(quote: Quote): Promise<Quote> {
    const existingIndex = this.quotes.findIndex((q) => q.id === quote.id);

    const newQuote = new Quote(
      quote.id ?? uuidv4(),
      quote.customerId,
      quote.createdAt || new Date(),
      quote.totalAmount,
      quote.items,
      quote.paymentStatus || QuotePaymentStatus.PENDING,
    );

    if (existingIndex !== -1) {
      throw new Error(`Quote with ID ${quote.id} already exists.`);
    } else {
      this.quotes.push(newQuote);
    }

    return newQuote;
  }

  async findById(id: string): Promise<Quote | null> {
    const quote = this.quotes.find((q) => q.id === id);
    return quote || null;
  }

  async findAll(): Promise<Quote[]> {
    return this.quotes;
  }

  async update(quote: Quote): Promise<Quote> {
    const index = this.quotes.findIndex((q) => q.id === quote.id);

    if (index === -1) {
      throw new Error(`Quote with ID ${quote.id} not found.`);
    }

    const updatedQuote = new Quote(
      quote.id,
      quote.customerId,
      quote.createdAt,
      quote.totalAmount,
      quote.items,
      quote.paymentStatus,
    );

    this.quotes[index] = updatedQuote;
    return updatedQuote;
  }
}
