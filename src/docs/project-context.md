# Project Context

## Proyecto

**dsRest Frontend**

Migración progresiva del sistema actual hacia una nueva arquitectura Vue basada en componentes reutilizables, design system propio y estructura modular.

El objetivo principal es mejorar:

* Mantenibilidad
* Escalabilidad
* Consistencia visual
* Experiencia móvil y escritorio
* Reutilización de componentes

---

# Stack Tecnológico

* Vue 3
* Vue Router
* Pinia
* Vite
* Sass
* Lucide Icons

---

# Convenciones Generales

## Idioma

Todo código nuevo debe desarrollarse en inglés:

### Correcto

```text
ProfileView
QuickOrderView
RestaurantOrderView
BaseTabs
```

### Evitar

```text
PerfilView
PedidoRapidoView
PestanasBase
```

Las etiquetas visibles para usuarios permanecen en español.

---

## BEM

Se utiliza metodología BEM.

Ejemplos:

```scss
.app-content
.app-content__header
.app-content__body
.app-content__footer

.card
.card__content
.card__actions

.tabs
.tabs__item
.tabs__item--active
```

---

# Arquitectura Principal

## Layout

```text
AppLayout
│
├── AppSidebar
│
└── AppContent
    │
    ├── AppContentHeader
    │
    ├── app-content__body
    │
    └── AppContentFooter
```

Toda vista debe renderizarse dentro de:

```text
RouterView
↓
AppLayout
↓
app-content
```

---

# Filosofía de Desarrollo

## Las vistas son orquestadores

Las vistas deben contener únicamente:

* Flujo general
* Estado principal
* Integración de componentes

Evitar lógica compleja dentro de las vistas.

La lógica específica debe moverse a:

* Components
* Composables
* Helpers
* Services

---

## Reutilización primero

Antes de crear un nuevo componente:

1. Revisar si existe un Base Component.
2. Revisar documentación existente.
3. Evaluar si el componente puede ser reutilizable.

Crear componentes específicos sólo cuando sea realmente necesario.

---

# Sistema de Layout

## AppContentHeader

Responsable de:

* Título
* Descripción
* Menú usuario
* Summary

---

## AppContentFooter

Responsable de:

* Acciones principales
* Botones de navegación
* Botones de guardado

Las acciones deben mantenerse en el footer cuando sea posible.

---

## App View

Tipos actuales:

```text
app-view--list
app-view--form
```

---

# Componentes Base Disponibles

## Inputs

* BaseInput
* BaseSelect
* BaseImageUploader

## Acciones

* BaseButton

## Feedback

* BaseToast
* ToastContainer
* BaseLoader

## Navegación

* BaseTabs

## Modales

* BaseModal

---

# Estado Global

## useCurrentUser

Fuente oficial de estado de sesión.

Expone:

```js
user
local
token
```

Métodos:

```js
updateUser()
updateLocal()
updateToken()
```

No acceder directamente a localStorage desde componentes o vistas.

Utilizar siempre:

```js
useCurrentUser()
```

---

# Sistema de Archivos

## Conversión Base64

Utilizar:

```js
useFile()
```

Método:

```js
fileToBase64()
```

No crear implementaciones duplicadas.

---

# Sistema de Toasts

Uso:

```js
const { showToast } = useToast()

showToast({
    message: 'Operación exitosa',
    variant: 'success',
    showIcon: true,
})
```

Variantes:

```text
success
error
warning
info
```

---

# Sistema de Loading

Uso:

```vue
<BaseLoader
    v-if="isLoading"
    text="Cargando..." />
```

Recomendado para:

* Guardados
* Eliminaciones
* Operaciones críticas

---

# Perfil

## Estructura

```text
ProfileView
│
├── ProfileSummary
│
├── ProfilePersonalForm
│
└── ProfileBusinessForm
```

## Guardado

La actualización de perfil requiere:

```text
PUT usuarios/:id
PUT locales/:id
PUT empresas/:id
```

Después del guardado:

```js
updateUser()
updateLocal()
```

para mantener sincronizada la interfaz sin cerrar sesión.

---

# Configuración de Negocio

Actualmente existen tres estados para:

```text
usaMesas
usaNombreCliente
```

Valores:

```text
si
no
opcional
```

Estas configuraciones determinan el flujo de creación de pedidos.

---

# Estado Actual del Proyecto

## Completado

* Sistema de Layout
* AppContentHeader
* AppContentFooter
* BaseTabs
* BaseToast
* ToastContainer
* BaseLoader
* BaseImageUploader
* Sistema reactivo de usuario
* ProfileView
* ProfileSummary
* ProfilePersonalForm
* ProfileBusinessForm

---

# Próximos Módulos

## Pedidos

Continuar desarrollo de:

```text
RestaurantOrderView
QuickOrderView
```

Objetivo:

Aplicar correctamente las reglas:

```text
usaMesas
usaNombreCliente
```

para determinar el flujo de creación de pedidos.

---

# Documentación Relacionada

Leer además:

```text
architecture.md
api-reference.md
business-config.md
orders-module.md
state-management.md
ui-components.md
```

Este documento debe considerarse el punto de entrada principal para comprender el proyecto.
