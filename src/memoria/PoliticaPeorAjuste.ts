import { BloqueMemoria } from './BloqueMemoria';
import { PoliticaAsignacionBase } from './PoliticaAsignacionBase';

export class PoliticaPeorAjuste extends PoliticaAsignacionBase {
  public getNombre(): string {
    return 'Worst-Fit';
  }

  protected comparar(a: BloqueMemoria, b: BloqueMemoria): number {
    return b.getTamano() - a.getTamano();
  }
}
