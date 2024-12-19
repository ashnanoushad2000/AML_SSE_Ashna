import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
  address?: string;
  post_code?: string;
  phone?: string;
}

interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

interface PasswordValidationResult {
  isValid: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  validatePassword(password: string): PasswordValidationResult {
    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }
    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, error: 'Password must include lowercase letters' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, error: 'Password must include uppercase letters' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, error: 'Password must include numbers' };
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return { isValid: false, error: 'Password must include at least one special character (@$!%*?&)' };
    }
    return { isValid: true };
  }

  getUserProfile(): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.get(`${this.apiUrl}/profile/${userId}`, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching profile:', error);
        return throwError(() => error);
      })
    );
  }

  updateProfile(data: ProfileUpdateData): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.put(`${this.apiUrl}/profile/${userId}`, data, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating profile:', error);
        return throwError(() => error);
      })
    );
  }

  changePassword(data: PasswordChangeData): Observable<any> {
    const userId = this.authService.getUserId();
    const validation = this.validatePassword(data.new_password);
    
    if (!validation.isValid) {
      return throwError(() => new Error(validation.error));
    }

    return this.http.put(`${this.apiUrl}/profile/${userId}/password`, data, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return throwError(() => new Error('Current password is incorrect'));
        }
        return throwError(() => error);
      })
    );
  }
}