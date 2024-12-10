import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-single-media-addition',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './single-media-addition.component.html',
  styleUrls: ['./single-media-addition.component.css']
})
export class SingleMediaAdditionComponent implements OnInit {
  media: any = {
    title: '',
    author: '',
    isbn: '',
    categoryId: '',
    publicationDate: '',
    publisher: '',
    description: ''
  };

  categories: any[] = [];
  error: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.http.get('http://localhost:5000/api/media/categories').subscribe({
      next: (response: any) => {
        this.categories = response;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.error = 'Unable to load categories.';
      }
    });
  }

  onSubmit(): void {
    this.error = '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:5000/api/media/', this.media, { headers }).subscribe({
      next: (response: any) => {
        this.successMessage = 'Media item added successfully!';
        setTimeout(() => this.router.navigate(['/media-list']), 2000);
      },
      error: (error) => {
        console.error('Error adding media:', error);
        this.error = error.error.message || 'Unable to add media. Please try again.';
      }
    });
  }
}
