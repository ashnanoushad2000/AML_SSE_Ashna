import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';

describe('AdminGuard', () => {
  let adminGuard: AdminGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getRole']);
    const routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    adminGuard = TestBed.inject(AdminGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    router.createUrlTree.and.returnValue({} as UrlTree);
  });

  it('should allow access for admin users', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.getRole.and.returnValue('ADMIN');

    const result = adminGuard.canActivate({} as any, {} as any);
    expect(result).toBeTrue();
  });

  it('should redirect unauthenticated users to login', () => {
    authService.isLoggedIn.and.returnValue(false);

    const result = adminGuard.canActivate({} as any, {} as any);
    expect(result).toEqual(router.createUrlTree(['/admin']));
    expect(router.createUrlTree).toHaveBeenCalledWith(['/admin']);
  });
});
