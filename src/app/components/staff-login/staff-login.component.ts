import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-staff-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './staff-login.component.html',
  styleUrl: './staff-login.component.css'
})
export class StaffLoginComponent {
  onSubmit(){
    alert('Submit')
  }
}
