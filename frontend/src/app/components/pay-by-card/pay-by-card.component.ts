import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-pay-by-card',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pay-by-card.component.html',
  styleUrls: ['./pay-by-card.component.css'],
})
export class PayByCardComponent implements OnInit {
  userId: string | undefined;
  totalAmount: number | undefined;

  cardDetails = {
    cardNumber: '',
    cardHolderName: '',
    expiry: '',
    cvv: '',
  };

  constructor(private router: Router, private http: HttpClient, private paymentService: PaymentService) {}

  ngOnInit(): void {
    const { totalAmount, userId } = this.paymentService.getPaymentDetails();
  
    if (totalAmount && userId) {
      this.totalAmount = totalAmount;
      this.userId = userId;
    } else {
      alert('No payment details found. Redirecting to Payments.');
      this.router.navigate(['/payments']);
    }
  }

  submitPayment(): void {
    if (!this.userId || !this.totalAmount) {
      alert('Missing payment details.');
      return;
    }

    // Call API to process payment
    this.http
      .post('http://localhost:5000/api/payments/pay', {
        user_id: this.userId,
        amount: this.totalAmount,
        payment_method: 'Card',
      })
      .subscribe({
        next: (response: any) => {
          alert('Payment Successful!');
          this.router.navigate(['/payments']); // Redirect to payments page
        },
        error: (error) => {
          console.error('Payment failed:', error);
          alert('Payment failed. Please check your details and try again.');
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/payments']);
  }
}

