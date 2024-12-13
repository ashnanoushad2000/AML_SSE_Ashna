import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerMock },
      ],
    });

    authService = TestBed.inject(AuthService);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should save token and user type on login', () => {
    const token = 'test-token';
    const userType = 'MEMBER';
    authService.login(token, userType);
    expect(localStorage.getItem('token')).toBe(token);
    expect(localStorage.getItem('userType')).toBe(userType);
  });

  it('should remove token on logout and navigate to login page', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('userType', 'MEMBER');
    authService.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('userType')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should return true if user is logged in', () => {
    localStorage.setItem('token', 'test-token');
    expect(authService.isLoggedIn()).toBeTrue();
  });

  it('should return false if user is not logged in', () => {
    localStorage.removeItem('token');
    expect(authService.isLoggedIn()).toBeFalse();
  });

  it('should get the token correctly', () => {
    const token = 'test-token';
    localStorage.setItem('token', token);
    expect(authService.getToken()).toBe(token);
  });
});
