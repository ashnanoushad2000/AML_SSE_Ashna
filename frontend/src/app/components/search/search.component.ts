import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from "../header/header.component";
import { SearchService, MediaSearchResult, Branch } from '../../services/search.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, HeaderComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';
  selectedMediaType: string = '';
  selectedBranch: string = '';
  isAvailable: boolean = false;
  isOnHold: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  searchResults: MediaSearchResult[] = [];
  branches: Branch[] = [];
  selectedMedia: MediaSearchResult | null = null;

  constructor(
    private router: Router,
    private searchService: SearchService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('Search component initialized');
    this.loadBranches();
  }

  private loadBranches() {
    console.log('Loading branches...');
    this.searchService.getBranches().subscribe({
      next: (branches) => {
        console.log('Branches loaded successfully:', branches);
        this.branches = branches;
      },
      error: (error) => {
        console.error('Error loading branches:', error);
        this.errorMessage = 'Error loading branches';
      }
    });
  }

  clearSearch() {
    this.searchTerm = '';
  }

  clearMediaType() {
    this.selectedMediaType = '';
  }

  clearBranch() {
    this.selectedBranch = '';
  }

  performSearch() {
    console.log('Performing search with:', {
      searchTerm: this.searchTerm,
      mediaType: this.selectedMediaType,
      branch: this.selectedBranch,
      available: this.isAvailable
    });

    this.isLoading = true;
    this.errorMessage = '';
    
    this.searchService.search(
      this.searchTerm,
      this.selectedMediaType,
      this.selectedBranch,
      this.isAvailable
    ).subscribe({
      next: (response) => {
        console.log('Search results received:', response);
        this.searchResults = response.results;
        this.isLoading = false;
        if (this.searchResults.length === 0) {
          this.errorMessage = 'No media items found';
        }
      },
      error: (error) => {
        console.error('Search error:', error);
        this.isLoading = false;
        this.errorMessage = 'An error occurred while searching';
        if (error.status === 401) {
          this.authService.logout();
        }
      }
    });
  }

  showDetails(media: MediaSearchResult) {
    console.log('Showing details for:', media.title);
    this.selectedMedia = media;
  }

  closeDetails(event: MouseEvent) {
    // Close only if clicking overlay background or close button
    if (
      (event.target as HTMLElement).className === 'overlay' ||
      (event.target as HTMLElement).className === 'close-overlay'
    ) {
      console.log('Closing media details');
      this.selectedMedia = null;
      event.stopPropagation();
    }
  }
}