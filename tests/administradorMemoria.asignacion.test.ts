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

  it('si ningun hueco alcanza falla sin tocar los bloques, aunque la suma libre alcance', () => {
    const memoria = memoriaConHuecos(new PoliticaPrimerAjuste());
    const antes = memoria.obtenerMapa();
    expect(memoria.obtenerMetricas().memoriaLibreTotal).toBe(750);
    expect(memoria.asignarMemoria('GRANDE', 500)).toBe(false);
    expect(memoria.obtenerMapa()).toEqual(antes);
  });

  it('rechaza tamanos invalidos y un proceso que ya tiene memoria', () => {
    const memoria = new AdministradorMemoria(100, new PoliticaPrimerAjuste());
    expect(() => memoria.asignarMemoria('P1', 0)).toThrow(/entero positivo/);
    memoria.asignarMemoria('P1', 10);
    expect(() => memoria.asignarMemoria('P1', 10)).toThrow(/ya tiene memoria/);
  });

  it('el mapa es una copia: modificarlo no cambia la memoria real', () => {
    const memoria = new AdministradorMemoria(100, new PoliticaPrimerAjuste());
    const mapa = memoria.obtenerMapa();
    mapa[0].pid = 'INTRUSO';
    mapa.push({ inicio: 100, tamano: 1, fin: 101, libre: true, pid: null });
    expect(resumenMapa(memoria.obtenerMapa())).toEqual(['0-100:libre']);
  });
});
