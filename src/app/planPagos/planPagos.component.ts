import { Component, OnInit,AfterViewInit  } from '@angular/core';
import { PlanPagosService } from './plan-pagos.service';
import * as XLSX from 'xlsx';
import { HttpClient} from '@angular/common/http';
import { saveAs } from 'file-saver';
interface Resultado {
  mes: number;
  saldoDeuda: number;
  intereses: number;
  amortizacionCapital: number;
  cuotaCapital: number;
  cuotaMensual: number;
  tipoMoneda: string;
}
declare var $: any;
@Component({
  selector: 'app-planPagos',
  templateUrl: './planPagos.component.html',
  styleUrls: ['./planPagos.component.css']
})
export class PlanPagosComponent implements OnInit {

  capital!: number;
  prestamo!: number;
  tasaInteres!: number;
  plazo!: number;
  periodoGracia!: number;
  tipoPlazoGracia:string='';
  moneda: string='';
  tipoTasaInteres: string='';
  COK!:number;
  resultado: any;
  datosEntrada:any;
  mostrarErrorTasaInteres: boolean = false;
  mostrarErrorPeriodoGracia: boolean = false;
  mostrarErrorPlazo: boolean = false;
  constructor(private planPagosService: PlanPagosService,private http:HttpClient) {}

  ngOnInit() {}

  calcularPlanDePagos() {
    this.resultado = this.planPagosService.calcularPlanPagos(
      this.capital,
      this.prestamo,
      this.tasaInteres,
      this.plazo,
      this.periodoGracia,
      this.tipoPlazoGracia,
      this.moneda,
      this.tipoTasaInteres,
      this.COK
    );
  }

  ngAfterViewInit() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }
  validarTasaInteres() {
    if (this.tasaInteres > 100|| this.tasaInteres==0) {
      this.tasaInteres = 100;
      this.mostrarErrorTasaInteres = true;
    } else {
      this.mostrarErrorTasaInteres = false;
    }
  }
  validarPeriodoGracia() {
    if (this.periodoGracia > 6) {
      this.periodoGracia = 6;
      this.mostrarErrorPeriodoGracia = true;
    } else {
      this.mostrarErrorPeriodoGracia = false;
    }
  }
  validarPlazo() {
    if (this.plazo > 300||this.plazo<6) {
      this.mostrarErrorPlazo = true;
    } else {
      this.mostrarErrorPlazo = false;
    }
  }
  ///EXPORTACION///

  exportTable(): void {
    // Obtener los datos de la tabla
    const tableData = this.prepareTableData();

    // Crear una hoja de cálculo de Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(tableData);

    // Agregar la hoja de cálculo al libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tabla');

    // Generar el archivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, 'Plan de Pagos.xlsx');
  }
  prepareTableData(): any[] {
    const tableData = [];

    // Agregar los datos de entrada
    const datosEntradaRow = {
      'Capital': this.capital,
      'Tasa de Interés': this.tasaInteres,
      'Plazo': this.plazo,
      'Período de Gracia': this.periodoGracia,
      'Moneda': this.moneda,
      'Tipo de Tasa de Interés': this.tipoTasaInteres
    };
    tableData.push(datosEntradaRow);

    // Recorrer los pagos del resultado y agregarlos al arreglo 'tableData'
    for (const pago of this.resultado.resultados) {
      const rowData = {
        Mes: pago.mes,
        'Saldo Deuda': pago.saldoDeuda,
        Intereses: pago.intereses,
        Amortización: pago.amortizacionCapital,
        'Cuota Capital': pago.cuotaCapital,
        'Cuota Mensual': pago.cuotaMensual
      };
      tableData.push(rowData);
    }
    const datosSalida={
      'VAN':this.resultado.VAN,
      'TIR':this.resultado.TIR,
      'Total Pagado':this.resultado.totalPagado

    }
    tableData.push(datosSalida);

    return tableData;
  }

  saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(data);

    // Crear un enlace y hacer clic en él para descargar el archivo
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();

    // Liberar el objeto URL creado
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      link.remove();
    }, 100);
  }

//GUARDADO DE DATOS
guardarDatos() {

  const username= localStorage.getItem('username');;
  const capital = this.capital;
  const tasaInteres = this.tasaInteres;
  const prestamo=this.prestamo;
  const plazo = this.plazo;
  const periodoGracia = this.periodoGracia;
  const tipoPlazoGracia=this.tipoPlazoGracia
  const moneda = this.moneda;
  const tipoTasaInteres = this.tipoTasaInteres;
  const van=this.resultado.VAN
  const tir=this.resultado.TIR
  const totalPagado=this.resultado.totalPagado
  const resultados= this.resultado.resultados;
  console.log(resultados)

  const datosFormulario = {
    username,
    capital,
    tasaInteres,
    prestamo,
    plazo,
    periodoGracia,
    tipoPlazoGracia,
    moneda,
    tipoTasaInteres,
    van,
    tir,
    totalPagado,
    resultados
  };

  this.http.post('http://localhost:9090/planPagos', datosFormulario).subscribe(
    (response) => {
      console.log('Datos guardados correctamente', response);
      window.alert('Se guardo Correctamente el plan')
    },
    (error) => {
      console.error('Error al guardar datos', error);
    }
  );
}

formatCurrency(amount: number, moneda: string): string {
  let result: string='';
  if (moneda === '1') {
      result = 'S/ ' + amount.toFixed(2);
  } else if (moneda === '2') {
      result = '$/ ' + amount.toFixed(2);
  }
  return result;
}
}
