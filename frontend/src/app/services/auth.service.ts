import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_TYPE_KEY = 'userType';

  constructor(private router: Router) {}

  login(token: string, userType: string): void {
    console.log('AuthService: Logging in. Token saved:', token, 'User type:', userType);
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_TYPE_KEY, userType);
  }

  logout(): void {
    console.log('AuthService: Logging out. Clearing token and user type.');
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_TYPE_KEY);
    this.router.navigate(['/']);
  }

  logoutStaff(): void {
    console.log('AuthService: Logging out. Clearing token and user type.');
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_TYPE_KEY);
    this.router.navigate(['/staff']);
  }

  logoutAdmin(): void {
    console.log('AuthService: Logging out. Clearing token and user type.');
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_TYPE_KEY);
    this.router.navigate(['/admin']);
  }

  isLoggedIn(): boolean {
    const tokenExists = !!localStorage.getItem(this.TOKEN_KEY);
    console.log('AuthService: Checking login status. Token exists:', tokenExists);
    return tokenExists;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRole(): string | null {
    const role = localStorage.getItem(this.USER_TYPE_KEY);
    console.log('AuthService: Retrieved role from localStorage:', role);
    return role;
  }
}
