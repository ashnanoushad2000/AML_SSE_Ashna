import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-transfer-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './transfer-details.component.html',
  styleUrl: './transfer-details.component.css'
})
export class TransferDetailsComponent {
  @Input() transferDetails: any; // Input passed to show transfer details
  @Input() showModal: boolean = false; // Modal visibility

  constructor(private http: HttpClient) {}

  // Close the modal
  closeModal(): void {
    // Add logic to close the modal
    window.location.reload();
  }

  // Cancel the transfer
  cancelTransfer(): void {
    const updatedStatus = { status: 'CANCELLED' };

    this.http
      .put(`http://localhost:5000/api/transfers/updateStatus/${this.transferDetails.transfer_id}`, updatedStatus)
      .subscribe({
        next: () => {
          alert('Transfer has been cancelled successfully!');
          this.transferDetails.status = 'CANCELLED'; // Update status locally
        },
        error: (error) => {
          console.error('Error cancelling transfer:', error);
          alert('Failed to cancel transfer. Please try again later.');
        }
      });
  }

  completeTransfer(): void {
    const updatedStatus = { status: 'COMPLETED' };
  
    this.http
      .put(`http://localhost:5000/api/transfers/updateStatus/${this.transferDetails.transfer_id}`, updatedStatus)
      .subscribe({
        next: () => {
          alert('Transfer has been marked as completed successfully!');
          this.transferDetails.status = 'COMPLETED'; // Update status locally
          this.transferDetails.completed_at = new Date().toISOString(); // Update completed_at locally
        },
        error: (error) => {
          console.error('Error completing transfer:', error);
          alert('Failed to complete transfer. Please try again later.');
        }
      });
  }

  markAsInTransit(): void {
    const updatedStatus = { status: 'IN_TRANSIT' };
  
    this.http
      .put(`http://localhost:5000/api/transfers/updateStatus/${this.transferDetails.transfer_id}`, updatedStatus)
      .subscribe({
        next: () => {
          alert('Transfer has been marked as In-Transit successfully!');
          this.transferDetails.status = 'IN_TRANSIT'; // Update status locally
        },
        error: (error) => {
          console.error('Error marking transfer as In-Transit:', error);
          alert('Failed to update transfer status. Please try again later.');
        }
      });
  }
  
}
