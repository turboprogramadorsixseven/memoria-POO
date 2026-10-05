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
```
