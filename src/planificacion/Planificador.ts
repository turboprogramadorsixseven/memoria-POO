import { ILiberadorMemoria } from '../memoria/InterfacesMemoria';
import { DatosProceso } from '../procesos/DatosProceso';
import { EstadoProceso } from '../procesos/EstadoProceso';
import { Proceso } from '../procesos/Proceso';
import { exigir, exigirEnteroNoNegativo, exigirEnteroPositivo } from '../util/validacion';
import { IPlanificador } from './IPlanificador';

type Regla = [condicion: boolean, accion: () => void];

export class Planificador implements IPlanificador {
  private quantum: number;
  private memoria: ILiberadorMemoria;
  private cpu: Proceso[];
  private colaListos: Proceso[];
  private bloqueados: Proceso[];
  private terminados: Proceso[];
  private cambiosDeContexto: number;
  private historialCPU: string[];

  constructor(quantum: number, memoria: ILiberadorMemoria) {
    this.setQuantum(quantum);
    this.setMemoria(memoria);
    this.setCpu([]);
    this.setColaListos([]);
    this.setBloqueados([]);
    this.setTerminados([]);
    this.setCambiosDeContexto(0);
    this.setHistorialCPU([]);
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

  private getHistorialCPU(): string[] {
    return this.historialCPU;
  }

  private setHistorialCPU(historial: string[]): void {
    this.historialCPU = historial;
  }

  public encolar(proceso: Proceso): void {
    exigir(proceso.getEstado() === EstadoProceso.LISTO, `${proceso.getPid()} no esta Listo`);
    exigir(!this.getColaListos().includes(proceso), `${proceso.getPid()} ya esta en la cola`);
    this.getColaListos().push(proceso);
  }

  public actualizarBloqueados(): void {
    this.getBloqueados().forEach((proceso) => proceso.avanzarBloqueo());
    const terminaronSuES = this.getBloqueados().filter((proceso) => proceso.terminoSuBloqueo());
    this.setBloqueados(this.getBloqueados().filter((proceso) => !proceso.terminoSuBloqueo()));
    terminaronSuES.forEach((proceso) => {
      proceso.desbloquear();
      this.getColaListos().push(proceso);
    });
  }

  public ejecutarTick(): void {
    this.despacharSiLaCpuEstaLibre();
    [...this.getCpu()].forEach((proceso) => {
      proceso.ejecutarUnTick();
      this.getHistorialCPU().push(proceso.getPid());
      this.decidirQueSigue(proceso)();
    });
  }

  private despacharSiLaCpuEstaLibre(): void {
    // si la cpu esta libre toma el primero de la cola
    const lugaresLibres = 1 - this.getCpu().length;
    const despachados = this.getColaListos().splice(0, lugaresLibres);
    despachados.forEach((proceso) => {
      proceso.despachar();
      this.getCpu().push(proceso);
    });
  }

  private decidirQueSigue(proceso: Proceso): () => void {
    const agotoQuantum = proceso.agotoQuantum(this.getQuantum());
    const hayOtrosListos = this.getColaListos().length > 0;
    // reglas en orden: terminar, bloquear por E/S, expulsar, renovar quantum, seguir
    const reglas: Regla[] = [
      [proceso.terminoSuCpu(), () => this.finalizar(proceso)],
      [proceso.tieneEntradaSalidaAhora(), () => this.bloquear(proceso)],
      [agotoQuantum && hayOtrosListos, () => this.expulsar(proceso)],
      [agotoQuantum, () => proceso.renovarQuantum()],
      [true, () => undefined],
    ];
    const reglasQueSeCumplen = reglas.filter(([condicion]) => condicion);
    return reglasQueSeCumplen[0][1];
  }

  private finalizar(proceso: Proceso): void {
    this.liberarCpu();
    proceso.terminar();
    this.getMemoria().liberarMemoria(proceso.getPid());
    this.getTerminados().push(proceso);
  }

  private bloquear(proceso: Proceso): void {
    this.liberarCpu();
    proceso.bloquear();
    this.getBloqueados().push(proceso);
    this.setCambiosDeContexto(this.getCambiosDeContexto() + 1);
  }

  private expulsar(proceso: Proceso): void {
    this.liberarCpu();
    proceso.expulsar();
    this.getColaListos().push(proceso);
    this.setCambiosDeContexto(this.getCambiosDeContexto() + 1);
  }

  private liberarCpu(): void {
    this.setCpu([]);
  }

  public obtenerProcesoEnCPU(): DatosProceso | undefined {
    return this.getCpu().map((proceso) => proceso.obtenerDatos())[0];
  }

  public obtenerListos(): DatosProceso[] {
    return this.getColaListos().map((proceso) => proceso.obtenerDatos());
  }

  public obtenerBloqueados(): DatosProceso[] {
    return this.getBloqueados().map((proceso) => proceso.obtenerDatos());
  }

  public obtenerTerminados(): DatosProceso[] {
    return this.getTerminados().map((proceso) => proceso.obtenerDatos());
  }

  public obtenerHistorialCPU(): string[] {
    return [...this.getHistorialCPU()];
  }
}
