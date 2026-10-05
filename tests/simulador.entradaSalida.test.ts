import { EstadoProceso } from '../src/procesos/EstadoProceso';
import { crearSimulador, pids, resumenMapa } from './helpers';

describe('RF08 - Simular Entrada y Salida (simulador completo)', () => {
  it('se bloquea, conserva su memoria, no usa CPU y vuelve a Listos al terminar la E/S', () => {
    const simulador = crearSimulador(1024, 2);
    simulador.registrarProceso('P1', 200, 4);
    simulador.registrarProceso('P2', 100, 2);
    simulador.programarEntradaSalida('P1', 1, 2);

    simulador.avanzarTick();
    expect(simulador.consultarProceso('P1')).toMatchObject({
      estado: EstadoProceso.BLOQUEADO,
      cpuRestante: 3,
      tiempoBloqueoRestante: 2,
    });
    expect(resumenMapa(simulador.obtenerEstado().mapaMemoria)).toContain('0-200:P1');
    expect(simulador.obtenerMetricas().cambiosDeContexto).toBe(1);

    simulador.avanzarTick();
    expect(simulador.consultarProceso('P1')).toMatchObject({ cpuRestante: 3, tiempoBloqueoRestante: 1 });

    simulador.avanzarTick();
    expect(simulador.obtenerEstado().bloqueados).toEqual([]);
    expect(pids(simulador.obtenerEstado().listos)).toEqual(['P1']);

    simulador.avanzarTicks(3);
    expect(simulador.obtenerEstado().historialCPU).toEqual(['P1', 'P2', 'P2', 'P1', 'P1', 'P1']);
    expect(simulador.obtenerMetricas().cambiosDeContexto).toBe(1);
  });

  it('al terminar la E/S puede ser despachado en ese mismo tick', () => {
    const simulador = crearSimulador(1024, 2);
    simulador.registrarProceso('P1', 100, 3);
    simulador.programarEntradaSalida('P1', 1, 1);
    simulador.avanzarTicks(2);
    expect(simulador.obtenerEstado().historialCPU).toEqual(['P1', 'P1']);
  });

  it('si no hay nadie mas, la CPU queda ociosa mientras dura la E/S', () => {
    const simulador = crearSimulador(1024, 2);
    simulador.registrarProceso('P1', 100, 2);
    simulador.programarEntradaSalida('P1', 1, 2);
    const metricas = simulador.avanzarTicks(4);
    expect(simulador.obtenerEstado().historialCPU).toEqual(['P1', 'P1']);
    expect(metricas.utilizacionCPU).toBe(50);
  });
});
