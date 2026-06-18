# Arquitectura de la aplicación

## Objetivo

Mantener una estructura consistente entre todas las vistas de la aplicación, facilitando la reutilización de componentes y la adaptación entre dispositivos móviles y escritorio.

---

## Estructura principal

La aplicación utiliza un layout único compuesto por:

```text
AppLayout
├── AppSidebar
└── AppContent
    └── RouterView
```

### AppLayout

Responsable de:

* Mostrar la navegación principal.
* Proveer información global del usuario.
* Proveer información global del local.
* Renderizar las vistas mediante RouterView.

---

## App Content

Todas las vistas cargadas dentro de RouterView son hijas de AppContent.

Estructura esperada:

```text
AppContent
├── AppContentHeader
├── AppContentBody
└── AppContentFooter
```

---

## Tipos de vistas

### app-view--list

Utilizada para:

* Platos
* Pedidos
* Usuarios
* Mesas
* Zonas

Estructura:

```text
app-view--list
├── app-view__toolbar
└── app-view__content
```

---

### app-view--form

Utilizada para:

* Crear plato
* Editar plato
* Nuevo pedido
* Editar usuario

Estructura:

```text
app-view--form
└── app-view__content
```

---

## Flujo de navegación

AppLayout es persistente.

Las vistas cambian únicamente dentro de RouterView.

Esto permite mantener:

* Sidebar persistente.
* Estado global del usuario.
* Estado global del local.
* Componentes globales como ToastContainer.

```
```
