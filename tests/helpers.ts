import { DatosBloque } from '../src/memoria/DatosBloque';
import { IPoliticaAsignacion } from '../src/memoria/IPoliticaAsignacion';
import { DatosProceso } from '../src/procesos/DatosProceso';
import { ConfiguracionSimulacion } from '../src/simulacion/ConfiguracionSimulacion';
import { EstadoSistema } from '../src/simulacion/InterfacesSimulador';
import { Simulador } from '../src/simulacion/Simulador';

export function pids(procesos: DatosProceso[]): string[] {
  return procesos.map((proceso) => proceso.pid);
}

export function crearSimulador(
  memoria = 1024,
  quantum = 2,
  politica?: IPoliticaAsignacion,
): Simulador {
  return new Simulador(new ConfiguracionSimulacion(memoria, quantum, politica));
}

export function resumenMapa(mapa: DatosBloque[]): string[] {
  return mapa.map((bloque) => `${bloque.inicio}-${bloque.fin}:${bloque.pid ?? 'libre'}`);
}

export function verificarInvariantes(estado: EstadoSistema, memoriaTotal: number): void {
  const todos = [
    ...estado.nuevos,
    ...estado.listos,
    ...estado.esperandoMemoria,
    ...estado.bloqueados,
    ...estado.terminados,
    ...[estado.procesoEnCPU].filter((proceso) => proceso !== undefined),
  ] as DatosProceso[];
  expect(new Set(pids(todos)).size).toBe(todos.length);
  const mapa = estado.mapaMemoria;
  expect(mapa[0].inicio).toBe(0);
  mapa.slice(1).forEach((bloque, i) => expect(bloque.inicio).toBe(mapa[i].fin));
  expect(mapa[mapa.length - 1].fin).toBe(memoriaTotal);
  mapa.slice(1).forEach((bloque, i) => expect(bloque.libre && mapa[i].libre).toBe(false));
}
