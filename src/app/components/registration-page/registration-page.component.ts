import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.css'
})
export class RegistrationPageComponent {
  password: string = '';
  confirmPassword: string = '';
  passwordStrength: string = '';
  passwordError: string = '';

  checkPasswordStrength() {
    if (this.password.length > 8 && /[A-Z]/.test(this.password) && /\d/.test(this.password)) {
      this.passwordStrength = "Strong";
    } else if (this.password.length > 5) {
      this.passwordStrength = "Medium";
    } else {
      this.passwordStrength = "Weak";
    }
  }

  validatePasswords() {
    if (this.confirmPassword && this.password !== this.confirmPassword) {
      this.passwordError = "Passwords do not match";
      console.log('lala')
    } else {
      this.passwordError = "";
    }
  }

  validateForm(event: Event) {
    if (this.passwordError) {
      alert("Please fix errors before submitting.");
      event.preventDefault();
    }
  }

  getPasswordStrengthColor(): string {
    switch (this.passwordStrength) {
      case 'Strong': return 'green';
      case 'Medium': return 'orange';
      default: return 'red';
    }
  }


}
