import { Component } from '@angular/core';

@Component({
  selector: 'app-tasa-nominal',
  templateUrl: './tasa-nominal.component.html',
  styleUrls: ['./tasa-nominal.component.css']
})
export class TasaNominalComponent {
  tasaOriginal: number=0;
  tiempoOriginal: number=0;
  unidadTiempoOriginal: string='';
  tiempoNuevo: number=0;
  unidadTiempoNuevo: string='';
  tasaNueva: number=0;

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
