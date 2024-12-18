import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService, MediaSearchResult } from '../../services/search.service';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overlay" *ngIf="show" (click)="onOverlayClick($event)">
      <div class="overlay-content">
        <button class="close-btn" (click)="close()">×</button>
        
        <div class="media-details" *ngIf="mediaDetails">
          <h2>{{ mediaDetails.title }}</h2>
          <div class="details-grid">
            <div class="detail-item">
              <span class="label">Author:</span>
              <span class="value">{{ mediaDetails.author }}</span>
            </div>
            <div class="detail-item" *ngIf="mediaDetails.isbn">
              <span class="label">ISBN:</span>
              <span class="value">{{ mediaDetails.isbn }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Due Date:</span>
              <span class="value">{{ dueDate | date }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Status:</span>
              <span class="value" [class.overdue]="status === 'Overdue'">{{ status }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Renewals:</span>
              <span class="value">{{ renewalsCount }}</span>
            </div>
          </div>
          
          <div class="description" *ngIf="mediaDetails.item_description">
            <h3>Description</h3>
            <p>{{ mediaDetails.item_description }}</p>
          </div>

          <div class="actions">
            <button 
              class="btn-renew" 
              *ngIf="canRenew" 
              (click)="renewLoan()"
              [disabled]="isRenewing">
              {{ isRenewing ? 'Renewing...' : 'Renew Loan' }}
            </button>
            <div class="error-message" *ngIf="renewalError">{{ renewalError }}</div>
          </div>
        </div>
        
        <div class="loading" *ngIf="!mediaDetails && show">
          Loading details...
        </div>

        <div class="error" *ngIf="error">
          {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .overlay-content {
      background: white;
      padding: 24px;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
      position: relative;
    }

    .close-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      border: none;
      background: none;
      font-size: 24px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .close-btn:hover {
      background: #f1f3f5;
    }

    h2 {
      margin: 0 0 20px 0;
      font-size: 1.5rem;
      color: #333;
    }

    .details-grid {
      display: grid;
      gap: 16px;
      margin-bottom: 24px;
    }

    .detail-item {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 8px;
    }

    .label {
      color: #868e96;
      font-size: 0.9rem;
    }

    .value {
      color: #333;
      font-size: 0.9rem;
    }

    .value.overdue {
      color: #e03131;
    }

    .description h3 {
      font-size: 1.1rem;
      margin: 0 0 12px 0;
      color: #333;
    }

    .description p {
      color: #495057;
      line-height: 1.5;
      font-size: 0.9rem;
      margin: 0;
    }

    .loading {
      text-align: center;
      color: #868e96;
      padding: 20px;
    }

    .error {
      color: #fa5252;
      text-align: center;
      padding: 20px;
    }

    .actions {
      margin-top: 24px;
      text-align: center;
    }

    .btn-renew {
      background-color: #FFC107;
      color: #333;
      border: none;
      padding: 12px 24px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: bold;
      transition: background-color 0.2s;
    }

    .btn-renew:hover:not(:disabled) {
      background-color: #e0a106;
    }

    .btn-renew:disabled {
      background-color: #dee2e6;
      cursor: not-allowed;
    }

    .error-message {
      color: #fa5252;
      font-size: 0.9rem;
      margin-top: 8px;
      font-weight: bold;
    }
  `]
})
export class LoanDetailsComponent {
  @Input() show: boolean = false;
  @Input() mediaId: string = '';
  @Input() dueDate: string = '';
  @Input() status: string = '';
  @Input() renewalsCount: number = 0;
  @Input() loanId: string = '';
  @Output() closeOverlay = new EventEmitter<void>();
  @Output() loanRenewed = new EventEmitter<void>();
  
  mediaDetails: MediaSearchResult | null = null;
  error: string = '';
  renewalError: string = '';
  isRenewing: boolean = false;

  constructor(
    private searchService: SearchService,
    private loanService: LoanService
  ) {}

  get canRenew(): boolean {
    return this.status === 'Active' && this.renewalsCount < 3;
  }

  ngOnChanges() {
    if (this.show && this.mediaId) {
      this.loadMediaDetails();
    } else if (!this.show) {
      this.mediaDetails = null;
      this.error = '';
      this.renewalError = '';
    }
  }

  private loadMediaDetails() {
    this.mediaDetails = null;
    this.error = '';
    
    this.searchService.getMediaById(this.mediaId)
      .subscribe({
        next: (media) => {
          console.log('Loaded media details:', media);
          this.mediaDetails = media;
        },
        error: (error) => {
          console.error('Error loading media details:', error);
          this.error = 'Failed to load media details. Please try again later.';
        }
      });
  }

  renewLoan() {
    if (!this.canRenew) return;

    this.isRenewing = true;
    this.renewalError = '';

    this.loanService.renewLoan(this.loanId)
      .subscribe({
        next: (response) => {
          console.log('Loan renewed successfully:', response);
          this.isRenewing = false;
          this.loanRenewed.emit();
          this.close();
        },
        error: (error) => {
          console.error('Error renewing loan:', error);
          this.isRenewing = false;
          this.renewalError = error.error?.message || 'Failed to renew loan. Please try again later.';
        }
      });
  }

  close() {
    this.closeOverlay.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this.close();
    }
  }
}