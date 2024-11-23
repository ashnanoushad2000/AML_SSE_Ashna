import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent, FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showNotification = false;
  hasNewNotification = false;
  notificationMessage = 'No new notifications';
  faCircle = faCircle;
    faUser = faUser

  constructor(private router: Router) {}

  navigateToHolds() {
    this.router.navigate(['/holds']);
  }

  showBookNotification() {
    this.showNotification = true;
    this.hasNewNotification = true;
    this.notificationMessage = 'New book added to your upcoming list!';
    
    // Show notification banner
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);

    // Update notification card
    setTimeout(() => {
      this.hasNewNotification = false;
    }, 5000);
  }

  clearNotification() {
    this.showNotification = false;
    this.hasNewNotification = false;
  }

  // Optional: Add method to handle notification card click
  onNotificationClick() {
    if (this.hasNewNotification) {
      this.hasNewNotification = false;
      // You can add logic here to show notification details
    }
  }

  // Optional: Add method to handle close button click
  closeNotification() {
    this.showNotification = false;
  }

  // Optional: Add method for navigation back home
  goBack() {
    this.router.navigate(['/home']);
  }

  profileAlert(){
    alert("This icon opens profile settings")
  }
}