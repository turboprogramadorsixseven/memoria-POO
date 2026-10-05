import { EstadoProceso } from './EstadoProceso';

export interface DatosProceso {
  pid: string;
  memoriaRequerida: number;
  cpuTotal: number;
  cpuRestante: number;
  estado: EstadoProceso;
  quantumConsumido: number;
  tiempoBloqueoRestante: number;
}
