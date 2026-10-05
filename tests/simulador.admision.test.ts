import { IPoliticaAsignacion } from '../src/memoria/IPoliticaAsignacion';
import { PoliticaMejorAjuste } from '../src/memoria/PoliticaMejorAjuste';
import { PoliticaPeorAjuste } from '../src/memoria/PoliticaPeorAjuste';
import { PoliticaPrimerAjuste } from '../src/memoria/PoliticaPrimerAjuste';
import { EstadoProceso } from '../src/procesos/EstadoProceso';
import { crearSimulador, pids, resumenMapa } from './helpers';

describe('RF03 - Estados y admision', () => {
  it('al admitir le da memoria y lo pone en Listos; si no entra, queda Esperando Memoria', () => {
    const simulador = crearSimulador(1024);
    simulador.registrarProceso('P1', 200, 4);
    simulador.registrarProceso('P2', 350, 3);
    simulador.registrarProceso('P3', 150, 2);
    simulador.registrarProceso('P4', 400, 3);
    simulador.avanzarTick();
    const estado = simulador.obtenerEstado();
    expect(estado.procesoEnCPU?.pid).toBe('P1');
    expect(pids(estado.listos)).toEqual(['P2', 'P3']);
    expect(pids(estado.esperandoMemoria)).toEqual(['P4']);
    expect(simulador.consultarProceso('P4').estado).toBe(EstadoProceso.ESPERANDO_MEMORIA);
  });

  it('un proceso que no entra no impide que entren los siguientes que si caben', () => {
    const simulador = crearSimulador(500);
    simulador.registrarProceso('P1', 300, 5);
    simulador.registrarProceso('GRANDE', 400, 1);
    simulador.registrarProceso('CHICO', 100, 1);
    simulador.avanzarTick();
    expect(pids(simulador.obtenerEstado().esperandoMemoria)).toEqual(['GRANDE']);
    expect(pids(simulador.obtenerEstado().listos)).toEqual(['CHICO']);
  });

  it('reintenta en cada tick y lo admite cuando se libera memoria', () => {
    const simulador = crearSimulador(500);
    simulador.registrarProceso('P1', 300, 2);
    simulador.registrarProceso('P2', 400, 1);
    simulador.avanzarTicks(2);
    expect(simulador.consultarProceso('P1').estado).toBe(EstadoProceso.TERMINADO);
    expect(simulador.consultarProceso('P2').estado).toBe(EstadoProceso.ESPERANDO_MEMORIA);
    simulador.avanzarTick();
    expect(simulador.consultarProceso('P2').estado).toBe(EstadoProceso.TERMINADO);
    expect(simulador.obtenerEstado().historialCPU).toEqual(['P1', 'P1', 'P2']);
  });

  it('un proceso Terminado no vuelve a ninguna cola', () => {
    const simulador = crearSimulador();
    simulador.registrarProceso('P1', 100, 1);
    simulador.avanzarTicks(3);
    const estado = simulador.obtenerEstado();
    expect(pids(estado.terminados)).toEqual(['P1']);
    expect([...estado.listos, ...estado.bloqueados, ...estado.esperandoMemoria]).toEqual([]);
  });

  it.each<[string, IPoliticaAsignacion, string]>([
    ['First-Fit', new PoliticaPrimerAjuste(), '100-200:N'],
    ['Best-Fit', new PoliticaMejorAjuste(), '900-1000:N'],
    ['Worst-Fit', new PoliticaPeorAjuste(), '400-500:N'],
  ])('la politica se elige al configurar y se respeta: %s', (_nombre, politica, esperado) => {
    const simulador = crearSimulador(1000, 1, politica);
    simulador.registrarProceso('A', 100, 5);
    simulador.registrarProceso('B', 200, 1);
    simulador.registrarProceso('C', 100, 5);
    simulador.registrarProceso('D', 400, 1);
    simulador.registrarProceso('E', 100, 5);
    simulador.avanzarTicks(4);
    simulador.registrarProceso('N', 100, 1);
    simulador.avanzarTick();
    expect(resumenMapa(simulador.obtenerEstado().mapaMemoria)).toContain(esperado);
  });
});
