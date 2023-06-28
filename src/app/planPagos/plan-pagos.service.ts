import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlanPagosService {
  calcularPlanPagos(
    capital: number,
    tasaInteres: number,
    plazo: number,
    periodoGracia: number,
    tipoPlazoGracia: string,
    moneda: string,
    tipoTasaInteres: string
  ): any {
    const resultados: any[] = [];

    let saldoDeuda = capital;
    let totalIntereses = 0;
    let totalPagado = 0;
    let tipoMoneda = moneda === '1' ? 'soles' : 'dolares';
    let VAN = 0;

    const tasaMensual = this.calcularTasaMensual(tasaInteres, tipoTasaInteres);
    const cuotaMensual = this.calcularCuotaMensual(capital, tasaMensual, plazo);

    // Variable para controlar si se ha alcanzado el primer mes
    let primerMesAlcanzado = false;

    for (let mes = 1; mes <= plazo; mes++) {
      let intereses = 0;
      let cuotaCapital = 0;
      let amortizacionCapital = 0;
      let tipoPlazo = "S";

      switch (true) {
        case mes <= periodoGracia && tipoPlazoGracia === 'parcial':
          tipoPlazo = 'P';
          intereses = saldoDeuda * tasaMensual;
          totalIntereses += intereses;
          cuotaCapital = 0; // No hay amortización durante el período de gracia parcial
          amortizacionCapital = 0;
          break;
        case mes <= periodoGracia && tipoPlazoGracia === 'total':
          tipoPlazo = 'T';
          intereses = saldoDeuda * tasaMensual;
          totalIntereses += intereses;
          cuotaCapital = 0; // No hay amortización durante el período de gracia total
          amortizacionCapital = 0;
          break;
        default:
          // Cálculo de intereses y cuotaCapital después del período de gracia
          intereses = saldoDeuda * tasaMensual;
          totalIntereses += intereses;
          cuotaCapital = cuotaMensual - intereses;
          amortizacionCapital = cuotaCapital;
          break;
      }

      saldoDeuda = saldoDeuda - cuotaCapital;
      totalPagado += cuotaCapital + intereses;
      VAN += (cuotaCapital + intereses) / Math.pow(1 + tasaMensual, mes);

      const resultadoMes = {
        mes: mes,
        saldoDeuda: saldoDeuda,
        tipoPlazoGracia: tipoPlazo,
        intereses: intereses,
        amortizacionCapital: amortizacionCapital,
        cuotaCapital: cuotaCapital,
        cuotaMensual: cuotaCapital + intereses,
        tipoMoneda: tipoMoneda
      };

      resultados.push(resultadoMes);
    }

    const TIR = this.calcularTIR(capital, resultados, tipoTasaInteres);

    return {
      resultados: resultados,
      totalIntereses: totalIntereses,
      totalPagado: totalPagado,
      tipoMoneda: tipoMoneda,
      VAN: VAN - capital,
      TIR: TIR
    };
  }

  private calcularTasaMensual(tasaInteres: number, tipoTasaInteres: string): number {
    if (tipoTasaInteres === 'nominal') {
      return Math.pow(1 + tasaInteres / 100, 1 / 12) - 1;
    } else {
      return tasaInteres / 100;
    }
  }

  private calcularCuotaMensual(capital: number, tasaMensual: number, plazo: number): number {
    return capital * (tasaMensual / (1 - Math.pow(1 + tasaMensual, -plazo)));
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
}
