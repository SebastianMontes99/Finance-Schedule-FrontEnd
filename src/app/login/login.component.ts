import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form!: FormGroup;
  invalidPassword = false;

  constructor(private authService: AuthService,private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/login') {
        localStorage.clear();
      }
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    // Lógica de inicio de sesión
    this.authService.setLoggedIn(true);
  }
  submit(): void {
    const username = this.form.get('username')?.value;
    const password = this.form.get('password')?.value;

    this.http.get<any[]>('http://localhost:9090/users').subscribe(users => {
      const user = users.find(u => u.username === username && u.password === password);


      if (user) {
        console.log('Login successful');
        this.authService.setLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true'); // Guardar en localStorage
        localStorage.setItem('username', username); // Guardar nombre de usuario en localStorage
        this.router.navigateByUrl('/home');
      } else {
        alert('Datos incorrectos, verifica tu usuario o contraseña');
        this.invalidPassword = true;
      }
    });
  }
}
