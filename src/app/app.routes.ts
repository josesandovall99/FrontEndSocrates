import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { EmpleadoDashboard } from './components/empleado-dashboard/empleado-dashboard.component';
import { EmpleadoSecretariaComponent } from './components/empleado-secretaria/empleado-secretaria.component';
import { EmpleadoTecnicoComponent } from './components/empleado-tecnico/empleado-tecnico.component';
import { TipoPlanComponent } from './components/tipo-plan/tipo-plan.component';
import { ServicioComponent } from './components/solicitud-servicio/solictud-servicio-component';

export const routes: Routes = [
  // Solo el componente de login se carga para esta ruta
  //{ path: 'login', component: LoginComponent },

  // Rutas protegidas por AuthGuard
 
  {path: 'empleado-dashboard' , component: EmpleadoDashboard, canActivate:[AuthGuard], data: {userType: 'admin'}}, // aqui estaran dos targetas para gestionar secretaria y tecnico
  {path: 'empleado-secretaria' , component: EmpleadoSecretariaComponent, canActivate:[AuthGuard], data: {userType: 'admin'}},
  {path: 'empleado-tecnico' , component: EmpleadoTecnicoComponent, canActivate:[AuthGuard], data: {userType: 'admin'}},
  {path: 'tipo-plan', component:TipoPlanComponent},
  {path: 'solicitud-servicio' , component: ServicioComponent, canActivate:[AuthGuard], data: {userType: 'secretaria'}},

  //{path: 'solicitud-servicio' , component: SolicitudServicioComponent, canActivate:[AuthGuard], data: {userType: 'secretaria'}},
  


  // Ruta por defecto redirige al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Redirige a login para cualquier ruta no definida
  { path: '**', redirectTo: 'login' }

  
];
