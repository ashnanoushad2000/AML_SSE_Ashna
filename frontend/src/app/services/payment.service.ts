import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private totalAmount: number = 0;
  private userId: string | undefined;

  setPaymentDetails(amount: number, userId: string): void {
    this.totalAmount = amount;
    this.userId = userId;
  }

  getPaymentDetails(): { totalAmount: number; userId: string | undefined } {
    return { totalAmount: this.totalAmount, userId: this.userId };
  }
}
