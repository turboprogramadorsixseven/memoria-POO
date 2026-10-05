import { exigir, exigirEnteroNoNegativo, exigirEnteroPositivo } from '../util/validacion';
import { DatosProceso } from './DatosProceso';
import { EstadoProceso } from './EstadoProceso';
import { EventoEntradaSalida } from './EventoEntradaSalida';

export class Proceso {
  private pid: string;
  private memoriaRequerida: number;
  private cpuTotal: number;

  constructor(pid: string, memoriaRequerida: number, cpuTotal: number) {
    this.setPid(pid);
    this.setMemoriaRequerida(memoriaRequerida);
    this.setCpuTotal(cpuTotal);
  }

  public getPid(): string {
    return this.pid;
  }

  private setPid(pid: string): void {
    exigir(pid.trim().length > 0, 'El PID no puede estar vacio');
    this.pid = pid;
  }

  public getMemoriaRequerida(): number {
    return this.memoriaRequerida;
  }

  private setMemoriaRequerida(memoria: number): void {
    exigirEnteroPositivo(memoria, 'La memoria requerida');
    this.memoriaRequerida = memoria;
  }

  public getCpuTotal(): number {
    return this.cpuTotal;
  }

  private setCpuTotal(cpuTotal: number): void {
    exigirEnteroPositivo(cpuTotal, 'El tiempo total de CPU');
    this.cpuTotal = cpuTotal;
  }
}
