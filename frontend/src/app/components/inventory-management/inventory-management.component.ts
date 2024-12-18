import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterAdminComponent } from "../footer-admin/footer-admin.component";
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-inventory-management',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule, FormsModule, FooterAdminComponent],
  templateUrl: './inventory-management.component.html',
  styleUrl: './inventory-management.component.css'
})
export class InventoryManagementComponent implements OnInit {
  mediaItems: any[] = [];
  filteredMediaItems: any[] = [];
  searchQuery: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadMediaItems();
  }

  loadMediaItems(): void {
    this.http.get('http://localhost:5000/api/media/all').subscribe({
      next: (response: any) => {
        this.mediaItems = response; // Assign the fetched media items
        this.filteredMediaItems = [...this.mediaItems]; // Initialize filtered list
      },
      error: () => {
        alert('Failed to load media items. Please try again later.');
      }
    });
  }

  filterMedia(): void {
    const query = this.searchQuery.toLowerCase();
  
    this.filteredMediaItems = this.mediaItems.filter((item) =>
      (
        `${item.title} ${item.author} ${item.isbn}`
      )
        .toLowerCase()
        .includes(query)
    );
  }

  editMedia(mediaId: string): void {
    this.router.navigate(['/edit_media', mediaId]); // Pass mediaId as a route parameter
  }

  deleteMedia(mediaId: string): void {
    if (confirm(`Are you sure you want to delete media ID ${mediaId}?`)) {
      this.http.delete(`http://localhost:5000/api/media/delete/${mediaId}`).subscribe({
        next: () => {
          this.mediaItems = this.mediaItems.filter(item => item.media_id !== mediaId);
          this.filteredMediaItems = [...this.mediaItems]; // Update filtered list
          alert(`Media ID ${mediaId} deleted successfully.`);
        },
        error: () => {
          alert('Failed to delete media. Please try again later.');
        }
      });
    }
  }

  goBack(): string {
    if (this.authService.getRole() === 'STAFF') {
      return "/staff_homepage";
    } else if (this.authService.getRole() === 'ADMIN') {
      return "/staff_homepage";
    } else {
      return "/admin_homepage";
    }
  }
}
