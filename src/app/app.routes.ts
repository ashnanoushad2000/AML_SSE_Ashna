
import { Routes, RouterModule} from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegistrationPageComponent } from './components/registration-page/registration-page.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';



export const routes: Routes = [{
    path: '', component: LoginPageComponent},
    { path: 'registration-page', component: RegistrationPageComponent
    },
    {
         path: 'header', component: HeaderComponent
    },
    { path: 'home', component: HomeComponent },
//   { path: '**', redirectTo: '' },
];

Imports: [LoginPageComponent, RouterModule.forRoot(routes, {enableTracing: true})]