// 
// 

// 


import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  isMenuOpen: boolean = false;
  isLoading: boolean = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.username && this.password) {
      this.isLoading = true;
      // Simulate API call
      setTimeout(() => {
        console.log('Login attempt', this.username);
        this.isLoading = false;
        // Add your actual login logic here
      }, 1500);
    }
  }
}