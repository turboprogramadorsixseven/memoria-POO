import { AdministradorMemoria } from '../memoria/AdministradorMemoria';
import { IPlanificador } from '../planificacion/IPlanificador';
import { Planificador } from '../planificacion/Planificador';
import { DatosProceso } from '../procesos/DatosProceso';
import { Proceso } from '../procesos/Proceso';
import { exigir, exigirEnteroNoNegativo, exigirEnteroPositivo } from '../util/validacion';
import { ColaDeAdmision } from './ColaDeAdmision';
import { ConfiguracionSimulacion } from './ConfiguracionSimulacion';
import { IAdmision } from './IAdmision';
import { EstadoSistema, ISimulador, Metricas } from './InterfacesSimulador';

export class Simulador {
  private configuracion: ConfiguracionSimulacion;
  private memoria: AdministradorMemoria;
  private planificador: IPlanificador;
  private admision: IAdmision;
  private procesos: Map<string, Proceso>;
  private tickActual: number;
  private metricas: Metricas;

  constructor(configuracion = new ConfiguracionSimulacion()) {
    this.setConfiguracion(configuracion);
    this.setMemoria(
      new AdministradorMemoria(
        this.getConfiguracion().getMemoriaTotal(),
        this.getConfiguracion().getPolitica(),
      ),
    );
    this.setPlanificador(new Planificador(this.getConfiguracion().getQuantum(), this.getMemoria()));
    this.setAdmision(new ColaDeAdmision(this.getMemoria(), this.getPlanificador()));
    this.setProcesos(new Map());
    this.setTickActual(0);
  }

  public getConfiguracion(): ConfiguracionSimulacion {
    return this.configuracion;
  }

  private setConfiguracion(configuracion: ConfiguracionSimulacion): void {
    this.configuracion = configuracion;
  }

  private getMemoria(): AdministradorMemoria {
    return this.memoria;
  }

  private setMemoria(memoria: AdministradorMemoria): void {
    this.memoria = memoria;
  }

  private getPlanificador(): IPlanificador {
    return this.planificador;
  }

  private setPlanificador(planificador: IPlanificador): void {
    this.planificador = planificador;
  }

  private getAdmision(): IAdmision {
    return this.admision;
  }

  private setAdmision(admision: IAdmision): void {
    this.admision = admision;
  }

  private getProcesos(): Map<string, Proceso> {
    return this.procesos;
  }

  private setProcesos(procesos: Map<string, Proceso>): void {
    this.procesos = procesos;
  }

  public getTickActual(): number {
    return this.tickActual;
  }

  private setTickActual(tick: number): void {
    exigirEnteroNoNegativo(tick, 'El tick');
    this.tickActual = tick;
  }

  private getMetricas(): Metricas {
    return this.metricas;
  }

  private setMetricas(metricas: Metricas): void {
    this.metricas = metricas;
  }

  public registrarProceso(pid: string, memoria: number, cpuTotal: number): DatosProceso {
    const proceso = new Proceso(pid, memoria, cpuTotal);
    exigir(!this.getProcesos().has(pid), `PID duplicado: ${pid}`);
    exigir(
      memoria <= this.getConfiguracion().getMemoriaTotal(),
      `${pid} pide mas memoria que la total`,
    );
    this.getProcesos().set(pid, proceso);
    this.getAdmision().agregar(proceso);
    return proceso.obtenerDatos();
  }

  public programarEntradaSalida(pid: string, despuesDeTicksDeCpu: number, duracion: number): void {
    this.buscarProceso(pid).programarEntradaSalida(despuesDeTicksDeCpu, duracion);
  }

  public consultarProceso(pid: string): DatosProceso {
    return this.buscarProceso(pid).obtenerDatos();
  }

  private buscarProceso(pid: string): Proceso {
    exigir(this.getProcesos().has(pid), `No existe el proceso ${pid}`);
    return this.getProcesos().get(pid) as Proceso;
  }

  public obtenerMetricas(): Metricas {
    return { ...this.getMetricas() };
  }
}
