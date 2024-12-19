import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/payment.service';

export interface Payment {
  Fees: number;
  Fines: number;
  Subscriptions: number;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  payments: Payment = { Fees: 0, Fines: 0, Subscriptions: 0 };
  total: number = 0;
  deadlines: string[] = [];
  userId: string | undefined;

  constructor(private http: HttpClient, private router: Router, private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.initializePayments();
  }

  initializePayments(): void {
    this.http
      .get<any>('http://localhost:5000/api/auth/session-check', { withCredentials: true })
      .subscribe({
        next: (response) => {
          this.userId = response.user_id;
          this.loadPaymentsAndDeadlines();
        },
        error: (error) => {
          console.error('Error fetching user session:', error);
          alert('Unable to fetch user session. Please log in again.');
        },
      });
  }

  loadPaymentsAndDeadlines(): void {
    if (!this.userId) return;

    this.fetchPayments();
    this.fetchDeadlines();
  }

  fetchPayments(): void {
    this.http
      .get<{ payments: Payment; total: number }>(
        `http://localhost:5000/api/payments/payments/${this.userId}`
      )
      .subscribe({
        next: (data) => {
          this.payments = data.payments;
          this.total = data.total;
        },
        error: (error) => {
          console.error('Error fetching payments:', error);
          alert('Failed to load payments. Please try again later.');
        },
      });
  }

  fetchDeadlines(): void {
    this.http
      .get<{ item_name: string; due_date: string; category: string }[]>(
        `http://localhost:5000/api/payments/deadlines/${this.userId}`
      )
      .subscribe({
        next: (data) => {
          // Format deadlines with item name and due date on separate lines
          this.deadlines = data.map(
            (deadline) => `${deadline.item_name} (${deadline.category})<br><strong>Due: ${deadline.due_date}</strong>`
          );
        },
        error: (error) => {
          console.error('Error fetching deadlines:', error);
          alert('Failed to load deadlines. Please try again later.');
        },
      });
  }
  

  navigateToPaymentOptions(): void {
    if (!this.userId) {
      alert('user session missing, please log in again');
      return;
    }
    if (this.total === 0) {
      alert('No pending payments');
      return;
    }
  
    // Store payment details in the service
    this.paymentService.setPaymentDetails(this.total, this.userId);
  
    // Navigate to payment options
    this.router.navigate(['/payment_options']);
  }
}
