import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';

interface Loan {
  id: number;
  title: string;
  dueDate: string;
}

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css']
})
export class LoansComponent {
  searchText: string = '';
  
  loans: Loan[] = [
    { id: 1, title: 'Book 1', dueDate: '2024-02-01' },
    { id: 2, title: 'Book 2', dueDate: '2024-02-03' },
    { id: 3, title: 'Book 3', dueDate: '2024-02-05' },
    { id: 4, title: 'Book 4', dueDate: '2024-02-07' },
    { id: 5, title: 'Book 5', dueDate: '2024-02-09' },
    { id: 6, title: 'Book 6', dueDate: '2024-02-11' }
  ];

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']);
  }
}