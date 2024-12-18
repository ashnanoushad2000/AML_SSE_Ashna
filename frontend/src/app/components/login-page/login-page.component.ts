import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, HttpClientModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
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
    private router: Router,
    private authService: AuthService
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
      password: this.password,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post('http://localhost:5000/api/auth/login', payload, {
      headers,
      withCredentials: true,
    }).subscribe({
      next: (response: any) => {
        console.log('Login response:', response);
        this.isLoading = false;
        if (response.access_token) {
          // Use the full login call
          this.authService.login(
            response.access_token, 
            'MEMBER',
            response.user_id
          );

          localStorage.setItem('user_type', response.user_type);
          localStorage.setItem('user_id', response.user_id.toString());
          if (response.first_name) {
            localStorage.setItem('first_name', response.first_name);
          }

          this.successMessage = 'Login successful';

          setTimeout(() => {
            // Redirect based on user type
            switch (response.user_type) {
              case 'ADMIN':
                this.router.navigate(['/admin_homepage']);
                break;
              case 'LIBRARIAN':
                this.router.navigate(['/staff_homepage']);
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
        this.error = error.error?.message || 'Login failed. Please try again.';
      },
    });
  }
}