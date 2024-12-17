import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { LoanService } from '../../services/loan.service';
import { HoldService } from '../../services/hold.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

interface UserResponse {
  first_name?: string;
  user_type?: string;
  user_id?: string;
  email?: string;
  cookie_config?: any;
  created_at?: string;
  is_permanent?: boolean;
  last_activity?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    FooterComponent, 
    FontAwesomeModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    LoanService,
    HoldService
  ],
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
  activeLoans: number = 0;
  pendingHolds: number = 0;
  userId: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private loanService: LoanService,
    private holdService: HoldService
  ) {
    console.log('HomeComponent: Constructor initialized');
  }

  ngOnInit() {
    console.log('HomeComponent: ngOnInit started');
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('HomeComponent: No token found, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    console.log('HomeComponent: Checking session with token:', token.substring(0, 20) + '...');
    this.checkSessionAndFetchData(token);
  }

  private checkSessionAndFetchData(token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('HomeComponent: Making session check request');
    this.http.get<UserResponse>('http://localhost:5000/api/auth/session-check', {
      headers,
      withCredentials: true
    }).subscribe({
      next: (response) => {
        console.log('HomeComponent: Session check successful:', response);
        if (response && response.email) {  // Using email as it seems to be present in the response
          this.handleSessionResponse(response);
        } else {
          console.error('HomeComponent: Invalid session response structure:', response);
        }
      },
      error: (error) => {
        console.error('HomeComponent: Session check failed:', error);
        if (error.status === 401) {
          console.warn('HomeComponent: Unauthorized, clearing storage');
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  private handleSessionResponse(response: UserResponse) {
    console.log('HomeComponent: Handling session response:', response);
    
    // Extract user ID - you might need to adjust this based on your actual response structure
    const userId = response.user_id || response.email;  // Using email as fallback
    if (!userId) {
      console.error('HomeComponent: No user identifier in session response');
      return;
    }

    console.log('HomeComponent: Setting user data from session');
    // Set username - adjust this based on your actual response structure
    this.userName = response.first_name || response.email.split('@')[0] || 'User';
    this.userId = userId;
    
    console.log('HomeComponent: Initiating data fetch for user:', this.userId);
    this.fetchUserData();
  }

  private fetchUserData() {
    if (!this.userId) {
      console.error('HomeComponent: Cannot fetch data - no user ID');
      return;
    }

    console.log('HomeComponent: Starting loan fetch');
    this.loanService.getUserActiveLoans(this.userId)
      .pipe(
        catchError(error => {
          console.error('HomeComponent: Loan fetch error:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (loans) => {
          console.log('HomeComponent: Loans received:', loans);
          this.activeLoans = loans.length;
        },
        error: (error) => console.error('HomeComponent: Loan subscription error:', error),
        complete: () => console.log('HomeComponent: Loan fetch complete')
      });

    console.log('HomeComponent: Starting holds fetch');
    this.holdService.getUserHolds(this.userId)
      .pipe(
        catchError(error => {
          console.error('HomeComponent: Holds fetch error:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (holds) => {
          console.log('HomeComponent: Holds received:', holds);
          this.pendingHolds = holds.filter(hold => hold.status === 'PENDING').length;
        },
        error: (error) => console.error('HomeComponent: Holds subscription error:', error),
        complete: () => console.log('HomeComponent: Holds fetch complete')
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

  closeNotification() {
    this.showNotification = false;
  }

  profileAlert() {
    alert("This icon opens profile settings");
  }

  logout(): void {
    this.authService.logout();
  }
}