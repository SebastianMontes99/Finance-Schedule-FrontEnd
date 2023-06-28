import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-planes',
  templateUrl: './mis-planes.component.html',
  styleUrls: ['./mis-planes.component.css']
})
export class MisPlanesComponent {
  data: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const username = localStorage.getItem('username'); // Obtener el nombre de usuario del Local Storage

    this.http.get<any>('http://localhost:9090/planPagos')
      .subscribe(response => {
        this.data = response;

        // Filtrar los datos por nombre de usuario
        this.data = this.data.filter((item: { username: string }) => item.username === username);

        console.log(this.data);
      }, error => {
        console.error(error);
      });
  }
}
