import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import { FooterStaffComponent } from '../footer-staff/footer-staff.component';
import { MediaAdditionMethodComponent } from '../media-addition-method/media-addition-method.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface UserResponse {
  first_name: string;
  user_type: string;
  user_id: number;
}

@Component({
  selector: 'app-staff-homepage',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule, CommonModule, FooterStaffComponent, MediaAdditionMethodComponent],
  templateUrl: './staff-homepage.component.html',
  styleUrl: './staff-homepage.component.css'
})
export class StaffHomepageComponent {
  firstName: string = "";
  faUser = faUser;
  faCircle = faCircle;
  showMediaAddition = false;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/staff']);
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
          this.router.navigate(['/staff']);
        }
      }
    });
  }

  handleTileClick(tileName: string): void {
    if (tileName === 'Manage Inventory') {
      this.router.navigate(['/inventory_management']);
    }
    else if (tileName === 'Add New Media'){
      this.toggleMediaAdditionModal()
    } 
    else {
      alert(`This will take you to ${tileName}`);
    }
  }

  handleLinkClick(linkName: string): void {
    if (linkName === 'Inventory') {
      this.router.navigate(['/inventory_management']);
    } 
    else {
      alert(`This will take you to ${linkName}`);
    }
  }

  onClickingSettings(){
    alert(`This will take you to Settings`)
  }

  profileAlert(){
    alert("This icon opens profile settings")
  }

  toggleMediaAdditionModal(): void {
    this.showMediaAddition = !this.showMediaAddition;
  }
  
}
