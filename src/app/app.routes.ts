import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { TicketListComponent } from './components/ticket-list/ticket-list';
import { TicketFormComponent } from './components/ticket-form/ticket-form';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail';
import { UserListComponent } from './components/user-list/user-list';
import { ChangePasswordComponent } from './components/change-password/change-password';
import { authGuard } from './auth.guard';
import { jefeGuard } from './jefe.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cambiar-password', component: ChangePasswordComponent, canActivate: [authGuard] },
  { path: 'tickets', component: TicketListComponent, canActivate: [authGuard] },
  { path: 'nuevo-ticket', component: TicketFormComponent, canActivate: [authGuard] },
  { path: 'tickets/:id', component: TicketDetailComponent, canActivate: [authGuard] },
  { path: 'usuarios', component: UserListComponent, canActivate: [authGuard, jefeGuard] },
  { path: '', redirectTo: 'tickets', pathMatch: 'full' },
  { path: '**', redirectTo: 'tickets' }
];