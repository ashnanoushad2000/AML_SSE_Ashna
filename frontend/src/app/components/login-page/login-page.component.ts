import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, HttpClientModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
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

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

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

    this.http.post('http://localhost:5000/api/auth/login', payload, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Login response:', response);
          this.isLoading = false;
          if (response.access_token) {
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user_type', response.user_type);
            localStorage.setItem('user_id', response.user_id.toString());
            if (response.full_name) {
              localStorage.setItem('fullName', response.full_name);
            }
            
            this.successMessage = 'Login successful';
            
            setTimeout(() => {
              switch (response.user_type) {
                case 'ADMIN':
                  this.router.navigate(['/admin-homepage']);
                  break;
                case 'LIBRARIAN':
                  this.router.navigate(['/staff-homepage']);
                  break;
                default:
                  this.router.navigate(['/home']);
              }
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