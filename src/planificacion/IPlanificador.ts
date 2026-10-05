import { DatosProceso } from '../procesos/DatosProceso';
import { Proceso } from '../procesos/Proceso';

export interface IPlanificador {
  encolar(proceso: Proceso): void;
  actualizarBloqueados(): void;
  ejecutarTick(): void;
  getCambiosDeContexto(): number;
  obtenerProcesoEnCPU(): DatosProceso | undefined;
  obtenerListos(): DatosProceso[];
  obtenerBloqueados(): DatosProceso[];
  obtenerTerminados(): DatosProceso[];
  obtenerHistorialCPU(): string[];
}
