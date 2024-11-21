import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginPageComponent } from "./components/login-page/login-page.component";
import { RegistrationPageComponent } from './components/registration-page/registration-page.component';
import { HomeComponent } from './components/home/home.component';
import { StaffLoginComponent } from './components/staff-login/staff-login.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginPageComponent, RegistrationPageComponent, HomeComponent, StaffLoginComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'AML-16';

  constructor(private router: Router) {}

  isAdminOrLibrarianRoute(): boolean {
    const currentUrl = this.router.url;
    return currentUrl === '/librarian' || currentUrl === '/admin';
  }
}
