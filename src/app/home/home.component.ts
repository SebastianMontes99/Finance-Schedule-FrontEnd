import { Component,OnInit  } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  mensajeBienvenida?: string;

  constructor() { }

  ngOnInit() {
    // Obtener el nombre de usuario almacenado en el LocalStorage
    const username = localStorage.getItem('username');

    // Construir el mensaje de bienvenida
    this.mensajeBienvenida = `Hola ${username} !`;
  }
}
