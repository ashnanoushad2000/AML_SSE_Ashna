import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { HoldService, Hold } from '../../services/hold.service';
import { AuthService } from '../../services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface DisplayBook {
  id: string;
  title: string;
  status: string;
  holdDate: string;
}

@Component({
  selector: 'app-holds',
  standalone: true,
  imports: [
    CommonModule, 
    FooterComponent,
    RouterModule
  ],
  providers: [HoldService, AuthService],
  templateUrl: './holds.component.html',
  styleUrls: ['./holds.component.css']
})
export class HoldsComponent implements OnInit {
  books: DisplayBook[] = [];
  private userId: string | null = null;

  constructor(
    private router: Router,
    private holdService: HoldService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('HoldsComponent: Initializing');
    
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      console.error('HoldsComponent: User not logged in');
      this.router.navigate(['/']);
      return;
    }

    this.userId = this.authService.getUserId();
    console.log('HoldsComponent: Retrieved user ID:', this.userId);
    
    if (this.userId) {
      this.fetchHolds();
    } else {
      console.warn('HoldsComponent: No user ID found, but user is logged in');
    }
  }

  private fetchHolds() {
    if (!this.userId) return;

    console.log('HoldsComponent: Fetching holds for user:', this.userId);
    this.holdService.getUserHolds(this.userId)
      .pipe(
        catchError(error => {
          console.error('HoldsComponent: Error fetching holds:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (holds: Hold[]) => {
          console.log('HoldsComponent: Holds received:', holds);
          this.books = holds.map(hold => ({
            id: hold.hold_id,
            title: `Hold #${hold.hold_id.slice(0, 8)}`,
            status: this.getStatusDisplay(hold.status),
            holdDate: new Date(hold.request_date).toLocaleDateString()
          }));
        },
        error: (error) => {
          console.error('HoldsComponent: Error processing holds:', error);
        }
      });
  }

  private getStatusDisplay(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'On Hold',
      'READY': 'Available',
      'CANCELLED': 'Cancelled',
      'FULFILLED': 'Fulfilled'
    };
    return statusMap[status] || status;
  }

  goBack() {
    console.log('Navigating back to home');
    this.router.navigate(['/home']);
  }

  bookDetails() {
    alert("This will show book details");
  }
}