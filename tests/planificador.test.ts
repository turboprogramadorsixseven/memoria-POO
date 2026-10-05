import { ILiberadorMemoria } from '../src/memoria/InterfacesMemoria';
import { Planificador } from '../src/planificacion/Planificador';
import { EstadoProceso } from '../src/procesos/EstadoProceso';
import { Proceso } from '../src/procesos/Proceso';
import { pids } from './helpers';

class MemoriaEspia implements ILiberadorMemoria {
  public liberados: string[] = [];

  public liberarMemoria(pid: string): void {
    this.liberados.push(pid);
  }
}

function procesoListo(pid: string, cpu: number): Proceso {
  const proceso = new Proceso(pid, 10, cpu);
  proceso.admitir();
  return proceso;
}

function correrTicks(planificador: Planificador, ticks: number): void {
  Array.from({ length: ticks }).forEach(() => {
    planificador.actualizarBloqueados();
    planificador.ejecutarTick();
  });
}

describe('RF07 - Planificador Round-Robin', () => {
  it('rechaza un quantum invalido', () => {
    expect(() => new Planificador(0, new MemoriaEspia())).toThrow(/quantum/);
  });

  it('Q=2, P1 con CPU 3 y P2 con CPU 2: P1, P1, P2, P2, P1 y un cambio de contexto', () => {
    const memoria = new MemoriaEspia();
    const planificador = new Planificador(2, memoria);
    planificador.encolar(procesoListo('P1', 3));
    planificador.encolar(procesoListo('P2', 2));
    correrTicks(planificador, 6);
    expect(planificador.obtenerHistorialCPU()).toEqual(['P1', 'P1', 'P2', 'P2', 'P1']);
    expect(planificador.getCambiosDeContexto()).toBe(1);
    expect(pids(planificador.obtenerTerminados())).toEqual(['P2', 'P1']);
    expect(memoria.liberados).toEqual(['P2', 'P1']);
  });

  it('al agotar el quantum con otros Listos vuelve al final de la cola', () => {
    const planificador = new Planificador(1, new MemoriaEspia());
    ['P1', 'P2', 'P3'].forEach((pid) => planificador.encolar(procesoListo(pid, 5)));
    planificador.ejecutarTick();
    expect(pids(planificador.obtenerListos())).toEqual(['P2', 'P3', 'P1']);
    expect(planificador.obtenerProcesoEnCPU()).toBeUndefined();
    expect(planificador.getCambiosDeContexto()).toBe(1);
  });

  it('un unico proceso renueva su quantum sin cambio de contexto', () => {
    const planificador = new Planificador(2, new MemoriaEspia());
    planificador.encolar(procesoListo('P1', 5));
    correrTicks(planificador, 5);
    expect(planificador.obtenerHistorialCPU()).toEqual(['P1', 'P1', 'P1', 'P1', 'P1']);
    expect(planificador.getCambiosDeContexto()).toBe(0);
  });

  it('si termina justo al agotar el quantum no vuelve a la cola', () => {
    const planificador = new Planificador(2, new MemoriaEspia());
    planificador.encolar(procesoListo('P1', 2));
    planificador.encolar(procesoListo('P2', 1));
    correrTicks(planificador, 2);
    expect(pids(planificador.obtenerListos())).toEqual(['P2']);
    expect(planificador.obtenerTerminados()[0].estado).toBe(EstadoProceso.TERMINADO);
    expect(planificador.getCambiosDeContexto()).toBe(0);
  });

  it('cuando un proceso termina, la CPU queda libre hasta el tick siguiente', () => {
    const planificador = new Planificador(2, new MemoriaEspia());
    planificador.encolar(procesoListo('P1', 1));
    planificador.encolar(procesoListo('P2', 1));
    planificador.ejecutarTick();
    expect(planificador.obtenerHistorialCPU()).toEqual(['P1']);
    expect(planificador.obtenerProcesoEnCPU()).toBeUndefined();
    expect(pids(planificador.obtenerListos())).toEqual(['P2']);
  });

  it('solo acepta procesos Listos y sin repetir', () => {
    const planificador = new Planificador(2, new MemoriaEspia());
    expect(() => planificador.encolar(new Proceso('N', 10, 1))).toThrow(/no esta Listo/);
    const proceso = procesoListo('P1', 1);
    planificador.encolar(proceso);
    expect(() => planificador.encolar(proceso)).toThrow(/ya esta en la cola/);
  });
});
