import { Routes, RouterModule} from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegistrationPageComponent } from './components/registration-page/registration-page.component';
import { HeaderComponent } from './components/header/header.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { StaffLoginComponent } from './components/staff-login/staff-login.component';
import { SingleMediaAdditionComponent } from './components/single-media-addition/single-media-addition.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { HoldsComponent } from './components/holds/holds.component';
import { LoansComponent } from './components/loans/loans.component';  // Add this import
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminHomepageComponent } from './components/admin-homepage/admin-homepage.component';
import { InventoryManagementComponent } from './components/inventory-management/inventory-management.component';
import { TransferManagementComponent } from './components/transfer-management/transfer-management.component';
import { TransferInitiationComponent } from './components/transfer-initiation/transfer-initiation.component';
import { StaffHomepageComponent } from './components/staff-homepage/staff-homepage.component';
import { AuthGuard } from './Route-Guards/auth.guard';
import { StaffGuard } from './Route-Guards/staff.guard';
import { AdminGuard } from './Route-Guards/admin.guard';
import { EditMediaComponent } from './components/edit-media/edit-media.component';
import { PaymentOptionsComponent } from './components/payment-options/payment-options.component';
import { PayByCardComponent } from './components/pay-by-card/pay-by-card.component';

export const routes: Routes = [{
    path: '', component: LoginPageComponent, canActivate: [AuthGuard]
    },
    { 
        path: 'registration-page', component: RegistrationPageComponent
    },
    {
        path: 'payments', component: PaymentsComponent, canActivate: [AuthGuard]
    },
    {
        path: 'staff', component: StaffLoginComponent, canActivate: [StaffGuard]
    },
    {
        path: 'single_media_addition', component: SingleMediaAdditionComponent
    },
    {
        path: 'home', component: HomeComponent, canActivate: [AuthGuard]
    },
    {
        path: 'admin', component: AdminLoginComponent, canActivate: [AdminGuard]
    },
   {
    path: 'search', component: SearchComponent, canActivate: [AuthGuard]
   },
   {
    path: 'holds', component: HoldsComponent, canActivate: [AuthGuard]
   },
   {
    path: 'loans', component: LoansComponent, canActivate: [AuthGuard]  // Add this route
   },
    {
        path: 'admin_homepage', component: AdminHomepageComponent, canActivate: [AdminGuard]
    },
    {
        path: 'inventory_management', component: InventoryManagementComponent, canActivate: [AdminGuard, StaffGuard]
    },
    {
        path: 'transfer_management', component: TransferManagementComponent, canActivate: [StaffGuard, AdminGuard]
    },
    {
        path: 'transfer_initiation', component: TransferInitiationComponent, canActivate: [StaffGuard, AdminGuard]
    },
    {
        path: 'staff_homepage', component: StaffHomepageComponent, canActivate: [StaffGuard]
    },
    {
        path: 'edit_media/:mediaId', component: EditMediaComponent, canActivate: [StaffGuard, AdminGuard]
    },
    {
        path: 'payment_options', component: PaymentOptionsComponent, canActivate: [AuthGuard]
    },
    {
        path: 'pay_by_card', component: PayByCardComponent, canActivate: [AuthGuard]
    }
];

RouterModule.forRoot(routes, { enableTracing: true });
Imports: [LoginPageComponent, RouterModule.forRoot(routes, {enableTracing: true})]