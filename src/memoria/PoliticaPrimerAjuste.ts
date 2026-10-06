import { BloqueMemoria } from './BloqueMemoria';
import { IPoliticaAsignacion } from './IPoliticaAsignacion';

export class PoliticaPrimerAjuste implements IPoliticaAsignacion {
  public getNombre(): string {
    return 'First-Fit';
  }

  public ordenarCandidatos(bloques: BloqueMemoria[], tamanoPedido: number): BloqueMemoria[] {
    // bloques libres que alcanzan, ordenados por direccion
    return bloques
      .filter((bloque) => bloque.estaLibre() && bloque.getTamano() >= tamanoPedido)
      .sort((a, b) => a.getInicio() - b.getInicio());
  }
}
