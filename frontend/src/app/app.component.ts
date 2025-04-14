import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginPageComponent } from "./components/login-page/login-page.component";
import { RegistrationPageComponent } from './components/registration-page/registration-page.component';
import { HomeComponent } from './components/home/home.component';
import { StaffLoginComponent } from './components/staff-login/staff-login.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HoldsComponent } from './components/holds/holds.component';
import { LoansComponent } from './components/loans/loans.component';
import { IdleTimeoutService } from './services/idle-timeout.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginPageComponent, RegistrationPageComponent, HomeComponent, StaffLoginComponent, CommonModule,HoldsComponent, LoansComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'AML-16';

  constructor(private router: Router,private idleTimeoutService: IdleTimeoutService) {}

  isAdminOrLibrarianRoute(): boolean {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/edit_media')) {
      return true;
  }
    return currentUrl === '/staff' || currentUrl === '/admin' || currentUrl === '/admin_homepage' || currentUrl === '/inventory_management'|| currentUrl === '/single_media_addition' ||  currentUrl === '/staff_homepage' || currentUrl === '/transfer_management' || currentUrl === '/transfer_initiation';
  }
}
