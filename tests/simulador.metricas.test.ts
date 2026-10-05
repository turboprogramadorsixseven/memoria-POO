import { crearSimulador } from './helpers';

describe('RF09 - Metricas consultables', () => {
  it('en el tick 0: CPU 0 %, memoria libre y sin fragmentacion', () => {
    expect(crearSimulador().obtenerMetricas()).toEqual({
      tick: 0,
      utilizacionCPU: 0,
      cambiosDeContexto: 0,
      memoriaTotal: 1024,
      memoriaOcupada: 0,
      memoriaLibreTotal: 1024,
      mayorBloqueLibre: 1024,
      ocupacionMemoria: 0,
      fragmentacionExterna: 0,
    });
  });

  it('memoria llena: 100 % de ocupacion y 0 % de fragmentacion', () => {
    const simulador = crearSimulador(1024);
    simulador.registrarProceso('P1', 1024, 5);
    expect(simulador.avanzarTick()).toMatchObject({
      ocupacionMemoria: 100,
      memoriaLibreTotal: 0,
      mayorBloqueLibre: 0,
      fragmentacionExterna: 0,
      utilizacionCPU: 100,
    });
  });

  it('huecos separados de 100 y 300 KB: libre 400, mayor 300, fragmentacion 25 %', () => {
    const simulador = crearSimulador(600, 1);
    simulador.registrarProceso('A', 100, 1);
    simulador.registrarProceso('B', 200, 9);
    simulador.registrarProceso('C', 300, 1);
    expect(simulador.avanzarTicks(3)).toMatchObject({
      memoriaLibreTotal: 400,
      mayorBloqueLibre: 300,
      fragmentacionExterna: 25,
    });
  });
});
