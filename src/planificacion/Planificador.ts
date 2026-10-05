import { ILiberadorMemoria } from '../memoria/InterfacesMemoria';
import { DatosProceso } from '../procesos/DatosProceso';
import { EstadoProceso } from '../procesos/EstadoProceso';
import { Proceso } from '../procesos/Proceso';
import { exigir, exigirEnteroNoNegativo, exigirEnteroPositivo } from '../util/validacion';
import { IPlanificador } from './IPlanificador';

type Regla = [condicion: boolean, accion: () => void];

export class Planificador {
  private quantum: number;
  private memoria: ILiberadorMemoria;
  private cpu: Proceso[];
  private colaListos: Proceso[];
  private bloqueados: Proceso[];
  private terminados: Proceso[];
  private cambiosDeContexto: number;

  constructor(quantum: number, memoria: ILiberadorMemoria) {
    this.setQuantum(quantum);
    this.setMemoria(memoria);
    this.setCpu([]);
    this.setColaListos([]);
    this.setBloqueados([]);
    this.setTerminados([]);
    this.setCambiosDeContexto(0);
  }

  public getQuantum(): number {
    return this.quantum;
  }

  private setQuantum(quantum: number): void {
    exigirEnteroPositivo(quantum, 'El quantum');
    this.quantum = quantum;
  }

  private getMemoria(): ILiberadorMemoria {
    return this.memoria;
  }

  private setMemoria(memoria: ILiberadorMemoria): void {
    this.memoria = memoria;
  }

  private getCpu(): Proceso[] {
    return this.cpu;
  }

  private setCpu(cpu: Proceso[]): void {
    this.cpu = cpu;
  }

  private getColaListos(): Proceso[] {
    return this.colaListos;
  }

  private setColaListos(cola: Proceso[]): void {
    this.colaListos = cola;
  }

  private getBloqueados(): Proceso[] {
    return this.bloqueados;
  }

  private setBloqueados(bloqueados: Proceso[]): void {
    this.bloqueados = bloqueados;
  }

  private getTerminados(): Proceso[] {
    return this.terminados;
  }

  private setTerminados(terminados: Proceso[]): void {
    this.terminados = terminados;
  }

  public getCambiosDeContexto(): number {
    return this.cambiosDeContexto;
  }

  private setCambiosDeContexto(cantidad: number): void {
    exigirEnteroNoNegativo(cantidad, 'Los cambios de contexto');
    this.cambiosDeContexto = cantidad;
  }
}
