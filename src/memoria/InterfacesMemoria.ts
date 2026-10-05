export interface MetricasMemoria {
  memoriaTotal: number;
  memoriaOcupada: number;
  memoriaLibreTotal: number;
  mayorBloqueLibre: number;
  ocupacionMemoria: number;
  fragmentacionExterna: number;
}

export interface IAsignadorMemoria {
  asignarMemoria(pid: string, tamano: number): boolean;
}

export interface ILiberadorMemoria {
  liberarMemoria(pid: string): void;
}
