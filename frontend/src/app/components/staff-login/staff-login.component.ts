import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-staff-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, HttpClientModule],
  templateUrl: './staff-login.component.html',
  styleUrl: './staff-login.component.css'
})
export class StaffLoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  error: string = '';
  successMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password';
      return;
    }
  
    this.isLoading = true;
    this.error = '';
    this.successMessage = '';
  
    const payload = {
      email: this.email,
      password: this.password
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    this.http.post('http://localhost:5000/api/auth/login', payload, { 
      headers, 
      withCredentials: true 
    }).subscribe({
      next: (response: any) => {
        console.log('Login response:', response);
        this.isLoading = false;
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user_type', response.user_type);
          localStorage.setItem('user_id', response.user_id.toString());
          if (response.first_name) {
            localStorage.setItem('first_Name', response.first_name);
          }
          
          if (response.user_type === 'ADMIN' || response.user_type === 'MEMBER') {
            this.error = 'Invalid email or password';
            localStorage.clear();
            return;
          }
  
          this.successMessage = 'Login successful';
  
          setTimeout(() => {
            this.router.navigate(['/staff_homepage']);
          }, 1500);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.isLoading = false;
        this.error = error.error.message || 'Login failed. Please try again.';
      }
    });
  }  
}
