import { IAsignadorMemoria } from '../memoria/InterfacesMemoria';
import { IPlanificador } from '../planificacion/IPlanificador';
import { DatosProceso } from '../procesos/DatosProceso';
import { EstadoProceso } from '../procesos/EstadoProceso';
import { Proceso } from '../procesos/Proceso';
import { IAdmision } from './IAdmision';

export class ColaDeAdmision {
  private memoria: IAsignadorMemoria;
  private planificador: IPlanificador;
  private pendientes: Proceso[];

  constructor(memoria: IAsignadorMemoria, planificador: IPlanificador) {
    this.setMemoria(memoria);
    this.setPlanificador(planificador);
    this.setPendientes([]);
  }

  private getMemoria(): IAsignadorMemoria {
    return this.memoria;
  }

  private setMemoria(memoria: IAsignadorMemoria): void {
    this.memoria = memoria;
  }

  private getPlanificador(): IPlanificador {
    return this.planificador;
  }

  private setPlanificador(planificador: IPlanificador): void {
    this.planificador = planificador;
  }

  private getPendientes(): Proceso[] {
    return this.pendientes;
  }

  private setPendientes(pendientes: Proceso[]): void {
    this.pendientes = pendientes;
  }

  public agregar(proceso: Proceso): void {
    this.getPendientes().push(proceso);
  }
}
