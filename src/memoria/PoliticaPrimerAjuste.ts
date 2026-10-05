import { PoliticaAsignacionBase } from './PoliticaAsignacionBase';

export class PoliticaPrimerAjuste extends PoliticaAsignacionBase {
  public getNombre(): string {
    return 'First-Fit';
  }

  protected comparar(): number {
    return 0;
  }
}
