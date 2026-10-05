# Simulador de procesos y memoria (POO en TypeScript)

Biblioteca de clases que simula cómo varios procesos comparten una memoria
limitada y una única CPU: asignación contigua (First-Fit, Best-Fit y Worst-Fit),
liberación con coalescencia, planificación Round-Robin, bloqueo por E/S y métricas.

Trabajo intercátedra **Paradigmas y Lenguajes de Programación II** + **Sistemas Operativos**
(AE2) — Ingeniería en Sistemas de Información, UCP, 2026.

No tiene interfaz gráfica, menú, `main` ni script de demostración:
el funcionamiento se demuestra **sólo con tests automatizados**.

## Requisitos

- Node.js 20 o superior y npm.

## Instalación, pruebas y cobertura

```bash
npm install          # instala Jest, ts-jest y TypeScript
npm test             # corre todos los tests
npm run test:cov     # tests + reporte de cobertura (falla si las líneas no superan el 90 %)
npm run build        # compila la biblioteca en dist/
```

El reporte HTML queda en `coverage/lcov-report/index.html`. La cobertura mide
todos los archivos de `src/`, aunque ningún test los importe
(`collectCoverageFrom` en `jest.config.js`). GitHub Actions corre lo mismo en
cada push (`.github/workflows/tests.yml`).

## Organización

```text
src/
  util/          ErrorDominio y funciones para validar sin if
  procesos/      Proceso (PCB), estados y eventos de E/S
  memoria/       BloqueMemoria, AdministradorMemoria y las políticas de asignación
  planificacion/ Planificador Round-Robin
  simulacion/    Simulador, ColaDeAdmision y ConfiguracionSimulacion
tests/           un archivo por responsabilidad, con el RF en el nombre de cada test
docs/            diagrama de clases y diagramas de secuencia (Mermaid, editables)
```
