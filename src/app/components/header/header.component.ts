import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import {faArrowLeftLong, faUser} from '@fortawesome/free-solid-svg-icons'
import { faCircle } from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() route: string = '';
  @Input() arrowColor: string = 'black'
  faArrowLeftLong = faArrowLeftLong;
  faUser = faUser;
  faCircle = faCircle;

  profileAlert(){
    alert("This icon opens profile settings")
  }
}
