import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faCog, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-transfer-management',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, HeaderComponent, FormsModule, RouterModule],
  templateUrl: './transfer-management.component.html',
  styleUrl: './transfer-management.component.css'
})
export class TransferManagementComponent {
  faArrowRight = faArrowRight;
  searchQuery = '';
  transfers = [
    { id: 1, source: 'Source 1', destination: 'Destination 1', date: new Date('2023-11-20') },
    { id: 2, source: 'Source 2', destination: 'Destination 2', date: new Date('2024-12-01') },
    { id: 3, source: 'Source 3', destination: 'Destination 3', date: new Date('2023-08-11') }
  ];
  filteredTransfers = this.transfers;

  filterTransfers(): void {
    this.filteredTransfers = this.transfers.filter(transfer =>
      `${transfer.source} ${transfer.destination}`.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  viewDetails(transfer): void {
    alert(`Viewing details for: ${transfer.source} to ${transfer.destination}`);
  }
}
