import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TasaNominalComponent } from './tasa-nominal/tasa-nominal.component';
import { PlanPagosComponent } from './planPagos/planPagos.component';
import { MisPlanesComponent } from './mis-planes/mis-planes.component';
import { PlanesDetailsComponent } from './planes-details/planes-details.component';

const routes: Routes = [
  {path:'login', component : LoginComponent},
  {path:'home', component : HomeComponent},
  {path:'register', component : RegisterComponent},
  {path:'tasaNominal',component:TasaNominalComponent},
  {path:'planPagos',component:PlanPagosComponent},
  {path:'misPlanes',component:MisPlanesComponent},
  {path:'planes-details/:id',component:PlanesDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
