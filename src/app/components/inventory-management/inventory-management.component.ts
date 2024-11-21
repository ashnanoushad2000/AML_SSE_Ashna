import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory-management',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule, FormsModule],
  templateUrl: './inventory-management.component.html',
  styleUrl: './inventory-management.component.css'
})
export class InventoryManagementComponent {
  mediaList = [
    { id: 1, name: 'Media 1' },
    { id: 2, name: 'Media 2' },
    { id: 3, name: 'Media 3' },
  ];
  filteredMediaList = this.mediaList;
  searchQuery: string = '';
  constructor(private router: Router) {}

  editMedia(mediaId: number): void {
    alert(`This will take you to edit media page`);
  }

  deleteMedia(mediaId: number): void {
    console.log('Deleting media with ID:', mediaId);
    if (confirm(`Are you sure you want to delete media ID ${mediaId}?`)) {
      this.mediaList = this.mediaList.filter(media => media.id !== mediaId);
      alert(`Media ID ${mediaId} deleted successfully.`);
    }
  }

  filterMedia(): void {
    this.filteredMediaList = this.mediaList.filter(media =>
      media.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
