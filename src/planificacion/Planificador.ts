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

  constructor(quantum: number, memoria: ILiberadorMemoria) {
    this.setQuantum(quantum);
    this.setMemoria(memoria);
    this.setCpu([]);
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
}
