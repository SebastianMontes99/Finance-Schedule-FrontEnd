import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { RegistroFormComponent } from './registro-form/registro-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TasaNominalComponent } from './tasa-nominal/tasa-nominal.component';
import { PlanPagosComponent } from './planPagos/planPagos.component';
import { SidevaarComponent } from './sidevaar/sidevaar.component';
import { MisPlanesComponent } from './mis-planes/mis-planes.component';
import { PlanesDetailsComponent } from './planes-details/planes-details.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    RegistroFormComponent,
    TasaNominalComponent,
    PlanPagosComponent,
    SidevaarComponent,
    MisPlanesComponent,
    PlanesDetailsComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatOptionModule,
    MatToolbarModule,
    ReactiveFormsModule,
    FormsModule,
    MatSidenavModule,
    MatRadioModule,
    MatListModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
