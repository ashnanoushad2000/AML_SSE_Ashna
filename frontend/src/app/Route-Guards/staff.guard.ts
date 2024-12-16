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
  const targetUrl = state.url;
  console.log('AuthGuard: Checking access for URL:', targetUrl);
  
    // Case 1: User is logged in and trying to access the login page
  if (isLoggedIn && targetUrl === '/staff') {
    console.log('AuthGuard: User is logged in. Redirecting to /home.');
    return this.router.createUrlTree(['/staff_homepage']); // Redirect to /home
  }
  
    // Case 2: User is not logged in and trying to access protected pages
  if (!isLoggedIn && targetUrl !== '/staff') {
    console.log('AuthGuard: User not logged in. Redirecting to login.');
    return this.router.createUrlTree(['/staff']); // Redirect to login
  }

  // Case 3: Allow access to the login page if not logged in
  if (!isLoggedIn && targetUrl === '/staff') {
    console.log('AuthGuard: Allowing access to login page for unauthenticated user.');
    return true; // Allow access to login
  }
  
    // Case 4: Allow access for authenticated users to all other routes
  console.log('AuthGuard: Access granted for URL:', targetUrl);
  return true;
}
}
