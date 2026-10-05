import { DatosBloque } from '../src/memoria/DatosBloque';
import { DatosProceso } from '../src/procesos/DatosProceso';

export function pids(procesos: DatosProceso[]): string[] {
  return procesos.map((proceso) => proceso.pid);
}

export function resumenMapa(mapa: DatosBloque[]): string[] {
  return mapa.map((bloque) => `${bloque.inicio}-${bloque.fin}:${bloque.pid ?? 'libre'}`);
}
