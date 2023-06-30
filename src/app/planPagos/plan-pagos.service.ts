import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlanPagosService {
  calcularPlanPagos(
    capital: number,
    prestamo: number,
    tasaInteres: number,
    plazo: number,
    periodoGracia: number,
    tipoPlazoGracia: string,
    moneda: string,
    tipoTasaInteres: string,
    COK:number
  ): any {
    const resultados: any[] = [];
    capital=capital-(capital*(prestamo/100));
    let saldoDeuda = capital;
    let saldoInicial=saldoDeuda
    let totalIntereses = 0;
    let totalPagado = 0;
    let tipoMoneda = moneda === '1' ? 'S/. ' : '$ ';

    const tasaMensual = this.calcularTasaMensual(tasaInteres, tipoTasaInteres);
    const cuotaMensual = this.calcularCuotaMensual(capital, tasaMensual, plazo,periodoGracia,tipoPlazoGracia);


    for (let mes = 1; mes <= plazo; mes++) {
      let intereses = 0;
      let cuotaCapital = 0;
      let amortizacionCapital = 0;
      let tipoPlazo = "S";

      switch (true) {
        case mes <= periodoGracia && tipoPlazoGracia === 'parcial':
          saldoInicial=saldoDeuda;
          tipoPlazo = 'P';
          intereses = saldoDeuda * tasaMensual;
          totalIntereses += intereses;
          cuotaCapital = 0; // No hay amortización durante el período de gracia parcial
          amortizacionCapital = 0;
          saldoDeuda = saldoDeuda; // Aquí se añaden los intereses al saldo de la deuda
          break;
        case mes <= periodoGracia && tipoPlazoGracia === 'total':
          saldoInicial=saldoDeuda;
          tipoPlazo = 'T';
          intereses = saldoDeuda * tasaMensual;
          totalIntereses += intereses;
          cuotaCapital = 0; // No hay amortización durante el período de gracia parcial
          amortizacionCapital = 0;
          saldoDeuda +=intereses // Aquí se añaden los intereses al saldo de la deuda
          break;
        default:
          saldoInicial=saldoDeuda;
          // Cálculo de intereses y cuotaCapital después del período de gracia
          intereses = saldoDeuda * tasaMensual;
          totalIntereses += intereses;
          cuotaCapital = cuotaMensual - intereses;
          amortizacionCapital = cuotaCapital;
          saldoDeuda = saldoDeuda-(cuotaMensual-intereses);
          break;
      }
      totalPagado += cuotaCapital + intereses;


      const resultadoMes = {
        mes: mes,
        saldoDeuda: saldoDeuda,
        saldoInicial:saldoInicial,
        tipoPlazoGracia: tipoPlazo,
        intereses: intereses,
        amortizacionCapital: amortizacionCapital,
        cuotaCapital: cuotaCapital,
        cuotaMensual: cuotaCapital + intereses,
        tipoMoneda: tipoMoneda
      };

      resultados.push(resultadoMes);
    }
    const VAN = this.calcularVAN(capital, resultados, tipoTasaInteres, COK); // Calculate VAN
    const TIR = this.calcularTIR(capital, resultados, tipoTasaInteres);

    return {
      resultados: resultados,
      totalIntereses: totalIntereses,
      totalPagado: totalPagado,
      tipoMoneda: tipoMoneda,
      VAN: VAN,
      TIR: TIR
    };
  }

  private calcularTasaMensual(tasaInteres: number, tipoTasaInteres: string): number {
    if (tipoTasaInteres === 'nominal') {
      return tasaInteres / 1200; // Dividir por 1200 en lugar de 100 para convertir a porcentaje y dividir por 12 para obtener la tasa mensual
    } else { // Para tasa efectiva
      return Math.pow(1 + tasaInteres / 100, 1 / 12) - 1;
    }
}
private calcularCuotaMensual(capital: number, tasaMensual: number, plazo: number, periodoGracia: number, tipoPlazoGracia: string): number {
  let capitalConIntereses = capital;

  // Si el tipo de plazo de gracia es parcial, acumulamos los intereses al capital
  if (tipoPlazoGracia === 'total') {
    capitalConIntereses *= Math.pow(1 + tasaMensual, periodoGracia);
  }

  return capitalConIntereses * (tasaMensual / (1 - Math.pow(1 + tasaMensual, -plazo + periodoGracia)));
}

  private calcularTIR(capital: number, resultados: any[], tipoTasaInteres: string): number {
    const epsilon = 0.000001;
    let tasaMinima = -1;
    let tasaMaxima = 1;
    let tasaInteres = 0;

    while (tasaMaxima - tasaMinima > epsilon) {
      const tasaMedia = (tasaMinima + tasaMaxima) / 2;
      let valorNetoActual = 0;

      for (const resultado of resultados) {
        let tasaPeriodo;

        if (tipoTasaInteres === 'nominal') {
          tasaPeriodo = Math.pow(1 + tasaMedia / 100, 1 / 12) - 1;
        } else {
          tasaPeriodo = tasaMedia / 100;
        }

        valorNetoActual += resultado.cuotaMensual / Math.pow(1 + tasaPeriodo, resultado.mes);
      }

      if (valorNetoActual > capital) {
        tasaMaxima = tasaMedia;
      } else {
        tasaMinima = tasaMedia;
      }

      tasaInteres = (tasaMinima + tasaMaxima) / 2;
    }

    return tasaInteres * 100;
  }


private calcularVAN(capital: number, resultados: any[], tipoTasaInteres: string, COK: number): number {
  let VAN = -capital;

  for (const resultado of resultados) {
    let tasaPeriodo;

    if (tipoTasaInteres === 'nominal') {
      tasaPeriodo = Math.pow(1 + resultado.intereses / 100, 1 / 12) - 1;
    } else {
      tasaPeriodo = resultado.intereses / 100;
    }

    VAN += resultado.cuotaMensual / Math.pow(1 + tasaPeriodo, resultado.mes);
  }

  return VAN - capital * Math.pow(1 + COK / 100, -resultados.length);
}
}
