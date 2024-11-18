
import { Routes, RouterModule} from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegistrationPageComponent } from './components/registration-page/registration-page.component';
import { HeaderComponent } from './components/header/header.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { StaffLoginComponent } from './components/staff-login/staff-login.component';

export const routes: Routes = [{
    path: '', component: LoginPageComponent},
    { path: 'registration-page', component: RegistrationPageComponent
    },
    {
        path: 'payments', component: PaymentsComponent
    },
    {
        path: 'staff', component: StaffLoginComponent
    }
];

Imports: [LoginPageComponent, RouterModule.forRoot(routes, {enableTracing: true})]