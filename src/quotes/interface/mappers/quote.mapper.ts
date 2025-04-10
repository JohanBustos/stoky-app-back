import {
  Quote,
  QuoteItem,
  QuotePaymentStatus,
} from '../../domain/entities/quote.entity';
import * as admin from 'firebase-admin';

export class QuoteMapper {
  static toFirestore(quote: Quote): any {
    return {
      id: quote.id,
      customerId: quote.customerId,
      createdAt: admin.firestore.Timestamp.fromDate(
        quote.createdAt ?? new Date(),
      ),
      totalAmount: quote.totalAmount,
      items: quote.items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      paymentStatus: quote.paymentStatus,
    };
  }

  static fromFirestore(
    id: string,
    data: FirebaseFirestore.DocumentData,
  ): Quote {
    return new Quote(
      id,
      data.customerId,
      data.createdAt?.toDate?.() ?? new Date(data.createdAt),
      data.totalAmount,
      data.items.map(
        (i: any) => new QuoteItem(i.productId, i.name, i.quantity, i.price),
      ),
      data.paymentStatus as QuotePaymentStatus,
    );
  }
}
