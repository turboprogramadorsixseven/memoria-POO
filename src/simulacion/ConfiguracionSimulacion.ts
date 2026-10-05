import { IPoliticaAsignacion } from '../memoria/IPoliticaAsignacion';
import { PoliticaPrimerAjuste } from '../memoria/PoliticaPrimerAjuste';
import { exigirEnteroPositivo } from '../util/validacion';

export class ConfiguracionSimulacion {
  private memoriaTotal: number;
  private quantum: number;
  private politica: IPoliticaAsignacion;

  constructor(
    memoriaTotal = 1024,
    quantum = 2,
    politica: IPoliticaAsignacion = new PoliticaPrimerAjuste(),
  ) {
    this.setMemoriaTotal(memoriaTotal);
    this.setQuantum(quantum);
    this.setPolitica(politica);
  }

  public getMemoriaTotal(): number {
    return this.memoriaTotal;
  }

  private setMemoriaTotal(memoriaTotal: number): void {
    exigirEnteroPositivo(memoriaTotal, 'La memoria total');
    this.memoriaTotal = memoriaTotal;
  }

  public getQuantum(): number {
    return this.quantum;
  }

  private setQuantum(quantum: number): void {
    exigirEnteroPositivo(quantum, 'El quantum');
    this.quantum = quantum;
  }

  public getPolitica(): IPoliticaAsignacion {
    return this.politica;
  }

  private setPolitica(politica: IPoliticaAsignacion): void {
    this.politica = politica;
  }
}
