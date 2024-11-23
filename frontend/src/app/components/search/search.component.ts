import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule,FooterComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  isAvailable: boolean = false;
  isOnHold: boolean = false;

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']);
  }
}