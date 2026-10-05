export class ErrorDominio extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'ErrorDominio';
  }
}

export function exigir(condicion: boolean, mensaje: string): void {
  // lanza el error solo si la condicion es falsa
  [condicion]
    .filter((seCumple) => seCumple === false)
    .forEach(() => {
      throw new ErrorDominio(mensaje);
    });
}

export function exigirEnteroPositivo(valor: number, nombre: string): void {
  exigir(Number.isInteger(valor) && valor > 0, `${nombre} debe ser un entero positivo`);
}

export function exigirEnteroNoNegativo(valor: number, nombre: string): void {
  exigir(Number.isInteger(valor) && valor >= 0, `${nombre} no puede ser negativo`);
}
