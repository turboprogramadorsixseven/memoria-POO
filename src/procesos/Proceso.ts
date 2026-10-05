import { exigir, exigirEnteroNoNegativo, exigirEnteroPositivo } from '../util/validacion';
import { DatosProceso } from './DatosProceso';
import { EstadoProceso } from './EstadoProceso';
import { EventoEntradaSalida } from './EventoEntradaSalida';

export class Proceso {
  private pid: string;
  private memoriaRequerida: number;
  private cpuTotal: number;
  private cpuRestante: number;
  private estado: EstadoProceso;
  private quantumConsumido: number;
  private tiempoBloqueoRestante: number;
  private eventosES: EventoEntradaSalida[];

  constructor(pid: string, memoriaRequerida: number, cpuTotal: number) {
    this.setPid(pid);
    this.setMemoriaRequerida(memoriaRequerida);
    this.setCpuTotal(cpuTotal);
    this.setCpuRestante(cpuTotal);
    this.setEstado(EstadoProceso.NUEVO);
    this.setQuantumConsumido(0);
    this.setTiempoBloqueoRestante(0);
    this.setEventosES([]);
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

  public getCpuRestante(): number {
    return this.cpuRestante;
  }

  private setCpuRestante(cpuRestante: number): void {
    exigirEnteroNoNegativo(cpuRestante, 'La CPU restante');
    this.cpuRestante = cpuRestante;
  }

  public getEstado(): EstadoProceso {
    return this.estado;
  }

  private setEstado(estado: EstadoProceso): void {
    this.estado = estado;
  }

  public getQuantumConsumido(): number {
    return this.quantumConsumido;
  }

  private setQuantumConsumido(quantum: number): void {
    exigirEnteroNoNegativo(quantum, 'El quantum consumido');
    this.quantumConsumido = quantum;
  }

  public getTiempoBloqueoRestante(): number {
    return this.tiempoBloqueoRestante;
  }

  private setTiempoBloqueoRestante(tiempo: number): void {
    exigirEnteroNoNegativo(tiempo, 'El tiempo de bloqueo restante');
    this.tiempoBloqueoRestante = tiempo;
  }

  private getEventosES(): EventoEntradaSalida[] {
    return this.eventosES;
  }

  private setEventosES(eventos: EventoEntradaSalida[]): void {
    this.eventosES = eventos;
  }

  public getCpuConsumida(): number {
    return this.getCpuTotal() - this.getCpuRestante();
  }

  public terminoSuCpu(): boolean {
    return this.getCpuRestante() === 0;
  }

  public agotoQuantum(limite: number): boolean {
    return this.getQuantumConsumido() >= limite;
  }

  public terminoSuBloqueo(): boolean {
    return this.getTiempoBloqueoRestante() === 0;
  }

  public obtenerDatos(): DatosProceso {
    return {
      pid: this.getPid(),
      memoriaRequerida: this.getMemoriaRequerida(),
      cpuTotal: this.getCpuTotal(),
      cpuRestante: this.getCpuRestante(),
      estado: this.getEstado(),
      quantumConsumido: this.getQuantumConsumido(),
      tiempoBloqueoRestante: this.getTiempoBloqueoRestante(),
    };
  }

  public ejecutarUnTick(): void {
    exigir(this.getEstado() === EstadoProceso.EJECUTANDO, `${this.getPid()} no esta ejecutando`);
    this.setCpuRestante(this.getCpuRestante() - 1);
    this.setQuantumConsumido(this.getQuantumConsumido() + 1);
  }
}
