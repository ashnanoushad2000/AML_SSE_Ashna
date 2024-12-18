import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { LoanService, Loan } from '../../services/loan.service';
import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoanDetailsComponent } from './loan-details.component'; // Updated import path

interface DisplayBook {
  id: string;
  mediaId: string;
  title: string;
  status: string;
  dueDate: string;
  renewals: number;
}

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [
    CommonModule, 
    FooterComponent,
    RouterModule,
    LoanDetailsComponent
  ],
  template: `
    <div class="loans-container">
      <div class="header">
        <button class="back-btn" (click)="goBack()">←</button>
        <h1>Current Loans</h1>
      </div>
    
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="Search Books" 
          class="search-input"
          [value]="searchTerm"
          (input)="onSearchInput($event)">
      </div>
    
      <div class="book-list">
        @for (book of filteredBooks; track book.id) {
          <div class="book-item" (click)="showDetails(book)">
            <div class="book-icon">📚</div>
            <div class="book-info">
              <span class="book-title">{{ book.title }}</span>
              <span class="book-status" [class.overdue]="book.status === 'Overdue'">
                {{ book.status }}
              </span>
              <span class="due-date">Due: {{ book.dueDate }}</span>
              @if (book.renewals > 0) {
                <span class="renewals">Renewed {{ book.renewals }} times</span>
              }
            </div>
          </div>
        }
      </div>
    
      <app-loan-details
        [show]="showOverlay"
        [mediaId]="selectedMediaId"
        [dueDate]="selectedDueDate"
        [status]="selectedStatus"
        [renewalsCount]="selectedRenewals"
        (closeOverlay)="closeDetails()"
      ></app-loan-details>
    </div>
    <app-footer></app-footer>
  `,
  styleUrls: ['./loans.component.css']
})
export class LoansComponent implements OnInit {
  books: DisplayBook[] = [];
  filteredBooks: DisplayBook[] = [];
  private userId: string | null = null;
  searchTerm: string = '';
  showOverlay: boolean = false;
  selectedMediaId: string = '';
  selectedDueDate: string = '';
  selectedStatus: string = '';
  selectedRenewals: number = 0;
  mediaCache: Map<string, any> = new Map();

  constructor(
    private router: Router,
    private loanService: LoanService,
    private authService: AuthService,
    private searchService: SearchService
  ) {
    console.log('LoansComponent: Constructor initialized');
  }

  ngOnInit() {
    console.log('LoansComponent: Initializing');
    
    if (!this.authService.isLoggedIn()) {
      console.error('LoansComponent: User not logged in');
      this.router.navigate(['/']);
      return;
    }

    this.userId = this.authService.getUserId();
    console.log('LoansComponent: Retrieved user ID:', this.userId);
    
    if (this.userId) {
      this.fetchLoans();
    } else {
      console.warn('LoansComponent: No user ID found, but user is logged in');
    }
  }

  private fetchLoans() {
    if (!this.userId) return;

    console.log('LoansComponent: Fetching loans for user:', this.userId);
    this.loanService.getUserActiveLoans(this.userId)
      .pipe(
        catchError(error => {
          console.error('LoansComponent: Error fetching loans:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (loans: Loan[]) => {
          console.log('LoansComponent: Loans received:', loans);
          this.books = loans.map(loan => ({
            id: loan.loan_id,
            mediaId: loan.media_id,
            title: 'Loading...',
            status: this.getDisplayStatus(loan.status),
            dueDate: new Date(loan.due_date).toLocaleDateString(),
            renewals: loan.renewals_count
          }));
          this.filteredBooks = [...this.books];
          
          loans.forEach(loan => {
            this.searchService.getMediaById(loan.media_id).subscribe({
              next: (media) => {
                const bookIndex = this.books.findIndex(b => b.mediaId === loan.media_id);
                if (bookIndex !== -1) {
                  this.books[bookIndex].title = media.title;
                  this.mediaCache.set(loan.media_id, media);
                  this.filteredBooks = [...this.books];
                }
              },
              error: (error) => {
                console.error(`Error fetching media details for ${loan.media_id}:`, error);
                const bookIndex = this.books.findIndex(b => b.mediaId === loan.media_id);
                if (bookIndex !== -1) {
                  this.books[bookIndex].title = `Loan #${loan.loan_id.slice(0, 8)}`;
                }
              }
            });
          });
        },
        error: (error) => {
          console.error('LoansComponent: Error processing loans:', error);
        }
      });
  }

  private getDisplayStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'ACTIVE': 'Active',
      'OVERDUE': 'Overdue',
      'RETURNED': 'Returned'
    };
    return statusMap[status] || status;
  }

  onSearchInput(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filterBooks();
  }

  filterBooks() {
    if (!this.searchTerm.trim()) {
      this.filteredBooks = [...this.books];
      return;
    }
    
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredBooks = this.books.filter(book => 
      book.title.toLowerCase().includes(searchTermLower) ||
      book.status.toLowerCase().includes(searchTermLower)
    );
  }

  showDetails(book: DisplayBook) {
    this.selectedMediaId = book.mediaId;
    this.selectedDueDate = book.dueDate;
    this.selectedStatus = book.status;
    this.selectedRenewals = book.renewals;
    this.showOverlay = true;
  }

  closeDetails() {
    this.showOverlay = false;
    this.selectedMediaId = '';
    this.selectedDueDate = '';
    this.selectedStatus = '';
    this.selectedRenewals = 0;
  }

  goBack() {
    console.log('Navigating back to home');
    this.router.navigate(['/home']);
  }
}