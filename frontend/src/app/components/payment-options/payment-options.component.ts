import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.css']
})
export class PaymentOptionsComponent implements OnInit {
  totalAmount: number;
  userId: string | undefined;

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
  

  payByCard(): void {
    // Save details in PaymentService
    this.paymentService.setPaymentDetails(this.totalAmount, this.userId);
  
    console.log('Navigating to pay_by_card page');
    console.log('State to be passed:', { userId: this.userId, totalAmount: this.totalAmount });
  
    // Navigate to pay_by_card
    this.router.navigate(['/pay_by_card']);
  }
  
  

  payByPayPal(): void {
    alert('Redirecting to PayPal...');
    // Simulate PayPal redirection
  }

  goBack() {
    this.router.navigate(['/payments']);
  }
}
