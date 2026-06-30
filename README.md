# dsRest Frontend

Frontend administrativo de dsRest desarrollado con Vue 3, Vue Router, Pinia, Vite y SASS.

---

# Instalación

Instalar dependencias:

```bash
npm install
```

Iniciar entorno de desarrollo:

```bash
npm run dev
```

---

# Tecnologías

* Vue 3
* Vue Router
* Pinia
* Vite
* SASS
* ESLint
* Prettier

---

# Comandos de desarrollo

## Desarrollo

```bash
npm run dev
```

Inicia Vite en modo desarrollo.

---

## Desarrollo móvil

```bash
npm run dev:mobile
```

Expone el servidor de desarrollo en la red local para pruebas desde dispositivos móviles.

---

## Compilar para producción

```bash
npm run build
```

Genera la versión optimizada dentro de:

```text
dist/
```

---

## Vista previa de producción

```bash
npm run preview
```

Permite probar localmente el resultado generado por:

```bash
npm run build
```

---

## ESLint

```bash
npm run lint
```

Ejecuta ESLint y corrige automáticamente los problemas detectados.

Uso recomendado:

* Antes de realizar commits.
* Después de refactorizaciones importantes.
* Antes de abrir Pull Requests.

---

## Prettier

```bash
npm run format
```

Aplica el formato oficial del proyecto sobre:

```text
src/
```

---

## Compilación SASS

```bash
npm run sass
```

Compila:

```text
src/assets/styles/main.scss
```

hacia:

```text
src/assets/css/style.css
```

Características:

* Observa cambios automáticamente.
* Genera CSS comprimido.
* No genera source maps.
* Silencia advertencias de dependencias externas.

---

# Flujo de trabajo recomendado

Mantener dos terminales abiertas durante el desarrollo.

### Terminal 1

```bash
npm run dev
```

### Terminal 2

```bash
npm run sass
```

Esto permite:

* Recarga automática de componentes Vue.
* Compilación automática de estilos SASS.

---

# Verificación antes de realizar un commit

Ejecutar:

```bash
npm run lint
npm run format
npm run build
```

Objetivos:

* Detectar errores de sintaxis.
* Mantener consistencia de formato.
* Confirmar que la aplicación compila correctamente.

---

# Principios del proyecto

## Primer paso

Antes de realizar cambios en el proyecto leer:

- docs/project-context.md

## Mobile First

Todas las vistas y componentes deben diseñarse primero para dispositivos móviles y luego adaptarse a escritorio.

---

## Single Source of Truth

Cada dato debe tener un único propietario.

Los componentes hijos reciben información mediante props y notifican cambios mediante emits.

---

## Configuración sobre Convención

El comportamiento de la aplicación debe depender de configuraciones operativas y no de supuestos asociados al tipo de negocio.

Ejemplo:

```js
useBusinessConfig()
```

---

## Componentes reutilizables

Antes de crear un nuevo componente se debe evaluar si puede incorporarse al Design System.

---

## Separación de responsabilidades

La estructura del proyecto se organiza en:

```text
components/ui
```

Componentes reutilizables y agnósticos al negocio.

```text
components/layout
```

Componentes estructurales de la aplicación.

```text
components/*
```

Componentes específicos de cada módulo.

---

## Convención CSS

Se utiliza metodología BEM.

Ejemplo:

```text
app-content
app-content__header
app-content__body
app-content__footer
```

---

## SASS Centralizado

El proyecto no utiliza estilos SASS embebidos dentro de los componentes.

Toda la capa visual debe mantenerse dentro del Design System ubicado en:

```text
src/assets/styles/
```

La compilación genera:

```text
src/assets/css/style.css
```

que posteriormente es consumido por la aplicación.

---

# Estructura de documentación

La documentación técnica y arquitectónica del proyecto se encuentra en:

```text
docs/
```

## Arquitectura

```text
docs/architecture.md
```

Describe la estructura general de la aplicación, layouts y organización de vistas.

---

## Convenciones

```text
docs/conventions.md
```

Reglas de nomenclatura, organización de componentes y criterios de desarrollo.

---

## Decisiones de arquitectura

```text
docs/decisions.md
```

Registro histórico de decisiones importantes tomadas durante el desarrollo.

---

## Configuración operativa

```text
docs/business-config.md
```

Documentación de useBusinessConfig y configuraciones que afectan el comportamiento del sistema.

---

## Gestión de estado

```text
docs/state-management.md
```

Reglas para el manejo de estado, props, emits y flujo de datos.

---

## Módulo de pedidos

```text
docs/orders-module.md
```

Arquitectura, flujo y decisiones específicas del módulo de pedidos.

---

## Componentes UI

```text
docs/ui-components.md
```

Referencia de componentes reutilizables y Design System.

---

# Mantenimiento de la documentación

La documentación forma parte del proyecto.

Toda modificación relevante de arquitectura, componentes reutilizables, configuraciones operativas o patrones de desarrollo debe reflejarse en la carpeta:

```text
docs/
```

antes de considerarse finalizada.

### API

- api-reference.md → Endpoints y contratos validados durante el desarrollo.