import { crearSimulador, pids, verificarInvariantes } from './helpers';

describe('RF10 - Consultar el estado del sistema', () => {
  it('muestra tick, CPU, Listos, en espera, bloqueados, terminados y mapa de memoria', () => {
    const simulador = crearSimulador(500, 2);
    simulador.registrarProceso('P1', 300, 3);
    simulador.registrarProceso('P2', 100, 1);
    simulador.registrarProceso('P3', 300, 1);
    simulador.programarEntradaSalida('P1', 1, 5);
    simulador.avanzarTick();
    const estado = simulador.obtenerEstado();
    expect(estado.tick).toBe(1);
    expect(estado.procesoEnCPU).toBeUndefined();
    expect(pids(estado.bloqueados)).toEqual(['P1']);
    expect(pids(estado.listos)).toEqual(['P2']);
    expect(pids(estado.esperandoMemoria)).toEqual(['P3']);
    simulador.avanzarTick();
    expect(pids(simulador.obtenerEstado().terminados)).toEqual(['P2']);
  });

  it('devuelve copias: modificarlas no cambia el simulador', () => {
    const simulador = crearSimulador();
    simulador.registrarProceso('P1', 100, 5);
    simulador.registrarProceso('P2', 100, 5);
    simulador.avanzarTick();
    const estado = simulador.obtenerEstado();
    estado.listos.pop();
    estado.historialCPU.push('INTRUSO');
    estado.mapaMemoria[0].pid = 'INTRUSO';
    const otraVez = simulador.obtenerEstado();
    expect(pids(otraVez.listos)).toEqual(['P2']);
    expect(otraVez.historialCPU).toEqual(['P1']);
    expect(otraVez.mapaMemoria[0].pid).toBe('P1');
  });
});

describe('Orden de las fases e invariantes', () => {
  it('la memoria liberada al final de un tick recien se usa en la admision del siguiente', () => {
    const simulador = crearSimulador(1024, 2);
    simulador.registrarProceso('P1', 1024, 1);
    simulador.registrarProceso('P2', 100, 1);
    simulador.avanzarTick();
    expect(simulador.obtenerMetricas().memoriaLibreTotal).toBe(1024);
    expect(pids(simulador.obtenerEstado().esperandoMemoria)).toEqual(['P2']);
    simulador.avanzarTick();
    expect(simulador.obtenerEstado().historialCPU).toEqual(['P1', 'P2']);
  });
});
