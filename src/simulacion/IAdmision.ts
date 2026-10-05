import { DatosProceso } from '../procesos/DatosProceso';
import { Proceso } from '../procesos/Proceso';

export interface IAdmision {
  agregar(proceso: Proceso): void;
  admitirProcesos(): void;
  obtenerNuevos(): DatosProceso[];
  obtenerEsperandoMemoria(): DatosProceso[];
}
