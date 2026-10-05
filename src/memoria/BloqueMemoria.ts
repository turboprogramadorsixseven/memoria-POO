import { exigir, exigirEnteroNoNegativo } from '../util/validacion';
import { DatosBloque } from './DatosBloque';

export class BloqueMemoria {
  private inicio: number;
  private tamano: number;
  private pid: string | null;

  constructor(inicio: number, tamano: number) {
    this.setInicio(inicio);
    this.setTamano(tamano);
    this.setPid(null);
  }

  public getInicio(): number {
    return this.inicio;
  }

  private setInicio(inicio: number): void {
    exigirEnteroNoNegativo(inicio, 'El inicio del bloque');
    this.inicio = inicio;
  }

  public getTamano(): number {
    return this.tamano;
  }

  private setTamano(tamano: number): void {
    exigirEnteroNoNegativo(tamano, 'El tamano del bloque');
    this.tamano = tamano;
  }

  public getPid(): string | null {
    return this.pid;
  }

  private setPid(pid: string | null): void {
    this.pid = pid;
  }

  public getFin(): number {
    return this.getInicio() + this.getTamano();
  }

  public estaLibre(): boolean {
    return this.getPid() === null;
  }
}
