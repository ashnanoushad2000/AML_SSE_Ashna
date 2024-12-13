import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class StaffGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const isLoggedIn = this.authService.isLoggedIn();
    const role = this.authService.getRole();
    console.log('StaffGuard check: LoggedIn:', isLoggedIn, 'Role:', role);

    if (isLoggedIn && role === 'STAFF') {
      return true; // Allow access
    }

    console.log('StaffGuard: Non-staff user. Redirecting to login.');
    return this.router.createUrlTree(['/staff']); // Redirect to login
  }
}
