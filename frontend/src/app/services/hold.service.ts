import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Hold {
  hold_id: string;
  media_id: string;
  request_date: string;
  status: 'PENDING' | 'READY' | 'CANCELLED' | 'FULFILLED';
  notification_sent: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HoldService {
  private apiUrl = 'http://localhost:5000/api/holds';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    console.log('HoldService initialized');
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('HoldService: Getting headers with token:', token ? token.substring(0, 20) + '...' : 'no token');
    if (!token) {
      console.error('HoldService: No token found in localStorage');
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUserHolds(userId: string): Observable<Hold[]> {
    const url = `${this.apiUrl}/user/${userId}`;
    console.log('HoldService: Fetching holds:', {
      url,
      userId,
      headers: {
        Authorization: this.getHeaders().get('Authorization'),
        ContentType: this.getHeaders().get('Content-Type')
      }
    });
    
    return this.http.get<Hold[]>(url, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      tap(holds => {
        console.log('HoldService: Received holds:', holds);
        if (!holds || holds.length === 0) {
          console.log('HoldService: No holds found');
        } else {
          console.log(`HoldService: Found ${holds.length} holds`);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('HoldService: Error details:', {
          status: error.status,
          message: error.message,
          error: error.error,
          url: error.url
        });
        if (error.status === 401) {
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}