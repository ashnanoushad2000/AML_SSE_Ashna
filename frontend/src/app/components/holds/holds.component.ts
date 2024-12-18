import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { HoldService, Hold } from '../../services/hold.service';
import { AuthService } from '../../services/auth.service';
import { SearchService, MediaSearchResult } from '../../services/search.service';
import { catchError, debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
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
      
      <!-- Tabs -->
      <div class="tabs">
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'current'"
          (click)="switchTab('current')">
          Current Holds
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'search'"
          (click)="switchTab('search')">
          Place Hold
        </button>
      </div>
    
      <!-- Current Holds View -->
      <div *ngIf="activeTab === 'current'" class="holds-view">
        <div class="book-list">
          @for (book of currentHolds; track book.id) {
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
      </div>

      <!-- Search View -->
      <div *ngIf="activeTab === 'search'" class="search-view">
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Search for books to place hold" 
            class="search-input"
            [value]="searchTerm"
            (input)="onSearchInput($event)">
        </div>

        <div class="search-results">
          @for (item of searchResults; track item.media_id) {
            <div class="book-item" (click)="initiateHold(item)">
              <div class="book-icon">📚</div>
              <div class="book-info">
                <span class="book-title">{{ item.title }}</span>
                <span class="book-author">by {{ item.author }}</span>
                @if (item.inventory) {
                  <span class="book-availability">
                    Available: {{ item.inventory.available_copies }} of {{ item.inventory.total_copies }}
                  </span>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Hold Details Overlay -->
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
  styles: [`
    .holds-container {
      max-width: 480px;
      margin: 0 auto;
      padding: 20px;
      background: white;
      min-height: 100vh;
      padding-bottom: 70px;
    }
    
    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .back-btn {
      border: none;
      background: none;
      font-size: 24px;
      cursor: pointer;
    }
    
    .header h1 {
      position: relative;
      font-size: 2rem;
      color: #333;
      text-align: center;
      margin-left: auto;
      margin-right: auto;
      left: -20px;
    }

    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }

    .tab-btn {
      flex: 1;
      padding: 12px;
      border: none;
      background: #f1f3f5;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }

    .tab-btn.active {
      background: #FFC107;
      color: #333;
      font-weight: bold;
    }
    
    .search-bar {
      margin-bottom: 20px;
    }
    
    .search-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      font-size: 16px;
    }
    
    .book-list, .search-results {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .book-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .book-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    
    .book-icon {
      font-size: 24px;
    }
    
    .book-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .book-title {
      font-weight: 500;
    }
    
    .book-author {
      font-size: 14px;
      color: #868e96;
    }
    
    .book-status {
      font-size: 14px;
      color: #fa5252;
    }
    
    .book-status.available {
      color: #40c057;
    }
    
    .book-availability {
      font-size: 12px;
      color: #868e96;
    }
    
    .hold-date {
      font-size: 12px;
      color: #868e96;
    }
  `]
})
export class HoldsComponent implements OnInit {
  activeTab: 'current' | 'search' = 'current';
  currentHolds: DisplayBook[] = [];
  searchResults: MediaSearchResult[] = [];
  private userId: string | null = null;
  searchTerm: string = '';
  showOverlay: boolean = false;
  selectedMediaId: string = '';
  selectedHoldId: string = '';
  selectedHoldDate: string = '';
  selectedStatus: string = '';
  mediaCache: Map<string, any> = new Map();
  private searchSubject = new Subject<string>();

  constructor(
    private router: Router,
    private holdService: HoldService,
    private authService: AuthService,
    private searchService: SearchService
  ) {
    // Set up search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term.trim()) {
          return of({ results: [], total: 0 });
        }
        return this.searchService.search(term);
      })
    ).subscribe({
      next: (response) => {
        this.searchResults = response.results;
      },
      error: (error) => {
        console.error('Search error:', error);
      }
    });
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.fetchHolds();
    }
  }

  switchTab(tab: 'current' | 'search') {
    this.activeTab = tab;
    if (tab === 'current') {
      this.fetchHolds();
    } else {
      this.searchResults = [];
      this.searchTerm = '';
    }
  }

  private fetchHolds() {
    if (!this.userId) return;

    this.holdService.getUserHolds(this.userId)
      .pipe(
        catchError(error => {
          console.error('Error fetching holds:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (holds: Hold[]) => {
          this.currentHolds = holds.map(hold => ({
            id: hold.hold_id,
            mediaId: hold.media_id,
            title: 'Loading...',
            status: this.getStatusDisplay(hold.status),
            holdDate: new Date(hold.request_date).toLocaleDateString()
          }));
          
          holds.forEach(hold => {
            this.searchService.getMediaById(hold.media_id).subscribe({
              next: (media) => {
                const bookIndex = this.currentHolds.findIndex(b => b.mediaId === hold.media_id);
                if (bookIndex !== -1) {
                  this.currentHolds[bookIndex].title = media.title;
                  this.mediaCache.set(hold.media_id, media);
                }
              },
              error: (error) => {
                console.error(`Error fetching media details for ${hold.media_id}:`, error);
                const bookIndex = this.currentHolds.findIndex(b => b.mediaId === hold.media_id);
                if (bookIndex !== -1) {
                  this.currentHolds[bookIndex].title = `Hold #${hold.hold_id.slice(0, 8)}`;
                }
              }
            });
          });
        },
        error: (error) => {
          console.error('Error processing holds:', error);
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
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  initiateHold(media: MediaSearchResult) {
    if (!this.userId) return;
    
    this.holdService.createHold(this.userId, media.media_id).subscribe({
      next: (response) => {
        this.switchTab('current');
        // You might want to add a success notification here
      },
      error: (error) => {
        console.error('Error creating hold:', error);
        // You might want to add an error notification here
      }
    });
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
    this.router.navigate(['/home']);
  }
}