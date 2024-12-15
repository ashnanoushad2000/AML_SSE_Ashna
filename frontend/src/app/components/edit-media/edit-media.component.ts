import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-media',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-media.component.html',
  styleUrls: ['./edit-media.component.css'],
})
export class EditMediaComponent implements OnInit {
  mediaId: string | null = null;
  mediaDetails: any = {
    title: '',
    author: '',
    isbn: '',
    categoryId: '',
    publicationDate: '',
    publisher: '',
    item_description: '',
  };
  categories: any[] = [];
  feedbackMessage: string = '';
  feedbackClass: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mediaId = this.route.snapshot.paramMap.get('mediaId');
    if (this.mediaId) {
      this.loadMediaDetails();
      this.loadCategories();
    } else {
      this.feedbackMessage = 'Invalid media ID.';
      this.feedbackClass = 'feedback-error';
    }
  }

  loadMediaDetails(): void {
    this.http.get(`http://localhost:5000/api/media/${this.mediaId}`).subscribe({
      next: (response: any) => {
        console.log('Media Details from Backend:', response); // Debug log
        this.mediaDetails = {
          ...this.mediaDetails, // Keep other default values
          title: response.title,
          author: response.author,
          isbn: response.isbn,
          categoryId: response.category_id, // Map the correct backend field
          publicationDate: response.publication_date,
          publisher: response.publisher,
          item_description: response.item_description,
        };
  
        console.log('Mapped Media Details:', this.mediaDetails); // Verify mapping
      },
      error: (err) => {
        console.error('Error loading media details:', err.error.message || err.message || err);
        this.feedbackMessage = 'Failed to load media details. Please try again later.';
        this.feedbackClass = 'feedback-error';
      },
    });
  }
  
  

  loadCategories(): void {
    this.http.get('http://localhost:5000/api/media/categories').subscribe({
      next: (response: any) => {
        this.categories = response;
      },
      error: (err) => {
        console.error('Error loading categories:', err.error.message || err.message || err);
        this.feedbackMessage = 'Unable to load categories. Try again later.';
        this.feedbackClass = 'feedback-error';
      },
    });
  }
  

  onSubmit(): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put(`http://localhost:5000/api/media/update/${this.mediaId}`, this.mediaDetails, {
        headers,
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          this.feedbackMessage = 'Media updated successfully!';
          this.feedbackClass = 'feedback-success';
          setTimeout(() => this.router.navigate(['/inventory_management']), 1500);
        },
        error: () => {
          this.feedbackMessage = 'An error occurred while updating media. Please try again.';
          this.feedbackClass = 'feedback-error';
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/inventory_management']);
  }
}
