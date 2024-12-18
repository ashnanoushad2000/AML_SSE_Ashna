import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FooterComponent],
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.css']
})
export class ProfileManagementComponent implements OnInit {
  profileData = {
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    post_code: '',
    phone: ''
  };

  passwordData = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  };

  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  passwordError: string = '';
  passwordSuccess: string = '';

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.profileService.getUserProfile().subscribe({
      next: (data) => {
        this.profileData = { ...data };
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status === 401) {
          this.authService.logout();
          return;
        }
        this.errorMessage = error.error?.message || 'Error loading profile';
        this.isLoading = false;
      }
    });
  }

  updateProfile() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData = {
      address: this.profileData.address,
      post_code: this.profileData.post_code,
      phone: this.profileData.phone
    };

    this.profileService.updateProfile(updateData).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully';
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status === 401) {
          this.authService.logout();
          return;
        }
        this.errorMessage = error.error?.message || 'Error updating profile';
        this.isLoading = false;
      }
    });
  }

  validatePassword(): boolean {
    this.passwordError = '';
    this.passwordSuccess = '';

    if (!this.passwordData.current_password || 
        !this.passwordData.new_password || 
        !this.passwordData.confirm_password) {
      this.passwordError = "All password fields are required";
      return false;
    }

    if (this.passwordData.new_password !== this.passwordData.confirm_password) {
      this.passwordError = "New passwords do not match";
      return false;
    }

    const validation = this.profileService.validatePassword(this.passwordData.new_password);
    if (!validation.isValid) {
      this.passwordError = validation.error || "Invalid password";
      return false;
    }

    if (this.passwordData.new_password === this.passwordData.current_password) {
      this.passwordError = "New password must be different from current password";
      return false;
    }

    return true;
  }

  changePassword() {
    this.passwordError = '';
    this.passwordSuccess = '';
    this.successMessage = '';

    if (!this.validatePassword()) {
      return;
    }

    this.isLoading = true;

    const token = this.authService.getToken();
    if (!token) {
      this.authService.logout();
      return;
    }

    this.profileService.changePassword({
      current_password: this.passwordData.current_password,
      new_password: this.passwordData.new_password
    }).subscribe({
      next: () => {
        this.passwordSuccess = 'Password changed successfully!';
        this.successMessage = 'Password changed successfully!';
        // Clear password fields
        this.passwordData = {
          current_password: '',
          new_password: '',
          confirm_password: ''
        };
        this.isLoading = false;

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.passwordSuccess = '';
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        if (error.status === 401) {
          this.passwordError = 'Current password is incorrect';
        } else {
          this.passwordError = error.message || 'Error changing password';
        }
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}