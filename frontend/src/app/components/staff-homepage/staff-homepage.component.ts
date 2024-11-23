import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import { FooterStaffComponent } from '../footer-staff/footer-staff.component';
import { MediaAdditionMethodComponent } from '../media-addition-method/media-addition-method.component';

@Component({
  selector: 'app-staff-homepage',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule, CommonModule, FooterStaffComponent, MediaAdditionMethodComponent],
  templateUrl: './staff-homepage.component.html',
  styleUrl: './staff-homepage.component.css'
})
export class StaffHomepageComponent {
  firstName: string = "Librarian";
  faUser = faUser;
  faCircle = faCircle;
  showMediaAddition = false;

  constructor(private router: Router) {}

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
