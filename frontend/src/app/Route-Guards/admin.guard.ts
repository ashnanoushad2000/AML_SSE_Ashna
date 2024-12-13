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
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const isLoggedIn = this.authService.isLoggedIn();
    const role = this.authService.getRole();
    const targetUrl = state.url;
    console.log('AdminGuard check: LoggedIn:', isLoggedIn, 'Role:', role);

    if (isLoggedIn && role === 'ADMIN') {
      return true; // Allow access
    }

    if (isLoggedIn && targetUrl === '/admin') {
      console.log('AuthGuard: User is logged in. Redirecting to /home.');
      return this.router.createUrlTree(['/home']); // Redirect to /home
    }

    console.log('AdminGuard: Non-admin user. Redirecting to login.');
    return this.router.createUrlTree(['/admin']); // Redirect to login
  }
}
