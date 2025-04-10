export enum QuotePaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export class Quote {
  constructor(
    public readonly id: string | undefined,
    public readonly customerId: string,
    public readonly createdAt: Date | undefined,
    public readonly totalAmount: number,
    public readonly items: QuoteItem[],
    public paymentStatus: QuotePaymentStatus = QuotePaymentStatus.PENDING,
  ) {}

  markAsPaid(): void {
    if (this.totalAmount <= 0 || this.items.length === 0) {
      throw new Error('Invalid quote. Cannot mark as paid.');
    }
    this.paymentStatus = QuotePaymentStatus.PAID;
  }

  cancel(): void {
    this.paymentStatus = QuotePaymentStatus.CANCELLED;
  }

  fail(): void {
    this.paymentStatus = QuotePaymentStatus.FAILED;
  }

  isPending(): boolean {
    return this.paymentStatus === QuotePaymentStatus.PENDING;
  }
}

export class QuoteItem {
  constructor(
    public readonly productId: string,
    public readonly name: string,
    public readonly quantity: number,
    public readonly price: number,
  ) {}
}
