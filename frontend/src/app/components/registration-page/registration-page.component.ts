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
    post_code: '',
    password: ''
  };
  
  confirmPassword: string = '';
  registrationError: string = '';
  fieldErrors: { [key: string]: string } = {};
  passwordError: string = '';
  showSuccessPopup: boolean = false;

  constructor(
    private registrationService: RegistrationService,
    private router: Router
  ) {}

  validateField(field: string, value: string): string {
    switch (field) {
      case 'first_name':
      case 'last_name':
        if (!value.trim()) return 'This field is required';
        if (value.length < 2) return 'Must be at least 2 characters';
        if (!/^[a-zA-Z\s-']+$/.test(value)) return 'Only letters, spaces, hyphens and apostrophes allowed';
        break;
      
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        break;
      
      case 'date_of_birth':
        if (!value) return 'Date of birth is required';
        const dob = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 13) return 'Must be at least 13 years old';
        if (age > 120) return 'Invalid date of birth';
        break;
      
      case 'address':
        if (!value.trim()) return 'Address is required';
        if (value.length < 5) return 'Please enter a valid address';
        break;
      
      case 'post_code':
        if (!value.trim()) return 'Postal code is required';
        if (!/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(value.trim())) 
          return 'Invalid postal code format';
        break;
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])/.test(value)) return 'Password must include lowercase letters';
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must include uppercase letters';
        if (!/(?=.*\d)/.test(value)) return 'Password must include numbers';
        break;
    }
    return '';
  }

  validatePasswordMatch(): void {
    if (!this.confirmPassword) {
      this.passwordError = 'Please confirm your password';
    } else if (this.formData.password !== this.confirmPassword) {
      this.passwordError = 'Passwords do not match';
    } else {
      this.passwordError = '';
    }
  }

  onPasswordChange(): void {
    this.fieldErrors['password'] = this.validateField('password', this.formData.password);
    if (this.confirmPassword) {
      this.validatePasswordMatch();
    }
  }

  onConfirmPasswordChange(): void {
    this.validatePasswordMatch();
  }

  validateForm(): boolean {
    this.fieldErrors = {};
    let isValid = true;

    // Validate each field
    Object.keys(this.formData).forEach(field => {
      const error = this.validateField(field, this.formData[field as keyof typeof this.formData]);
      if (error) {
        this.fieldErrors[field] = error;
        isValid = false;
      }
    });

    // Validate password match
    this.validatePasswordMatch();
    if (this.passwordError) {
      isValid = false;
    }

    return isValid;
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.registrationError = '';
    
    if (!this.validateForm()) {
      this.registrationError = 'Please correct the errors before submitting';
      return;
    }

    this.submitRegistration();
  }

  onFieldChange(field: string, value: string) {
    if (field in this.formData) {
      this.fieldErrors[field] = this.validateField(field, value);
    }
  }

  private submitRegistration(): void {
    console.log('Submitting registration:', this.formData);
    this.registrationService.register({
      ...this.formData,
      date_of_birth: new Date(this.formData.date_of_birth).toISOString().split('T')[0],
      post_code: this.formData.post_code.toUpperCase().replace(/\s+/g, ' ').trim()
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