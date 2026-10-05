import { BloqueMemoria } from './BloqueMemoria';
import { PoliticaAsignacionBase } from './PoliticaAsignacionBase';

export class PoliticaMejorAjuste extends PoliticaAsignacionBase {
  public getNombre(): string {
    return 'Best-Fit';
  }

  protected comparar(a: BloqueMemoria, b: BloqueMemoria): number {
    return a.getTamano() - b.getTamano();
  }
}
