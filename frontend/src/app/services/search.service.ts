import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Branch {
  branch_id: string;
  branch_name: string;
}

export interface MediaSearchResult {
  media_id: string;
  title: string;
  author: string;
  isbn: string;
  publication_date: string | null;
  publisher: string;
  item_description: string;
  category: {
    category_id: string;
    category_name: string;
  } | null;
  inventory: {
    total_copies: number;
    available_copies: number;
    branch: Branch | null;
  } | null;
}

export interface SearchResponse {
  results: MediaSearchResult[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly API_URL = 'http://localhost:5000/api/media';

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

  getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.API_URL}/branches`, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      tap(branches => console.log('Fetched branches:', branches)),
      catchError(error => {
        console.error('Error fetching branches:', error);
        return throwError(() => new Error('Failed to load branches'));
      })
    );
  }

  getMediaById(mediaId: string): Observable<MediaSearchResult> {
    return this.http.get<MediaSearchResult>(`${this.API_URL}/${mediaId}`, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      tap(media => console.log('Fetched media details:', media)),
      catchError(error => {
        console.error('Error fetching media details:', error);
        return throwError(() => new Error('Failed to load media details'));
      })
    );
  }

  search(
    searchTerm: string = '',
    mediaType?: string,
    branchId?: string,
    availableOnly: boolean = false
  ): Observable<SearchResponse> {
    let params = new HttpParams();
    
    if (searchTerm) params = params.set('q', searchTerm);
    if (mediaType) params = params.set('type', mediaType);
    if (branchId) params = params.set('branch', branchId);
    if (availableOnly) params = params.set('available', 'true');

    return this.http.get<SearchResponse>(`${this.API_URL}/search`, {
      headers: this.getHeaders(),
      params,
      withCredentials: true
    }).pipe(
      tap(response => console.log('Search results:', response)),
      catchError(error => {
        console.error('Search error:', error);
        return throwError(() => new Error('Search failed'));
      })
    );
  }
}