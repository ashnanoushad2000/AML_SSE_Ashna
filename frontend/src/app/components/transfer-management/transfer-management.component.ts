import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faCog, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FooterAdminComponent } from "../footer-admin/footer-admin.component";
import { HttpClient } from '@angular/common/http';
import { TransferDetailsComponent } from '../transfer-details/transfer-details.component';

@Component({
  selector: 'app-transfer-management',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, HeaderComponent, FormsModule, RouterModule, FooterAdminComponent, TransferDetailsComponent],
  templateUrl: './transfer-management.component.html',
  styleUrl: './transfer-management.component.css'
})
export class TransferManagementComponent {
  faArrowRight = faArrowRight;
  transfers: any[] = [];
  filteredTransfers: any[] = [];
  searchQuery = '';
  selectedTransfer: any = null;
  showDetailsModal = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTransfers();
  }

  // Fetch transfers directly in the component
  loadTransfers(): void {
    this.http.get('http://localhost:5000/api/transfers/getTransfers').subscribe({
      next: (response: any) => {
        console.log('Transfers fetched:', response); // Debugging log
        this.transfers = response;
        this.filteredTransfers = [...this.transfers]; // Initialize filtered list
      },
      error: (error) => {
        console.error('Error fetching transfers:', error);
        alert('Failed to load transfers. Please try again later.');
      },
    });
  }

  // Filter transfers by source or destination branch names
  filterTransfers(): void {
    this.filteredTransfers = this.transfers.filter((transfer) =>
      `${transfer.source_branch_name} ${transfer.destination_branch_name}`
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase())
    );
  }

  // View details of a transfer
  viewDetails(transfer: any): void {
    this.selectedTransfer = transfer;
    this.showDetailsModal = true;
  }
  }
