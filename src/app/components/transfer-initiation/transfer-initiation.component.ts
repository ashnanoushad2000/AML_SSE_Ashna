import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-transfer-initiation',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './transfer-initiation.component.html',
  styleUrl: './transfer-initiation.component.css'
})
export class TransferInitiationComponent {
  transfer = {
    sourceBranch: '',
    destinationBranch: '',
    mediaItem: '',
    quantity: 1,
    reason: ''
  };

  initiateTransfer() {
    console.log('Transfer initiated:', this.transfer);
  }
}
