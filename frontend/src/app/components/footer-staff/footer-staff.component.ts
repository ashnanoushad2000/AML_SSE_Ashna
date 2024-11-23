import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faHouse, faBook, faMagnifyingGlass, faSterlingSign, faUser} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-footer-staff',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './footer-staff.component.html',
  styleUrl: './footer-staff.component.css'
})
export class FooterStaffComponent {
  house = faHouse;
  book = faBook;
  magnifyingGlass = faMagnifyingGlass;
  sterlingSign = faSterlingSign;
  user = faUser;
}
