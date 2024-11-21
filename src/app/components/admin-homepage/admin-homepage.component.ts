import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-homepage',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-homepage.component.html',
  styleUrl: './admin-homepage.component.css'
})
export class AdminHomepageComponent {
  firstName: string = "User";

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
}