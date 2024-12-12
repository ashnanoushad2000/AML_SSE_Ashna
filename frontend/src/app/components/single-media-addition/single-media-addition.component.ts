import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-single-media-addition',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, HeaderComponent],
  templateUrl: './single-media-addition.component.html',
  styleUrls: ['./single-media-addition.component.css']
})
export class SingleMediaAdditionComponent implements OnInit {
  @ViewChild('mediaForm') mediaForm!: NgForm;

  media: any = {
    title: '',
    author: '',
    isbn: '',
    categoryId: '',
    publicationDate: '',
    publisher: '',
    item_description: ''
  };

  categories: any[] = [];
  feedbackMessage: string = '';
  feedbackClass: string = '';
  isbnError: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.http.get('http://localhost:5000/api/media/categories').subscribe({
      next: (response: any) => {
        this.categories = response;
      },
      error: () => {
        this.feedbackMessage = 'Unable to load categories. Try again later.';
        this.feedbackClass = 'feedback-error';
      }
    });
  }

  validateISBN(): boolean {
    // Regex to match ISBN format: 10-17 characters, only digits and hyphens
    const isbnRegex = /^[0-9-]{10,17}$/;
    
    if (!this.media.isbn) {
      this.isbnError = 'ISBN is required.';
      return false;
    }

    if (!isbnRegex.test(this.media.isbn)) {
      this.isbnError = 'ISBN must be 10-17 characters long and contain only digits and hyphens.';
      return false;
    }

    this.isbnError = '';
    return true;
  }

  onSubmit(): void {
    // Reset previous error states
    this.feedbackMessage = '';
    this.feedbackClass = '';
    this.isbnError = '';

    // Validate ISBN first
    if (!this.validateISBN()) {
      return;
    }

    // Check if other required fields are filled
    if (!this.media.title || !this.media.author || !this.media.categoryId || 
        !this.media.publicationDate || !this.media.publisher) {
      // Do not set feedback message
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:5000/api/media/add', this.media, {
      headers,
      withCredentials: true
    }).subscribe({
      next: () => {
        this.feedbackMessage = 'Media added successfully!';
        this.feedbackClass = 'feedback-success';
        
        // Reset form completely
        this.media = {
          title: '',
          author: '',
          isbn: '',
          categoryId: '',
          publicationDate: '',
          publisher: '',
          item_description: ''
        };

        // Reset form validation state
        if (this.mediaForm) {
          this.mediaForm.resetForm();
        }
      },
      error: () => {
        this.feedbackMessage = 'An error occurred. Please try again later.';
        this.feedbackClass = 'feedback-error';
      }
    });
  }

  goBack() {
    this.router.navigate(['/staff_homepage']);
  }
}