import { BloqueMemoria } from './BloqueMemoria';

export interface IPoliticaAsignacion {
  getNombre(): string;
  ordenarCandidatos(bloques: BloqueMemoria[], tamanoPedido: number): BloqueMemoria[];
}
