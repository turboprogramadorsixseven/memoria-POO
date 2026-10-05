export interface DatosBloque {
  inicio: number;
  tamano: number;
  fin: number;
  libre: boolean;
  pid: string | null;
}
