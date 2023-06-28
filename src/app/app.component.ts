import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'carsdomain';
  isLoggedIn = false;
  isSidenavOpen = false;

  constructor(private authService: AuthService,private router: Router) {
    // Limpiar el localStorage antes de cerrar la página
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn === null ? false : isLoggedIn;
      if (!this.isLoggedIn) {
        this.router.navigate(['/login']);
      }
    });
  }
  logout(): void {
    localStorage.clear(); // Borrar datos del localStorage
    this.authService.setLoggedIn(false); // Establecer isLoggedIn en false
    this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
  }

}
