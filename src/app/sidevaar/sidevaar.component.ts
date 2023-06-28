import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sidevaar',
  templateUrl: './sidevaar.component.html',
  styleUrls: ['./sidevaar.component.css']
})
export class SidevaarComponent {

constructor(private router:Router, private authService:AuthService){

}
logout(): void {
  localStorage.clear(); // Borrar datos del localStorage
  this.authService.setLoggedIn(false); // Establecer isLoggedIn en false
  this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
}
}
