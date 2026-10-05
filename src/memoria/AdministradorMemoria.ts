import { exigir, exigirEnteroPositivo } from '../util/validacion';
import { BloqueMemoria } from './BloqueMemoria';
import { DatosBloque } from './DatosBloque';
import { IAsignadorMemoria, ILiberadorMemoria, MetricasMemoria } from './InterfacesMemoria';
import { IPoliticaAsignacion } from './IPoliticaAsignacion';

export class AdministradorMemoria implements IAsignadorMemoria, ILiberadorMemoria {
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

  public asignarMemoria(pid: string, tamano: number): boolean {
    exigirEnteroPositivo(tamano, 'La memoria pedida');
    exigir(this.buscarBloqueDe(pid) === undefined, `${pid} ya tiene memoria asignada`);
    const candidatos = this.getPolitica().ordenarCandidatos(this.getBloques(), tamano);
    // toma el mejor candidato o ninguno
    const elegido = candidatos.slice(0, 1);
    elegido.forEach((bloque) => this.ocuparBloque(bloque, pid, tamano));
    return elegido.length === 1;
  }

  private ocuparBloque(bloque: BloqueMemoria, pid: string, tamano: number): void {
    const posicion = this.getBloques().indexOf(bloque);
    const sobrante = bloque.asignarA(pid, tamano);
    this.getBloques().splice(posicion + 1, 0, sobrante);
    // descarta el sobrante si mide 0
    this.setBloques(this.getBloques().filter((b) => b.getTamano() > 0));
  }

  public liberarMemoria(pid: string): void {
    const bloque = this.buscarBloqueDe(pid);
    exigir(bloque !== undefined, `${pid} no tiene memoria asignada`);
    (bloque as BloqueMemoria).liberar();
    this.unirBloquesLibresVecinos();
  }

  private unirBloquesLibresVecinos(): void {
    // une los bloques libres que quedaron pegados
    const bloques = this.getBloques();
    const posicionesAUnir = bloques
      .map((_bloque, posicion) => posicion)
      .filter((posicion) => posicion < bloques.length - 1)
      .filter((posicion) => bloques[posicion].puedeUnirseCon(bloques[posicion + 1]))
      .reverse();
    posicionesAUnir.forEach((posicion) => {
      bloques[posicion].unirCon(bloques[posicion + 1]);
      bloques.splice(posicion + 1, 1);
    });
  }

  private buscarBloqueDe(pid: string): BloqueMemoria | undefined {
    return this.getBloques().find((bloque) => bloque.getPid() === pid);
  }

  public obtenerMapa(): DatosBloque[] {
    return this.getBloques().map((bloque) => bloque.obtenerDatos());
  }

  public obtenerMetricas(): MetricasMemoria {
    const tamanosLibres = this.getBloques()
      .filter((bloque) => bloque.estaLibre())
      .map((bloque) => bloque.getTamano());
    const memoriaLibreTotal = tamanosLibres.reduce((suma, tamano) => suma + tamano, 0);
    const mayorBloqueLibre = Math.max(0, ...tamanosLibres);
    const memoriaOcupada = this.getTamanoTotal() - memoriaLibreTotal;
    return {
      memoriaTotal: this.getTamanoTotal(),
      memoriaOcupada,
      memoriaLibreTotal,
      mayorBloqueLibre,
      ocupacionMemoria: (memoriaOcupada * 100) / this.getTamanoTotal(),
      fragmentacionExterna: this.calcularFragmentacion(memoriaLibreTotal, mayorBloqueLibre),
    };
  }

  private calcularFragmentacion(memoriaLibre: number, mayorBloque: number): number {
    // fragmentacion = 100 * (1 - mayor bloque libre / memoria libre)
    return ((memoriaLibre - mayorBloque) * 100) / Math.max(memoriaLibre, 1);
  }
}
