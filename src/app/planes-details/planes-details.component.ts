import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-planes-details',
  templateUrl: './planes-details.component.html',
  styleUrls: ['./planes-details.component.css']
})
export class PlanesDetailsComponent {
  id: string='';
  data:any;
  capital: number=0;
  tasaInteres: number=0;
  plazo: number=0;
  periodoGracia: number=0;
  moneda: string='';
  tipoTasaInteres: string='';
  resultado: any;
  datosEntrada:any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient, private router:Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loadPlanDetails(this.id);
    });
  }

  loadPlanDetails(id: string) {
    this.http.get<any>('http://localhost:9090/planPagos/' + id) // Reemplaza con la URL de tu servidor y ruta correspondiente para obtener los detalles del plan
      .subscribe(response => {
        this.data = response;
        console.log(this.data)
      }, error => {
        console.error(error);
      });
  }
  deletePlan() {
    if (confirm('¿Estás seguro de que deseas eliminar este plan?')) {
      this.http
        .delete('http://localhost:9090/planPagos/' + this.id)
        .pipe(
          switchMap(() => this.router.navigate(['/misPlanes'])) // Redirige al usuario a la página de listado de planes después de eliminar con éxito
        )
        .subscribe(
          () => console.log('Plan eliminado con éxito'),
          error => console.error('Error al eliminar el plan:', error)
        );
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
    if (Array.isArray(this.data)) {
    const datosEntradaRow = {
    };
    tableData.push(datosEntradaRow);
  }
    // Recorrer los pagos del resultado y agregarlos al arreglo 'tableData'
    for (const pago of this.data?.resultados) {
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
}
