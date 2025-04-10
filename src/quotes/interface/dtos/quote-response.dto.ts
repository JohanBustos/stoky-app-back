import { Quote, QuotePaymentStatus } from '../../domain/entities/quote.entity';
import { QuoteItemDto } from './create-quote.dto';

export class QuoteResponseDto {
  id: string | undefined;
  customerId: string;
  createdAt: Date | undefined;
  totalAmount: number;
  status: QuotePaymentStatus;
}

export class QuoteDetailsResponseDto extends QuoteResponseDto {
  items: QuoteItemDto[];

  static fromEntityToDto(quote: Quote): QuoteDetailsResponseDto {
    const base = new QuoteDetailsResponseDto();
    base.id = quote.id;
    base.customerId = quote.customerId;
    base.createdAt = quote.createdAt;
    base.totalAmount = quote.totalAmount;
    base.status = quote.paymentStatus;
    base.items = quote.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    return base;
  }
}
