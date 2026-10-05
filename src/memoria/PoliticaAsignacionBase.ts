import { BloqueMemoria } from './BloqueMemoria';
import { IPoliticaAsignacion } from './IPoliticaAsignacion';

export abstract class PoliticaAsignacionBase implements IPoliticaAsignacion {
  public abstract getNombre(): string;

  public ordenarCandidatos(bloques: BloqueMemoria[], tamanoPedido: number): BloqueMemoria[] {
    // ordena por direccion y despues por el criterio de cada politica
    return this.filtrarBloquesAptos(bloques, tamanoPedido)
      .sort((a, b) => a.getInicio() - b.getInicio())
      .sort((a, b) => this.comparar(a, b));
  }

  protected filtrarBloquesAptos(bloques: BloqueMemoria[], tamanoPedido: number): BloqueMemoria[] {
    return bloques.filter((bloque) => bloque.estaLibre() && bloque.getTamano() >= tamanoPedido);
  }

  protected abstract comparar(a: BloqueMemoria, b: BloqueMemoria): number;
}
