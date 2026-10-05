import { exigir, exigirEnteroPositivo } from '../util/validacion';
import { BloqueMemoria } from './BloqueMemoria';
import { DatosBloque } from './DatosBloque';
import { IAsignadorMemoria, ILiberadorMemoria, MetricasMemoria } from './InterfacesMemoria';
import { IPoliticaAsignacion } from './IPoliticaAsignacion';

export class AdministradorMemoria {
  private tamanoTotal: number;
  private politica: IPoliticaAsignacion;
  private bloques: BloqueMemoria[];

  constructor(tamanoTotal: number, politica: IPoliticaAsignacion) {
    this.setTamanoTotal(tamanoTotal);
    this.setPolitica(politica);
    this.setBloques([new BloqueMemoria(0, tamanoTotal)]);
  }

  public getTamanoTotal(): number {
    return this.tamanoTotal;
  }

  private setTamanoTotal(tamano: number): void {
    exigirEnteroPositivo(tamano, 'La memoria total');
    this.tamanoTotal = tamano;
  }

  public getPolitica(): IPoliticaAsignacion {
    return this.politica;
  }

  private setPolitica(politica: IPoliticaAsignacion): void {
    this.politica = politica;
  }

  private getBloques(): BloqueMemoria[] {
    return this.bloques;
  }

  private setBloques(bloques: BloqueMemoria[]): void {
    this.bloques = bloques;
  }
}
