import { EstadoProceso } from '../src/procesos/EstadoProceso';
import { Simulador } from '../src/simulacion/Simulador';
import { crearSimulador, pids } from './helpers';

function casoDeLaCatedra(): Simulador {
  const simulador = crearSimulador(1024, 2);
  simulador.registrarProceso('P1', 200, 4);
  simulador.registrarProceso('P2', 350, 3);
  simulador.registrarProceso('P3', 150, 2);
  simulador.registrarProceso('P4', 400, 3);
  return simulador;
}

describe('RF06 - Avanzar un tick de forma determinista', () => {
  it('cada llamada avanza exactamente un tick', () => {
    const simulador = crearSimulador();
    expect(simulador.avanzarTick().tick).toBe(1);
    expect(simulador.avanzarTicks(4).tick).toBe(5);
    expect(simulador.getTickActual()).toBe(5);
  });

  it('rechaza avanzar una cantidad invalida de ticks', () => {
    expect(() => crearSimulador().avanzarTicks(0)).toThrow(/entero positivo/);
  });

  it('con los mismos datos siempre da el mismo resultado', () => {
    const primera = casoDeLaCatedra();
    const segunda = casoDeLaCatedra();
    primera.avanzarTicks(12);
    segunda.avanzarTicks(12);
    expect(primera.obtenerEstado()).toEqual(segunda.obtenerEstado());
  });
});

describe('RF07 - Planificar la CPU con Round-Robin (simulador completo)', () => {
  it('Q=2, P1 con CPU 3 y P2 con CPU 2: P1, P1, P2, P2, P1 y un cambio de contexto', () => {
    const simulador = crearSimulador(1024, 2);
    simulador.registrarProceso('P1', 100, 3);
    simulador.registrarProceso('P2', 100, 2);
    const metricas = simulador.avanzarTicks(5);
    expect(simulador.obtenerEstado().historialCPU).toEqual(['P1', 'P1', 'P2', 'P2', 'P1']);
    expect(metricas.cambiosDeContexto).toBe(1);
    expect(pids(simulador.obtenerEstado().terminados)).toEqual(['P2', 'P1']);
  });

  it('un unico proceso renueva su quantum sin cambio de contexto', () => {
    const simulador = crearSimulador(1024, 2);
    simulador.registrarProceso('P1', 100, 5);
    expect(simulador.avanzarTicks(5).cambiosDeContexto).toBe(0);
    expect(simulador.obtenerEstado().historialCPU).toEqual(['P1', 'P1', 'P1', 'P1', 'P1']);
  });

  it('si termina justo al agotar el quantum no vuelve a la cola', () => {
    const simulador = crearSimulador(1024, 2);
    simulador.registrarProceso('P1', 100, 2);
    simulador.registrarProceso('P2', 100, 3);
    simulador.avanzarTicks(2);
    expect(simulador.consultarProceso('P1').estado).toBe(EstadoProceso.TERMINADO);
    expect(pids(simulador.obtenerEstado().listos)).toEqual(['P2']);
    expect(simulador.obtenerMetricas().cambiosDeContexto).toBe(0);
  });

  it('caso de la catedra (First-Fit, Q=2, 12 ticks)', () => {
    const simulador = casoDeLaCatedra();
    const metricas = simulador.avanzarTicks(12);
    expect(simulador.obtenerEstado().historialCPU.join(' ')).toBe(
      'P1 P1 P2 P2 P3 P3 P1 P1 P2 P4 P4 P4',
    );
    expect(metricas.utilizacionCPU).toBe(100);
    expect(metricas.cambiosDeContexto).toBe(2);
    expect(metricas.memoriaLibreTotal).toBe(1024);
  });
});
