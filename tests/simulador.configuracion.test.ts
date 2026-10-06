import { PoliticaPrimerAjuste } from '../src/memoria/PoliticaPrimerAjuste';
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
    expect(configuracion.getPolitica()).toBeInstanceOf(PoliticaPrimerAjuste);
  });

  it('la memoria, el quantum y la politica se pueden configurar', () => {
    const politica = new PoliticaPrimerAjuste();
    const configuracion = new ConfiguracionSimulacion(2048, 5, politica);
    expect(configuracion.getMemoriaTotal()).toBe(2048);
    expect(configuracion.getQuantum()).toBe(5);
    expect(configuracion.getPolitica()).toBe(politica);
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

describe('RF02 - Registrar y consultar procesos', () => {
  it('registra procesos como Nuevos y se pueden consultar por PID', () => {
    const simulador = crearSimulador();
    expect(simulador.registrarProceso('P1', 200, 4).estado).toBe(EstadoProceso.NUEVO);
    simulador.registrarProceso('P2', 100, 1);
    expect(pids(simulador.obtenerEstado().nuevos)).toEqual(['P1', 'P2']);
    expect(simulador.consultarProceso('P1')).toMatchObject({ memoriaRequerida: 200, cpuRestante: 4 });
  });

  it('rechaza PID repetidos, procesos mas grandes que la memoria y datos invalidos', () => {
    const simulador = crearSimulador(1024);
    simulador.registrarProceso('P1', 100, 1);
    expect(() => simulador.registrarProceso('P1', 50, 1)).toThrow(/PID duplicado/);
    expect(() => simulador.registrarProceso('P2', 1025, 1)).toThrow(/mas memoria que la total/);
    expect(() => simulador.registrarProceso('P3', 100, 0)).toThrow(ErrorDominio);
    expect(pids(simulador.obtenerEstado().nuevos)).toEqual(['P1']);
  });

  it('acepta un proceso que ocupa exactamente toda la memoria', () => {
    expect(crearSimulador(512).registrarProceso('P1', 512, 1).memoriaRequerida).toBe(512);
  });

  it('consultar un PID que no existe es un error', () => {
    expect(() => crearSimulador().consultarProceso('X')).toThrow(/No existe/);
    expect(() => crearSimulador().programarEntradaSalida('X', 1, 1)).toThrow(/No existe/);
  });
});
