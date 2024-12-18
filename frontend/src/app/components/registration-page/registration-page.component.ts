// registration-page.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, HttpClientModule],
  providers: [RegistrationService],
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent {
  formData = {
    first_name: '',
    last_name: '',
    date_of_birth: '',
    email: '',
    address: '',
    post_code: '',  // Changed to post_code to match backend expectation
    password: ''
  };
  
  confirmPassword: string = '';
  registrationError: string = '';
  passwordError: string = '';
  showSuccessPopup: boolean = false;

  constructor(
    private registrationService: RegistrationService,
    private router: Router
  ) {}

  handleSubmit(event: Event): void {
    event.preventDefault();
    console.log('Form submitted', this.formData);
    this.registrationError = '';
    this.passwordError = '';

    // Validate passwords
    if (!this.formData.password || !this.confirmPassword) {
      this.passwordError = "Both password fields are required";
      return;
    }

    if (this.formData.password !== this.confirmPassword) {
      this.passwordError = "Passwords do not match";
      return;
    }

    // Check all required fields
    const requiredFields = ['first_name', 'last_name', 'date_of_birth', 'email', 'address', 'post_code', 'password'];
    for (const field of requiredFields) {
      if (!this.formData[field as keyof typeof this.formData]) {
        this.registrationError = 'All fields are required';
        return;
      }
    }

    this.submitRegistration();
  }

  private submitRegistration(): void {
    console.log('Submitting registration:', this.formData);
    this.registrationService.register({
      ...this.formData,
      date_of_birth: new Date(this.formData.date_of_birth).toISOString().split('T')[0]
    })
    .subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.showSuccessPopup = true;
        setTimeout(() => {
          this.showSuccessPopup = false;
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        if (error.error?.message) {
          this.registrationError = error.error.message;
        } else if (error.error && typeof error.error === 'string') {
          this.registrationError = error.error;
        } else {
          this.registrationError = 'Registration failed. Please try again.';
        }
      }
    });
  }
}