import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { ClientList } from './components/client-list/client-list';
import { ClientDetail } from './components/client-detail/client-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'clients', component: ClientList },
  { path: 'clients/:id', component: ClientDetail }
];