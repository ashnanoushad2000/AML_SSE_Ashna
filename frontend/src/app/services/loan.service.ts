import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Loan {
  loan_id: string;
  media_id: string;
  issue_date: string;
  due_date: string;
  return_date?: string;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
  renewals_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = 'http://localhost:5000/api/loans';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    console.log('LoanService initialized');
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('LoanService: Getting headers with token:', token ? token.substring(0, 20) + '...' : 'no token');
    if (!token) {
      console.error('LoanService: No token found in localStorage');
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUserActiveLoans(userId: string): Observable<Loan[]> {
    const url = `${this.apiUrl}/user/${userId}/active`;
    console.log('LoanService: Fetching active loans:', {
      url,
      userId,
      headers: {
        Authorization: this.getHeaders().get('Authorization'),
        ContentType: this.getHeaders().get('Content-Type')
      }
    });
    
    return this.http.get<Loan[]>(url, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      tap(loans => {
        console.log('LoanService: Received loans:', loans);
        if (!loans || loans.length === 0) {
          console.log('LoanService: No active loans found');
        } else {
          console.log(`LoanService: Found ${loans.length} active loans`);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('LoanService: Error details:', {
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