import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";
import { FooterAdminComponent } from "../footer-admin/footer-admin.component";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transfer-initiation',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterAdminComponent],
  templateUrl: './transfer-initiation.component.html',
  styleUrl: './transfer-initiation.component.css'
})
export class TransferInitiationComponent implements OnInit {
  availableMedia: any[] = []; // List of media with available copies
  sourceBranches: any[] = []; // Source branches
  destinationBranches: any[] = []; // Destination branches
  userName: string = ''; // Full name of the logged-in user

  // Transfer model for the form
  transfer = {
    sourceBranch: '',
    destinationBranch: '',
    mediaItem: '',
    quantity: 1,
    reason: '',
    errors: {
      sourceBranch: '',
      destinationBranch: '',
      mediaItem: '',
      quantity: '',
      quantityAvailability: ''
    }
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchUserName();
    this.fetchBranches();
  }

  // Fetch the user's full name
  fetchUserName(): void {
    this.http
      .get<any>('http://localhost:5000/api/auth/validate?include_user=true', { withCredentials: true })
      .subscribe({
        next: (response) => {
          if (response.first_name && response.last_name) {
            this.userName = `${response.first_name} ${response.last_name}`;
            console.log('Full Name:', this.userName);
          } else {
            console.warn('Full name not returned.');
          }
        },
        error: (error) => {
          console.error('Error fetching user name:', error);
          alert('Failed to validate session. Please log in again.');
          this.router.navigate(['/admin'])
        },
      });
  }
  

  // Fetch available branches for source and destination dropdowns
  fetchBranches(): void {
    this.http.get<any[]>('http://localhost:5000/api/transfers/branches').subscribe({
      next: (data) => {
        this.sourceBranches = data;
        this.destinationBranches = data;
      },
      error: (error) => {
        console.error('Error fetching branches:', error);
        alert('Failed to fetch branches.');
      },
    });
  }

  // Fetch media items with available copies
  fetchAvailableMedia(): void {
    this.http.get<any[]>('http://localhost:5000/api/transfers/getAvailableMedia').subscribe({
      next: (data) => {
        this.availableMedia = data;
      },
      error: (error) => {
        console.error('Error fetching available media:', error);
        alert('Failed to fetch media items.');
      },
    });
  }

  // Submit the transfer form
  initiateTransfer(): void {
    let hasError = false;
  
    // Reset errors
    this.transfer.errors = {
      sourceBranch: '',
      destinationBranch: '',
      mediaItem: '',
      quantity: '',
      quantityAvailability: ''
    };
  
    // Basic validation
    if (!this.transfer.sourceBranch) {
      this.transfer.errors.sourceBranch = 'Source branch is required.';
      hasError = true;
    }
    if (!this.transfer.destinationBranch) {
      this.transfer.errors.destinationBranch = 'Destination branch is required.';
      hasError = true;
    }
    if (this.transfer.sourceBranch === this.transfer.destinationBranch) {
      this.transfer.errors.sourceBranch = 'Source and destination cannot be the same.';
      this.transfer.errors.destinationBranch = 'Source and destination cannot be the same.';
      hasError = true;
    }
    if (!this.transfer.mediaItem) {
      this.transfer.errors.mediaItem = 'Media item is required.';
      hasError = true;
    }
  
    // Validate available copies
    this.validateQuantity();
    if (this.transfer.errors.quantityAvailability) {
      hasError = true;
    }
  
    // Stop if there are errors
    if (hasError) return;
  
    // Prepare payload
    const payload = {
      source_branch: this.transfer.sourceBranch,
      destination_branch: this.transfer.destinationBranch,
      media_id: this.transfer.mediaItem,
      quantity: this.transfer.quantity,
      initiated_by: this.userName,
      reason: this.transfer.reason || ''
    };
  
    console.log('Sending payload:', payload);
  
    // Send the request
    this.http
      .post('http://localhost:5000/api/transfers/initiateTransfer', payload, { withCredentials: true })
      .subscribe({
        next: () => {
          alert('Transfer initiated successfully!');
          this.router.navigate(['/transfer_management']);
          this.resetForm();
        },
        error: (error) => {
          console.error('Error initiating transfer:', error);
          alert('Failed to initiate transfer. Please fix the errors and try again.');
        }
      });
  }
  
  resetForm(): void {
    this.transfer = {
      sourceBranch: '',
      destinationBranch: '',
      mediaItem: '',
      quantity: 1,
      reason: '',
      errors: {
        sourceBranch: '',
        destinationBranch: '',
        mediaItem: '',
        quantity: '',
        quantityAvailability: ''
      }
    };
  }

  fetchMediaForSourceBranch(): void {
    if (!this.transfer.sourceBranch) return; // Ensure source branch is selected
  
    this.http
      .get<any[]>(`http://localhost:5000/api/transfers/getAvailableMedia/${this.transfer.sourceBranch}`)
      .subscribe({
        next: (data) => {
          this.availableMedia = data; // Populate available media
          console.log('Available media:', this.availableMedia);
  
          // Clear previous error if source branch changes
          this.transfer.errors.quantityAvailability = '';
        },
        error: (error) => {
          console.error('Error fetching media for branch:', error);
          this.availableMedia = [];
          alert('Failed to fetch media items for the selected branch.');
        },
      });
  }

  validateQuantity(): void {
    // Reset the error first
    this.transfer.errors.quantityAvailability = '';
  
    const selectedMedia = this.availableMedia.find(
      (media) => media.media_id === this.transfer.mediaItem
    );
  
    if (selectedMedia) {
      if (this.transfer.quantity > selectedMedia.available_copies) {
        this.transfer.errors.quantityAvailability = `Only ${selectedMedia.available_copies} copies are available in the source branch.`;
      }
    }
  }
  
  
}