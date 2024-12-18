import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { HoldService, Hold } from '../../services/hold.service';
import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HoldDetailsComponent } from './hold-details.component';

interface DisplayBook {
  id: string;
  mediaId: string;
  title: string;
  status: string;
  holdDate: string;
}

@Component({
  selector: 'app-holds',
  standalone: true,
  imports: [
    CommonModule, 
    FooterComponent,
    RouterModule,
    HoldDetailsComponent
  ],
  template: `
    <div class="holds-container">
      <div class="header">
        <button class="back-btn" (click)="goBack()">←</button>
        <h1>Holds</h1>
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
              <span class="book-status" [class.available]="book.status === 'READY'">
                {{ book.status }}
              </span>
              @if (book.holdDate) {
                <span class="hold-date">Hold placed: {{ book.holdDate }}</span>
              }
            </div>
          </div>
        }
      </div>

      <app-hold-details
        [show]="showOverlay"
        [mediaId]="selectedMediaId"
        [holdId]="selectedHoldId"
        [holdDate]="selectedHoldDate"
        [status]="selectedStatus"
        (closeOverlay)="closeDetails()"
        (holdCancelled)="onHoldCancelled()"
      ></app-hold-details>
    </div>
    <app-footer></app-footer>
  `,
  styleUrls: ['./holds.component.css']
})
export class HoldsComponent implements OnInit {
  books: DisplayBook[] = [];
  filteredBooks: DisplayBook[] = [];
  private userId: string | null = null;
  searchTerm: string = '';
  showOverlay: boolean = false;
  selectedMediaId: string = '';
  selectedHoldId: string = '';
  selectedHoldDate: string = '';
  selectedStatus: string = '';
  mediaCache: Map<string, any> = new Map();

  constructor(
    private router: Router,
    private holdService: HoldService,
    private authService: AuthService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    console.log('HoldsComponent: Initializing');
    
    if (!this.authService.isLoggedIn()) {
      console.error('HoldsComponent: User not logged in');
      this.router.navigate(['/']);
      return;
    }

    this.userId = this.authService.getUserId();
    console.log('HoldsComponent: Retrieved user ID:', this.userId);
    
    if (this.userId) {
      this.fetchHolds();
    } else {
      console.warn('HoldsComponent: No user ID found, but user is logged in');
    }
  }

  private fetchHolds() {
    if (!this.userId) return;

    console.log('HoldsComponent: Fetching holds for user:', this.userId);
    this.holdService.getUserHolds(this.userId)
      .pipe(
        catchError(error => {
          console.error('HoldsComponent: Error fetching holds:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (holds: Hold[]) => {
          console.log('HoldsComponent: Holds received:', holds);
          // First create basic display books
          this.books = holds.map(hold => ({
            id: hold.hold_id,
            mediaId: hold.media_id,
            title: 'Loading...', // Temporary title while we fetch media details
            status: this.getStatusDisplay(hold.status),
            holdDate: new Date(hold.request_date).toLocaleDateString()
          }));
          this.filteredBooks = [...this.books];
          
          // Then fetch media details for each hold
          holds.forEach(hold => {
            this.searchService.getMediaById(hold.media_id).subscribe({
              next: (media) => {
                // Update the book title once we have the media details
                const bookIndex = this.books.findIndex(b => b.mediaId === hold.media_id);
                if (bookIndex !== -1) {
                  this.books[bookIndex].title = media.title;
                  this.mediaCache.set(hold.media_id, media);
                  this.filteredBooks = [...this.books]; // Update filtered books
                }
              },
              error: (error) => {
                console.error(`Error fetching media details for ${hold.media_id}:`, error);
                const bookIndex = this.books.findIndex(b => b.mediaId === hold.media_id);
                if (bookIndex !== -1) {
                  this.books[bookIndex].title = `Hold #${hold.hold_id.slice(0, 8)}`;
                }
              }
            });
          });
        },
        error: (error) => {
          console.error('HoldsComponent: Error processing holds:', error);
        }
      });
  }

  private getStatusDisplay(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'On Hold',
      'READY': 'Available',
      'CANCELLED': 'Cancelled',
      'FULFILLED': 'Fulfilled'
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
    this.selectedHoldId = book.id;
    this.selectedHoldDate = book.holdDate;
    this.selectedStatus = book.status;
    this.showOverlay = true;
  }

  onHoldCancelled() {
    if (this.userId) {
      this.fetchHolds();
    }
  }

  closeDetails() {
    this.showOverlay = false;
    this.selectedMediaId = '';
    this.selectedHoldId = '';
    this.selectedHoldDate = '';
    this.selectedStatus = '';
  }

  goBack() {
    console.log('Navigating back to home');
    this.router.navigate(['/home']);
  }
}