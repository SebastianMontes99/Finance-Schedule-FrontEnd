import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PlanPagosPathService {

  constructor(private http:HttpClient) { }

  guardarDatos(form:NgForm){
    const datos=form.value;
    this.http.post('/http://localhost:9090/planPagos',datos).subscribe(
      (response)=>{
        console.log('Datos guardados',response)
        window.alert('Se guardo Correctamente el plan')
      },
      (error)=>{
        console.log('Error al guardar datos',error)
      }
    )
  }
}
