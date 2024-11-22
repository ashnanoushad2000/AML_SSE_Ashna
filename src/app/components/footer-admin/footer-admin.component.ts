import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faHouse, faBook, faMagnifyingGlass, faSterlingSign, faUser} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-footer-admin',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './footer-admin.component.html',
  styleUrl: './footer-admin.component.css'
})
export class FooterAdminComponent {
  house = faHouse;
  book = faBook;
  magnifyingGlass = faMagnifyingGlass;
  sterlingSign = faSterlingSign;
  user = faUser;


}
