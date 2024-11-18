import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isMenuOpen = false;


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log('Menu toggled:', this.isMenuOpen); // For debugging
  }
}