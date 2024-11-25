import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import {faHouse, faBook, faMagnifyingGlass, faSterlingSign, faUser} from '@fortawesome/free-solid-svg-icons'
import { faCircle } from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  house = faHouse;
  book = faBook;
  magnifyingGlass = faMagnifyingGlass;
  sterlingSign = faSterlingSign;
  user = faUser;
}
