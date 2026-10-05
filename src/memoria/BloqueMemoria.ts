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

  public asignarA(pid: string, tamanoPedido: number): BloqueMemoria {
    exigir(this.estaLibre(), `El bloque en ${this.getInicio()} ya esta ocupado`);
    exigir(tamanoPedido <= this.getTamano(), 'El bloque es mas chico que lo pedido');
    const sobrante = this.getTamano() - tamanoPedido;
    this.setTamano(tamanoPedido);
    this.setPid(pid);
    return new BloqueMemoria(this.getFin(), sobrante);
  }

  public liberar(): void {
    exigir(!this.estaLibre(), `El bloque en ${this.getInicio()} ya esta libre`);
    this.setPid(null);
  }

  public puedeUnirseCon(siguiente: BloqueMemoria): boolean {
    return this.estaLibre() && siguiente.estaLibre() && this.getFin() === siguiente.getInicio();
  }

  public unirCon(siguiente: BloqueMemoria): void {
    exigir(this.puedeUnirseCon(siguiente), 'Solo se unen bloques libres y contiguos');
    this.setTamano(this.getTamano() + siguiente.getTamano());
  }

  public obtenerDatos(): DatosBloque {
    return {
      inicio: this.getInicio(),
      tamano: this.getTamano(),
      fin: this.getFin(),
      libre: this.estaLibre(),
      pid: this.getPid(),
    };
  }
}
