export { ErrorDominio } from './util/validacion';
export { EstadoProceso } from './procesos/EstadoProceso';
export type { DatosProceso } from './procesos/DatosProceso';
export { EventoEntradaSalida } from './procesos/EventoEntradaSalida';
export { Proceso } from './procesos/Proceso';
export type { DatosBloque } from './memoria/DatosBloque';
export { BloqueMemoria } from './memoria/BloqueMemoria';
export type { IPoliticaAsignacion } from './memoria/IPoliticaAsignacion';
export { PoliticaPrimerAjuste } from './memoria/PoliticaPrimerAjuste';
export type {
  IAsignadorMemoria,
  ILiberadorMemoria,
  MetricasMemoria,
} from './memoria/InterfacesMemoria';
export { AdministradorMemoria } from './memoria/AdministradorMemoria';
export type { IPlanificador } from './planificacion/IPlanificador';
export { Planificador } from './planificacion/Planificador';
export { ConfiguracionSimulacion } from './simulacion/ConfiguracionSimulacion';
export type { IAdmision } from './simulacion/IAdmision';
export { ColaDeAdmision } from './simulacion/ColaDeAdmision';
export type { EstadoSistema, ISimulador, Metricas } from './simulacion/InterfacesSimulador';
export { Simulador } from './simulacion/Simulador';
