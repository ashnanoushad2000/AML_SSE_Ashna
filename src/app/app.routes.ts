
import { Routes, RouterModule} from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegistrationPageComponent } from './components/registration-page/registration-page.component';
import { HeaderComponent } from './components/header/header.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { StaffLoginComponent } from './components/staff-login/staff-login.component';
import { SingleMediaAdditionComponent } from './components/single-media-addition/single-media-addition.component';
import { HomeComponent } from './components/home/home.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminHomepageComponent } from './components/admin-homepage/admin-homepage.component';
import { InventoryManagementComponent } from './components/inventory-management/inventory-management.component';
import { TransferManagementComponent } from './components/transfer-management/transfer-management.component';
import { TransferInitiationComponent } from './components/transfer-initiation/transfer-initiation.component';

export const routes: Routes = [{
    path: '', component: LoginPageComponent},
    { path: 'registration-page', component: RegistrationPageComponent
    },
    {
        path: 'payments', component: PaymentsComponent
    },
    {
        path: 'staff', component: StaffLoginComponent
    },
    {
        path: 'single_media_addition', component: SingleMediaAdditionComponent
    },
    {
        path: 'home', component: HomeComponent
    },
    {
        path: 'librarian', component: StaffLoginComponent
    },
    {
        path: 'admin', component: AdminLoginComponent
    },
    {
        path: 'admin_homepage', component: AdminHomepageComponent
    },
    {
        path: 'inventory_management', component: InventoryManagementComponent
    },
    {
        path: 'transfer_management', component: TransferManagementComponent
    },
    {
        path: 'transfer_initiation', component: TransferInitiationComponent
    }
];

Imports: [LoginPageComponent, RouterModule.forRoot(routes, {enableTracing: true})]