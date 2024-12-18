import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  access_token: string;
  user_type: string;
  user_id: string;
  first_name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_TYPE_KEY = 'userType';
  private readonly USER_ID_KEY = 'userId';
  private readonly API_URL = 'http://localhost:5000/api/auth';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  loginWithCredentials(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, {
      email,
      password
    }, {
      withCredentials: true
    }).pipe(
      tap(response => {
        console.log('Auth response:', response);
        if (response.access_token) {
          this.login(response.access_token, response.user_type, response.user_id);
        }
      })
    );
  }

  login(token: string, userType: string, userId: string): void {
    console.log('AuthService: Logging in.', {
      tokenPreview: token.substring(0, 20) + '...',
      userType,
      userId
    });
    
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_TYPE_KEY, userType);
    localStorage.setItem(this.USER_ID_KEY, userId);
    
    // Verify storage
    console.log('AuthService: Stored values:', {
      token: this.getToken()?.substring(0, 20) + '...',
      userType: this.getRole(),
      userId: this.getUserId()
    });
  }

  logout(): void {
    console.log('AuthService: Logging out. Clearing storage.');
    localStorage.clear();
    this.http.post(`${this.API_URL}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  logoutStaff(): void {
    console.log('AuthService: Logging out staff. Clearing storage.');
    localStorage.clear();
    this.http.post(`${this.API_URL}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        this.router.navigate(['/staff']);
      });
  }

  logoutAdmin(): void {
    console.log('AuthService: Logging out admin. Clearing storage.');
    localStorage.clear();
    this.http.post(`${this.API_URL}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        this.router.navigate(['/admin']);
      });
  }

  isLoggedIn(): boolean {
    const tokenExists = !!localStorage.getItem(this.TOKEN_KEY);
    console.log('AuthService: Checking login status. Token exists:', tokenExists);
    return tokenExists;
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    console.log('AuthService: Retrieved token:', token ? token.substring(0, 20) + '...' : 'null');
    return token;
  }

  getRole(): string | null {
    const role = localStorage.getItem(this.USER_TYPE_KEY);
    console.log('AuthService: Retrieved role:', role);
    return role;
  }

  getUserId(): string | null {
    const userId = localStorage.getItem(this.USER_ID_KEY);
    console.log('AuthService: Retrieved user ID:', userId);
    return userId;
  }
}