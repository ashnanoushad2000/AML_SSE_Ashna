import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterAdminComponent } from "../footer-admin/footer-admin.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inventory-management',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule, FormsModule, FooterAdminComponent],
  templateUrl: './inventory-management.component.html',
  styleUrl: './inventory-management.component.css'
})
export class InventoryManagementComponent {
  mediaList = [
    { id: 1, name: 'Media 1' },
    { id: 2, name: 'Media 2' },
    { id: 3, name: 'Media 3' },
    { id: 4, name: 'Media 4' },
    { id: 5, name: 'Media 5' },
    { id: 6, name: 'Media 6' },
  ];
  filteredMediaList = this.mediaList;
  searchQuery: string = '';
  constructor(private router: Router, private authService: AuthService) {}

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

  goBack(): string{
    if (this.authService.getRole() === 'STAFF'){
      return "/staff_homepage"
    }
    else if (this.authService.getRole() === 'ADMIN'){
      this.router.navigate(['/admin_homepage'])
      return "/admin_homepage"
    }
    else{
      return "/admin_homepage"
    }
  }
}
