import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import { FooterStaffComponent } from '../footer-staff/footer-staff.component';
import { MediaAdditionMethodComponent } from '../media-addition-method/media-addition-method.component';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, HttpClientModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
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
          this.authService.login(response.access_token, 'ADMIN');
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user_type', response.user_type);
          localStorage.setItem('user_id', response.user_id.toString());
          if (response.first_name) {
            localStorage.setItem('first_Name', response.first_name);
          }
          
          if (response.user_type === 'LIBRARIAN' || response.user_type === 'MEMBER') {
            this.error = 'Invalid email or password';
            localStorage.clear();
            return;
          }
  
          this.successMessage = 'Login successful';
  
          setTimeout(() => {
            this.router.navigate(['/admin_homepage']);
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
