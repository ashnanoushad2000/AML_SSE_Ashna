import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface UserResponse {
  first_name: string;
  user_type: string;
  user_id: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent, FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showNotification = false;
  hasNewNotification = false;
  notificationMessage = 'No new notifications';
  userName: string = '';
  faCircle = faCircle;
  faUser = faUser;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const storedFullName = localStorage.getItem('first_Name');
    if (storedFullName) {
      this.userName = storedFullName.split(' ')[0];
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<UserResponse>('http://localhost:5000/api/auth/session-check', { 
      headers,
      withCredentials: true 
    }).subscribe({
      next: (response) => {
        if (response.first_name) {
          this.userName = response.first_name.split(' ')[0];
          if (response.first_name !== storedFullName) {
            localStorage.setItem('fullName', response.first_name);
          }
        }
      },
      error: (error) => {
        console.error('Token validation error:', error);
        if (error.status === 401) {
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  navigateToHolds() {
    this.router.navigate(['/holds']);
  }

  showBookNotification() {
    this.showNotification = true;
    this.hasNewNotification = true;
    this.notificationMessage = 'New book added to your upcoming list!';
    
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);

    setTimeout(() => {
      this.hasNewNotification = false;
    }, 5000);
  }

  clearNotification() {
    this.showNotification = false;
    this.hasNewNotification = false;
  }

  onNotificationClick() {
    if (this.hasNewNotification) {
      this.hasNewNotification = false;
    }
  }

  closeNotification() {
    this.showNotification = false;
  }

  profileAlert(){
    alert("This icon opens profile settings")
  }

  logout(): void {
    this.authService.logout();
  }
}