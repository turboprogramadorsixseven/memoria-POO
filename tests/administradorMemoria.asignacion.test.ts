import { AdministradorMemoria } from '../src/memoria/AdministradorMemoria';
import { IPoliticaAsignacion } from '../src/memoria/IPoliticaAsignacion';
import { PoliticaMejorAjuste } from '../src/memoria/PoliticaMejorAjuste';
import { PoliticaPeorAjuste } from '../src/memoria/PoliticaPeorAjuste';
import { PoliticaPrimerAjuste } from '../src/memoria/PoliticaPrimerAjuste';
import { resumenMapa } from './helpers';

function memoriaConHuecos(politica: IPoliticaAsignacion): AdministradorMemoria {
  const memoria = new AdministradorMemoria(1000, politica);
  memoria.asignarMemoria('A', 100);
  memoria.asignarMemoria('B', 200);
  memoria.asignarMemoria('C', 100);
  memoria.asignarMemoria('D', 400);
  memoria.asignarMemoria('E', 50);
  memoria.liberarMemoria('B');
  memoria.liberarMemoria('D');
  return memoria;
}

describe('RF01/RF04 - AdministradorMemoria: asignacion contigua', () => {
  it('empieza con un unico bloque libre que ocupa toda la memoria', () => {
    const memoria = new AdministradorMemoria(1024, new PoliticaPrimerAjuste());
    expect(resumenMapa(memoria.obtenerMapa())).toEqual(['0-1024:libre']);
  });

  it('rechaza un tamano total invalido', () => {
    expect(() => new AdministradorMemoria(0, new PoliticaPrimerAjuste())).toThrow(/entero positivo/);
  });

  it('particion parcial y ajuste exacto (sin bloques de tamano cero)', () => {
    const memoria = new AdministradorMemoria(500, new PoliticaPrimerAjuste());
    expect(memoria.asignarMemoria('P1', 200)).toBe(true);
    expect(resumenMapa(memoria.obtenerMapa())).toEqual(['0-200:P1', '200-500:libre']);
    expect(memoria.asignarMemoria('P2', 300)).toBe(true);
    expect(resumenMapa(memoria.obtenerMapa())).toEqual(['0-200:P1', '200-500:P2']);
  });

  it.each<[string, IPoliticaAsignacion, string]>([
    ['First-Fit', new PoliticaPrimerAjuste(), '100-250:N'],
    ['Best-Fit', new PoliticaMejorAjuste(), '850-1000:N'],
    ['Worst-Fit', new PoliticaPeorAjuste(), '400-550:N'],
  ])('elige el bloque segun la politica: %s', (_nombre, politica, esperado) => {
    const memoria = memoriaConHuecos(politica);
    memoria.asignarMemoria('N', 150);
    expect(resumenMapa(memoria.obtenerMapa())).toContain(esperado);
  });
});
