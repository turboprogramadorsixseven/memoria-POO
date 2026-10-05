# Diagrama de clases

Generado a partir del código y completado con las relaciones. Visibilidad:
`+` público, `-` privado, `#` protegido; `*` marca un método abstracto.
Doble encapsulamiento: cada atributo privado tiene su `get` y su `set`, y la clase
sólo lo usa a través de ellos. Se omiten las interfaces de datos que devuelven las
consultas (`DatosProceso`, `DatosBloque`, `Metricas`, `MetricasMemoria`, `EstadoSistema`).

```mermaid
classDiagram
  direction TB

  class AdministradorMemoria {
    -tamanoTotal: number
    -politica: IPoliticaAsignacion
    -bloques: BloqueMemoria[]
    +getTamanoTotal() number
    -setTamanoTotal(tamano) void
    +getPolitica() IPoliticaAsignacion
    -setPolitica(politica) void
    -getBloques() BloqueMemoria[]
    -setBloques(bloques) void
    +asignarMemoria(pid, tamano) boolean
    -ocuparBloque(bloque, pid, tamano) void
    +liberarMemoria(pid) void
    -unirBloquesLibresVecinos() void
    -buscarBloqueDe(pid) BloqueMemoria | undefined
    +obtenerMapa() DatosBloque[]
    +obtenerMetricas() MetricasMemoria
    -calcularFragmentacion(memoriaLibre, mayorBloque) number
  }

  class BloqueMemoria {
    -inicio: number
    -tamano: number
    -pid: string | null
    +getInicio() number
    -setInicio(inicio) void
    +getTamano() number
    -setTamano(tamano) void
    +getPid() string | null
    -setPid(pid) void
    +getFin() number
    +estaLibre() boolean
    +asignarA(pid, tamanoPedido) BloqueMemoria
    +liberar() void
    +puedeUnirseCon(siguiente) boolean
    +unirCon(siguiente) void
    +obtenerDatos() DatosBloque
  }

  class IPoliticaAsignacion {
    <<interface>>
    +getNombre() string
    +ordenarCandidatos(bloques, tamanoPedido) BloqueMemoria[]
  }

  class IAsignadorMemoria {
    <<interface>>
    +asignarMemoria(pid, tamano) boolean
  }

  class ILiberadorMemoria {
    <<interface>>
    +liberarMemoria(pid) void
  }

  class PoliticaAsignacionBase {
    <<abstract>>
    +getNombre()* string
    +ordenarCandidatos(bloques, tamanoPedido) BloqueMemoria[]
    #filtrarBloquesAptos(bloques, tamanoPedido) BloqueMemoria[]
    #comparar(a, b)* number
  }

  class PoliticaMejorAjuste {
    +getNombre() string
    #comparar(a, b) number
  }
```
