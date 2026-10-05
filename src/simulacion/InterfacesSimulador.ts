import { DatosBloque } from '../memoria/DatosBloque';
import { MetricasMemoria } from '../memoria/InterfacesMemoria';
import { DatosProceso } from '../procesos/DatosProceso';

export interface Metricas extends MetricasMemoria {
  tick: number;
  utilizacionCPU: number;
  cambiosDeContexto: number;
}

export interface EstadoSistema {
  tick: number;
  procesoEnCPU: DatosProceso | undefined;
  nuevos: DatosProceso[];
  listos: DatosProceso[];
  esperandoMemoria: DatosProceso[];
  bloqueados: DatosProceso[];
  terminados: DatosProceso[];
  mapaMemoria: DatosBloque[];
  historialCPU: string[];
}

export interface ISimulador {
  registrarProceso(pid: string, memoria: number, cpuTotal: number): DatosProceso;
  programarEntradaSalida(pid: string, despuesDeTicksDeCpu: number, duracion: number): void;
  avanzarTick(): Metricas;
  avanzarTicks(cantidad: number): Metricas;
  consultarProceso(pid: string): DatosProceso;
  obtenerMetricas(): Metricas;
  obtenerEstado(): EstadoSistema;
}
