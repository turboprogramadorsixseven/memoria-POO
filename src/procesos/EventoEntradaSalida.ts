import { exigirEnteroPositivo } from '../util/validacion';

export class EventoEntradaSalida {
  private disparo: number;
  private duracion: number;

  constructor(disparo: number, duracion: number) {
    this.setDisparo(disparo);
    this.setDuracion(duracion);
  }

  public getDisparo(): number {
    return this.disparo;
  }

  private setDisparo(disparo: number): void {
    exigirEnteroPositivo(disparo, 'El disparo de E/S');
    this.disparo = disparo;
  }

  public getDuracion(): number {
    return this.duracion;
  }

  private setDuracion(duracion: number): void {
    exigirEnteroPositivo(duracion, 'La duracion de E/S');
    this.duracion = duracion;
  }
}
