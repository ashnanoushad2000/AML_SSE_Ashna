import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { StaffGuard } from './staff.guard';
import { AuthService } from '../services/auth.service';

describe('StaffGuard', () => {
  let staffGuard: StaffGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getRole']);
    const routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        StaffGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    staffGuard = TestBed.inject(StaffGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    router.createUrlTree.and.returnValue({} as UrlTree);
  });

  it('should allow access for staff users', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.getRole.and.returnValue('STAFF');

    const result = staffGuard.canActivate({} as any, {} as any);
    expect(result).toBeTrue();
  });

  it('should redirect unauthenticated users to login', () => {
    authService.isLoggedIn.and.returnValue(false);

    const result = staffGuard.canActivate({} as any, {} as any);
    expect(result).toEqual(router.createUrlTree(['/staff']));
    expect(router.createUrlTree).toHaveBeenCalledWith(['/staff']);
  });
});
