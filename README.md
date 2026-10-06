# Simulador de procesos y memoria (POO en TypeScript)

Biblioteca de clases que simula cómo varios procesos comparten una memoria
limitada y una única CPU: asignación contigua (First-Fit, Best-Fit y Worst-Fit),
liberación con coalescencia, planificación Round-Robin, bloqueo por E/S y métricas.


## Requisitos

- Node.js 20 o superior y npm.

## Instalación, pruebas y cobertura

```bash
npm install          # instala Jest, ts-jest y TypeScript
npm test             # corre todos los tests
npm run test:cov     # tests + reporte de cobertura (falla si las líneas no superan el 90 %)
npm run build        # compila la biblioteca en dist/






