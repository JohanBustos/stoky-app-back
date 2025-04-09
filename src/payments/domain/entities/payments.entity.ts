export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CARD = 'CARD',
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
  OTHER = 'OTHER',
}

export class Payment {
  constructor(
    public readonly id: string,
    public readonly quoteId: string,
    public readonly amount: number,
    public readonly method: PaymentMethod,
    public status: PaymentStatus = PaymentStatus.PENDING,
    public readonly createdAt: Date = new Date(),
    public readonly reference?: string,
  ) {}

  markAsCompleted(): void {
    this.status = PaymentStatus.COMPLETED;
  }

  markAsFailed(): void {
    this.status = PaymentStatus.FAILED;
  }

  cancel(): void {
    this.status = PaymentStatus.CANCELLED;
  }

  isPending(): boolean {
    return this.status === PaymentStatus.PENDING;
  }
}
