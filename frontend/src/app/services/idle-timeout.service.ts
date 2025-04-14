import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {
  private readonly timeoutDuration = 15 * 1000; // ✅ 15 seconds for testing
  private idleTimeout: any;

  constructor(private router: Router, private zone: NgZone) {
    this.setupIdleDetection();
  }

  private setupIdleDetection(): void {
    const resetTimeout = () => {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = setTimeout(() => this.logout(), this.timeoutDuration);
    };

    // ✅ Listen to user activity
    ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event =>
      window.addEventListener(event, resetTimeout)
    );

    resetTimeout(); // Start the timer immediately
  }

  private logout(): void {
    console.log('⏰ Logging out after 15 seconds of inactivity');

    // ✅ Remove only login info
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_type');

    // ✅ Set logout reason to show on login screen
    localStorage.setItem('logoutReason', 'timeout');

    // ✅ Redirect to login page
    this.zone.run(() => {
      this.router.navigate(['/login']);
    });
  }
}
