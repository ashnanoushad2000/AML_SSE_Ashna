import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    const routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Mock createUrlTree to return a UrlTree object
    router.createUrlTree.and.returnValue({} as UrlTree);
  });

  it('should allow access if user is logged in', () => {
    authService.isLoggedIn.and.returnValue(true);

    const result = authGuard.canActivate({} as any, {} as any);

    expect(result).toBeTrue();
  });

  it('should redirect to /home if user is logged in and trying to access login page', () => {
    authService.isLoggedIn.and.returnValue(true);

    const result = authGuard.canActivate({} as any, { url: '/' } as any);

    expect(result).toEqual(router.createUrlTree(['/home']));
    expect(router.createUrlTree).toHaveBeenCalledWith(['/home']);
  });

  it('should redirect to login if user is not logged in and trying to access protected routes', () => {
    authService.isLoggedIn.and.returnValue(false);

    const result = authGuard.canActivate({} as any, { url: '/protected' } as any);

    expect(result).toEqual(router.createUrlTree(['/']));
    expect(router.createUrlTree).toHaveBeenCalledWith(['/']);
  });

  it('should allow access to login page if user is not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);

    const result = authGuard.canActivate({} as any, { url: '/' } as any);

    expect(result).toBeTrue();
  });
});
