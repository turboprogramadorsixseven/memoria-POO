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
});
