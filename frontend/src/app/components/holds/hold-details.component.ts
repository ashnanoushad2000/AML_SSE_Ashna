import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService, MediaSearchResult } from '../../services/search.service';
import { HoldService } from '../../services/hold.service';

@Component({
  selector: 'app-hold-details',
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
              <span class="label">Hold Date:</span>
              <span class="value">{{ holdDate | date }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Status:</span>
              <span class="value" [class.ready]="status === 'READY'">{{ status }}</span>
            </div>
            <div class="detail-item" *ngIf="mediaDetails.publisher">
              <span class="label">Publisher:</span>
              <span class="value">{{ mediaDetails.publisher }}</span>
            </div>
            <div class="detail-item" *ngIf="mediaDetails.inventory">
              <span class="label">Availability:</span>
              <span class="value">{{ mediaDetails.inventory.available_copies }} of {{ mediaDetails.inventory.total_copies }} available</span>
            </div>
          </div>
          
          <div class="description" *ngIf="mediaDetails.item_description">
            <h3>Description</h3>
            <p>{{ mediaDetails.item_description }}</p>
          </div>

          <div class="actions" *ngIf="canCancel">
            <button 
              class="btn-cancel" 
              (click)="cancelHold()"
              [disabled]="isCancelling">
              {{ isCancelling ? 'Cancelling...' : 'Cancel Hold' }}
            </button>
            <div class="error-message" *ngIf="cancelError">{{ cancelError }}</div>
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

    .value.ready {
      color: #40c057;
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

    .btn-cancel {
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

    .btn-cancel:hover:not(:disabled) {
      background-color: #e0a106;
    }

    .btn-cancel:disabled {
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
export class HoldDetailsComponent {
  @Input() show: boolean = false;
  @Input() mediaId: string = '';
  @Input() holdId: string = '';
  @Input() holdDate: string = '';
  @Input() status: string = '';
  @Output() closeOverlay = new EventEmitter<void>();
  @Output() holdCancelled = new EventEmitter<void>();
  
  mediaDetails: MediaSearchResult | null = null;
  error: string = '';
  cancelError: string = '';
  isCancelling: boolean = false;

  constructor(
    private searchService: SearchService,
    private holdService: HoldService
  ) {}

  get canCancel(): boolean {
    return this.status === 'On Hold';
  }

  ngOnChanges() {
    if (this.show && this.mediaId) {
      this.loadMediaDetails();
    } else if (!this.show) {
      this.mediaDetails = null;
      this.error = '';
      this.cancelError = '';
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

  cancelHold() {
    if (!this.canCancel) return;

    this.isCancelling = true;
    this.cancelError = '';

    this.holdService.cancelHold(this.holdId)
      .subscribe({
        next: (response) => {
          console.log('Hold cancelled successfully:', response);
          this.isCancelling = false;
          this.holdCancelled.emit();
          this.close();
        },
        error: (error) => {
          console.error('Error cancelling hold:', error);
          this.isCancelling = false;
          this.cancelError = error.error?.message || 'Failed to cancel hold. Please try again later.';
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