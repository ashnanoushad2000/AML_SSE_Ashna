import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";
import { FooterAdminComponent } from "../footer-admin/footer-admin.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-homepage',
  standalone: true,
  imports: [RouterModule, CommonModule, FooterComponent, FooterAdminComponent, FontAwesomeModule],
  templateUrl: './admin-homepage.component.html',
  styleUrl: './admin-homepage.component.css'
})
export class AdminHomepageComponent {
  firstName: string = "Admin";
  faUser = faUser;
  faCircle = faCircle;

  constructor(private router: Router) {}

  handleTileClick(tileName: string): void {
    if (tileName === 'Manage Inventory') {
      this.router.navigate(['/inventory_management']); 
    } else {
      alert(`This will take you to ${tileName}`);
    }
  }

  handleLinkClick(linkName: string): void {
    if (linkName === 'Inventory') {
      this.router.navigate(['/inventory_management']); 
    } else {
      alert(`This will take you to ${linkName}`);
    }
  }

  onClickingSettings(){
    alert(`This will take you to Settings`)
  }

  profileAlert(){
    alert("This icon opens profile settings")
  }
}