import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
interface Book {
  id: number;
  title: string;
  status: 'Available' | 'On Hold';
  holdDate?: string;
}

@Component({
  selector: 'app-holds',
  standalone: true,
  imports: [CommonModule,FooterComponent],
  templateUrl: './holds.component.html',
  styleUrls: ['./holds.component.css']
})
export class HoldsComponent {
  books: Book[] = [
    { id: 1, title: 'Book 1', status: 'Available' },
    { id: 2, title: 'Book 2', status: 'Available' },
    { id: 3, title: 'Book 3', status: 'On Hold', holdDate: '2024-01-20' },
    { id: 4, title: 'Book 4', status: 'On Hold', holdDate: '2024-01-21' },
    { id: 5, title: 'Book 5', status: 'On Hold', holdDate: '2024-01-22' },
    { id: 6, title: 'Book 6', status: 'On Hold', holdDate: '2024-01-23' }
  ];

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']);
  }

  bookDetails(){
    alert("This will show book details")
  }
}