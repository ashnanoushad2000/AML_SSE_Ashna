// registration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegistrationData {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    email: string;
    address: string;
    post_code: string;  // Changed to match backend expectation
    password: string;
  }

@Injectable({
    providedIn: 'root'
  })
  export class RegistrationService {
    private readonly BASE_URL = 'http://localhost:5000/api/auth';
  
    constructor(private http: HttpClient) { }
  
    register(userData: RegistrationData): Observable<any> {
      console.log('Registration service sending data:', userData);
      return this.http.post(`${this.BASE_URL}/register`, userData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        withCredentials: true
      });
    }
  }