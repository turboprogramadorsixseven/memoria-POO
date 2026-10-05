import { AdministradorMemoria } from '../memoria/AdministradorMemoria';
import { IPlanificador } from '../planificacion/IPlanificador';
import { Planificador } from '../planificacion/Planificador';
import { DatosProceso } from '../procesos/DatosProceso';
import { Proceso } from '../procesos/Proceso';
import { exigir, exigirEnteroNoNegativo, exigirEnteroPositivo } from '../util/validacion';
import { ColaDeAdmision } from './ColaDeAdmision';
import { ConfiguracionSimulacion } from './ConfiguracionSimulacion';
import { IAdmision } from './IAdmision';
import { EstadoSistema, ISimulador, Metricas } from './InterfacesSimulador';

export class Simulador {
  private configuracion: ConfiguracionSimulacion;
  private memoria: AdministradorMemoria;

  constructor(configuracion = new ConfiguracionSimulacion()) {
    this.setConfiguracion(configuracion);
    this.setMemoria(
      new AdministradorMemoria(
        this.getConfiguracion().getMemoriaTotal(),
        this.getConfiguracion().getPolitica(),
      ),
    );
  }

  public getConfiguracion(): ConfiguracionSimulacion {
    return this.configuracion;
  }

  private setConfiguracion(configuracion: ConfiguracionSimulacion): void {
    this.configuracion = configuracion;
  }

  private getMemoria(): AdministradorMemoria {
    return this.memoria;
  }

  private setMemoria(memoria: AdministradorMemoria): void {
    this.memoria = memoria;
  }
}
