import { AdministradorMemoria } from '../src/memoria/AdministradorMemoria';
import { PoliticaPrimerAjuste } from '../src/memoria/PoliticaPrimerAjuste';
import { resumenMapa } from './helpers';

function memoriaLlena(): AdministradorMemoria {
  const memoria = new AdministradorMemoria(400, new PoliticaPrimerAjuste());
  ['A', 'B', 'C', 'D'].forEach((pid) => memoria.asignarMemoria(pid, 100));
  return memoria;
}

describe('RF05 - AdministradorMemoria: liberacion y coalescencia', () => {
  it('sin vecinos libres, solo marca el bloque como libre', () => {
    const memoria = memoriaLlena();
    memoria.liberarMemoria('B');
    expect(resumenMapa(memoria.obtenerMapa())).toEqual([
      '0-100:A',
      '100-200:libre',
      '200-300:C',
      '300-400:D',
    ]);
  });

  it('se une con el vecino izquierdo', () => {
    const memoria = memoriaLlena();
    memoria.liberarMemoria('A');
    memoria.liberarMemoria('B');
    expect(resumenMapa(memoria.obtenerMapa())).toEqual(['0-200:libre', '200-300:C', '300-400:D']);
  });

  it('se une con el vecino derecho', () => {
    const memoria = memoriaLlena();
    memoria.liberarMemoria('C');
    memoria.liberarMemoria('B');
    expect(resumenMapa(memoria.obtenerMapa())).toEqual(['0-100:A', '100-300:libre', '300-400:D']);
  });

  it('se une con los dos vecinos a la vez', () => {
    const memoria = memoriaLlena();
    memoria.liberarMemoria('A');
    memoria.liberarMemoria('C');
    memoria.liberarMemoria('B');
    expect(resumenMapa(memoria.obtenerMapa())).toEqual(['0-300:libre', '300-400:D']);
  });

  it('al liberar todo queda un unico bloque libre del tamano total', () => {
    const memoria = memoriaLlena();
    ['C', 'A', 'D', 'B'].forEach((pid) => memoria.liberarMemoria(pid));
    expect(resumenMapa(memoria.obtenerMapa())).toEqual(['0-400:libre']);
  });

  it('no mueve los bloques ocupados (no es compactacion)', () => {
    const memoria = memoriaLlena();
    memoria.liberarMemoria('A');
    memoria.liberarMemoria('C');
    const ocupados = memoria.obtenerMapa().filter((bloque) => !bloque.libre);
    expect(ocupados.map((bloque) => bloque.inicio)).toEqual([100, 300]);
  });

  it('rechaza liberar un proceso que no tiene memoria', () => {
    const memoria = memoriaLlena();
    expect(() => memoria.liberarMemoria('Z')).toThrow(/no tiene memoria/);
    memoria.liberarMemoria('A');
    expect(() => memoria.liberarMemoria('A')).toThrow(/no tiene memoria/);
  });
});
