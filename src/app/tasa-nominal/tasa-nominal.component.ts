import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-tasa-nominal',
  templateUrl: './tasa-nominal.component.html',
  styleUrls: ['./tasa-nominal.component.css']
})
export class TasaNominalComponent implements OnInit {


  safeHtml!: SafeHtml;
  tasaOriginal: number=0;
  tiempoOriginal: number=0;
  unidadTiempoOriginal: string='';
  tiempoNuevo: number=0;
  unidadTiempoNuevo: string='';
  tasaNueva: number=0;

  constructor(private http:HttpClient, private sanitizer: DomSanitizer){}

  ngOnInit() {
    this.http.get('https://economia.uancv.edu.pe/simuladores/finanzas/tasas_interes/', {responseType: 'text'}).subscribe(data => {
      let parser = new window.DOMParser();
      let doc = parser.parseFromString(data, "text/html");
      let element = doc.querySelector('#id-del-elemento'); // Cambia esto al id del elemento que deseas
      let htmlFragment = element!.outerHTML;
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(htmlFragment);
    });
  }


  convertir() {
    const tasaDecimal = this.tasaOriginal / 100;
    let tiempoOriginalEnAnos=0;
    switch (this.unidadTiempoOriginal) {
      case 'anos':
        tiempoOriginalEnAnos = this.tiempoOriginal;
        break;
      case 'meses':
        tiempoOriginalEnAnos = this.tiempoOriginal / 12;
        break;
      case 'dias':
        tiempoOriginalEnAnos = this.tiempoOriginal / 365;
        break;
    }
    let tiempoNuevoEnAnos=0;
    switch (this.unidadTiempoNuevo) {
      case 'anos':
        tiempoNuevoEnAnos = this.tiempoNuevo;
        break;
      case 'meses':
        tiempoNuevoEnAnos = this.tiempoNuevo / 12;
        break;
      case 'dias':
        tiempoNuevoEnAnos = this.tiempoNuevo / 365;
        break;
    }
    const tasaNueva = tasaDecimal / tiempoOriginalEnAnos * tiempoNuevoEnAnos * 100;
    this.tasaNueva = Math.round(tasaNueva * 100) / 100;
  }
}
