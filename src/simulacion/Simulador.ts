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

export class Simulador implements ISimulador {
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
    this.setMetricas(this.calcularMetricas());
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

  public avanzarTick(): Metricas {
    this.getAdmision().admitirProcesos(); // 1. admision
    this.getPlanificador().actualizarBloqueados(); // 2. bloqueados
    this.getPlanificador().ejecutarTick(); // 3. round robin
    this.setTickActual(this.getTickActual() + 1); // 4. reloj y metricas
    this.setMetricas(this.calcularMetricas());
    return this.obtenerMetricas();
  }

  public avanzarTicks(cantidad: number): Metricas {
    exigirEnteroPositivo(cantidad, 'La cantidad de ticks');
    Array.from({ length: cantidad }).forEach(() => this.avanzarTick());
    return this.obtenerMetricas();
  }

  public obtenerMetricas(): Metricas {
    return { ...this.getMetricas() };
  }

  public obtenerEstado(): EstadoSistema {
    return {
      tick: this.getTickActual(),
      procesoEnCPU: this.getPlanificador().obtenerProcesoEnCPU(),
      nuevos: this.getAdmision().obtenerNuevos(),
      listos: this.getPlanificador().obtenerListos(),
      esperandoMemoria: this.getAdmision().obtenerEsperandoMemoria(),
      bloqueados: this.getPlanificador().obtenerBloqueados(),
      terminados: this.getPlanificador().obtenerTerminados(),
      mapaMemoria: this.getMemoria().obtenerMapa(),
      historialCPU: this.getPlanificador().obtenerHistorialCPU(),
    };
  }

  private calcularMetricas(): Metricas {
    // utilizacion = ticks con cpu ocupada / ticks transcurridos
    const ticksConCpuOcupada = this.getPlanificador().obtenerHistorialCPU().length;
    return {
      ...this.getMemoria().obtenerMetricas(),
      tick: this.getTickActual(),
      utilizacionCPU: (ticksConCpuOcupada * 100) / Math.max(this.getTickActual(), 1),
      cambiosDeContexto: this.getPlanificador().getCambiosDeContexto(),
    };
  }
}
