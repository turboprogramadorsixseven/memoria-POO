import { PoliticaMejorAjuste } from '../src/memoria/PoliticaMejorAjuste';
import { EstadoProceso } from '../src/procesos/EstadoProceso';
import { ConfiguracionSimulacion } from '../src/simulacion/ConfiguracionSimulacion';
import { Simulador } from '../src/simulacion/Simulador';
import { ErrorDominio } from '../src/util/validacion';
import { crearSimulador, pids, resumenMapa } from './helpers';

describe('RF01 - Configurar e iniciar la simulacion', () => {
  it('por defecto usa 1024 KB, quantum 2 y First-Fit', () => {
    const configuracion = new ConfiguracionSimulacion();
    expect(configuracion.getMemoriaTotal()).toBe(1024);
    expect(configuracion.getQuantum()).toBe(2);
    expect(configuracion.getPolitica().getNombre()).toBe('First-Fit');
  });

  it('la memoria, el quantum y la politica se pueden configurar', () => {
    const configuracion = new ConfiguracionSimulacion(2048, 5, new PoliticaMejorAjuste());
    expect(configuracion.getMemoriaTotal()).toBe(2048);
    expect(configuracion.getQuantum()).toBe(5);
    expect(configuracion.getPolitica().getNombre()).toBe('Best-Fit');
  });

  it('empieza en el tick 0, con un unico bloque libre, colas vacias y contadores en cero', () => {
    const estado = new Simulador().obtenerEstado();
    expect(estado.tick).toBe(0);
    expect(estado.procesoEnCPU).toBeUndefined();
    expect(resumenMapa(estado.mapaMemoria)).toEqual(['0-1024:libre']);
    expect(estado.nuevos).toEqual([]);
    expect(estado.listos).toEqual([]);
    expect(estado.esperandoMemoria).toEqual([]);
    expect(estado.bloqueados).toEqual([]);
    expect(estado.terminados).toEqual([]);
    expect(estado.historialCPU).toEqual([]);
  });

  it.each<[number, number]>([
    [0, 2],
    [-1024, 2],
    [10.5, 2],
    [1024, 0],
    [1024, -2],
    [1024, 1.5],
  ])('rechaza la configuracion invalida memoria=%p quantum=%p', (memoria, quantum) => {
    expect(() => new ConfiguracionSimulacion(memoria, quantum)).toThrow(ErrorDominio);
  });
});
