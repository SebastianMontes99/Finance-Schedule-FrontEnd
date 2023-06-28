import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  passwordsMatch = true;

  constructor(private location: Location,private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      email: ['', Validators.required],
      // Agregar otros campos si es necesario
    }, {
      validators: this.passwordMatchValidator
    });
  }

  goBack(): void {
    this.location.back();
  }
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    if (password && confirmPassword) {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordsMismatch: true });
      } else {
        confirmPassword.setErrors(null);
      }
    }
  }

  submit(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      delete formData.confirmPassword;
      this.http.get<any[]>('http://localhost:9090/users').subscribe(users => {
        const existingUser = users.find(u => u.username === formData.username);
        if (existingUser) {
          alert('El usuario escrito ya existe, considere registrar uno nuevo');
        } else {
          this.http.post('http://localhost:9090/users', formData).subscribe(() => {
            alert('Usuario registrado');
            this.router.navigateByUrl('/login');
            // Redirigir a la página de inicio de sesión (login)
          }, () => {
            console.log('Error registering user');
          });
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
