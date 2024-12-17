import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";
import { FooterAdminComponent } from "../footer-admin/footer-admin.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faCircle } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface UserResponse {
  first_name: string;
  user_type: string;
  user_id: number;
}

@Component({
  selector: 'app-admin-homepage',
  standalone: true,
  imports: [RouterModule, CommonModule, FooterAdminComponent, FontAwesomeModule],
  templateUrl: './admin-homepage.component.html',
  styleUrl: './admin-homepage.component.css'
})
export class AdminHomepageComponent {
  firstName: string = "";
  faUser = faUser;
  faCircle = faCircle;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/admin']);
      return;
    }

    const storedFullName = localStorage.getItem('first_Name');
    if (storedFullName) {
      this.firstName = storedFullName.split(' ')[0];
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<UserResponse>('http://localhost:5000/api/auth/validate', { 
      headers,
      withCredentials: true 
    }).subscribe({
      next: (response) => {
        if (response.first_name) {
          this.firstName = response.first_name.split(' ')[0];
          if (response.first_name !== storedFullName) {
            localStorage.setItem('first_Name', response.first_name);
          }
        }
      },
      error: (error) => {
        console.error('Token validation error:', error);
        if (error.status === 401) {
          localStorage.clear();
          this.router.navigate(['/admin']);
        }
      }
    });
  }

  handleTileClick(tileName: string): void {
    if (tileName === 'Manage Inventory') {
      this.router.navigate(['/inventory_management']);
    }
    else if(tileName === 'Add New Media'){
      this.router.navigate(['/media-addition-method'])
    }
    else {
      alert(`This will take you to ${tileName}`);
    }
  }



  onClickingSettings(){
    alert(`This will take you to Settings`)
  }

  profileAlert(){
    alert("This icon opens profile settings")
  }

  logout(): void {
    this.authService.logoutAdmin();
  }
}