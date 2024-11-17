import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import {faArrowLeftLong, faUser} from '@fortawesome/free-solid-svg-icons'
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';


export interface payment{
  fees: number;
  fines: number;
  subscriptions: number;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})

export class PaymentsComponent {
  payments : payment = { fees: 0, fines: 0, subscriptions: 0 };
  total = 0;
  deadlines: String[] = [];
  faArrowLeftLong = faArrowLeftLong;
  faUser = faUser;
  faCircle = faCircle;

  //constructor(private paymentsService: PaymentsService) {}

  ngOnInit(): void {
    this.fetchPayments();
    this.fetchDeadlines();
  }

  fetchPayments(): void {
    //Fetch from Database
    //this.paymentsService.getPayments().subscribe(data => {
    //this.payments = data;
    // this.calculateTotal();
   //});
   this.payments = {fees: 5,fines: 5,subscriptions: 5};
   this.calculateTotal()
  }

  fetchDeadlines(): void {
    //Fetch from Database
    //this.paymentsService.getDeadlines().subscribe(data => {
    //  this.deadlines = data;
    //});
    this.deadlines = ["Book 1: 19/12/2024", "Book 2: 11/1,2025", "Book 3: 29/1/2025"]
  }

  calculateTotal(): void {
    this.total = this.payments.fees + this.payments.fines + this.payments.subscriptions;
  }

  viewDetails(category: string): void {
    alert(`Viewing details for ${category}`);
  }

  makePayment(): void {
    alert('Payment processing...');
  }
}
