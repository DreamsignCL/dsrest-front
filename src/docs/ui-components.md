# UI Components

## Objetivo

Documentar los componentes reutilizables del sistema y establecer criterios para su uso.

Los componentes descritos en este documento forman parte del Design System de dsRest.

---

# Layout

## AppContentHeader

Responsable del encabezado principal de una vista.

Uso:

```vue
<AppContentHeader
    title="Pedidos"
    description="Administra los pedidos del local" />
```

Slots:

### summary

Permite mostrar información complementaria bajo el encabezado.

Ejemplo:

```vue
<template #summary>
    Componente de pasos
</template>
```

Uso frecuente:

* Indicadores de pasos.
* Resúmenes rápidos.
* Información contextual.

---

## AppContentFooter

Responsable de las acciones y resumen inferior de una vista.

Uso:

```vue
<AppContentFooter>
    <template #summary>
        ...
    </template>

    <template #actions>
        ...
    </template>
</AppContentFooter>
```

Slots:

### summary

Información resumida.

Ejemplos:

* Totales.
* Resumen de pedido.
* Contadores.

### actions

Acciones principales de la pantalla.

Ejemplos:

* Guardar.
* Cancelar.
* Volver.
* Continuar.

---

# Listados

## AppListToolbar

Componente estándar para vistas de listado.

Responsabilidades:

* Búsqueda.
* Apertura de filtros.
* Contador de registros.
* Acción principal.

Uso frecuente:

* Platos.
* Pedidos.
* Usuarios.
* Mesas.
* Zonas.

---

## AppListItem

Contenedor genérico para elementos de lista.

Responsabilidades:

* Estructura visual uniforme.
* Interacción principal.
* Estados visuales.

El contenido específico debe renderizarse mediante slots o componentes internos.

---

# Formularios

## BaseInput

Campo de entrada reutilizable.

Uso recomendado:

* Texto.
* Correo electrónico.
* Número.
* Contraseñas.
* Búsquedas.

---

## BaseSelect

Selector reutilizable.

Uso recomendado:

* Categorías.
* Estados.
* Filtros.
* Configuraciones.

---

## BaseSwitch

Interruptor binario.

Uso recomendado:

* Configuraciones.
* Activación de funcionalidades.
* Opciones booleanas.

---

## BaseButton

Botón reutilizable.

Variantes utilizadas actualmente:

```text
primary
secondary
outline-primary
danger
link
```

Debe utilizarse como acción principal del sistema.

---

# Modales

## BaseModal

Componente base para ventanas modales.

Uso:

```vue
<BaseModal
    v-model="isOpen">
</BaseModal>
```

Características:

* Controlado mediante v-model.
* Encabezado configurable.
* Footer mediante slots.
* Cierre controlado.

---

## ConfirmModal

Modal especializado para confirmaciones.

Uso recomendado:

* Eliminaciones.
* Acciones irreversibles.
* Confirmaciones importantes.

---

# Feedback

## BaseLoader

Indicador de carga global.

Uso recomendado:

* Carga inicial.
* Procesos largos.
* Operaciones bloqueantes.

---

## ToastContainer

Contenedor global de notificaciones.

Se monta una única vez en App.vue.

No debe utilizarse directamente.

---

## BaseToast

Representación visual de una notificación.

Normalmente es gestionado mediante:

```js
useToast()
```

---

## useToast

Composable responsable de las notificaciones temporales.

Uso:

```js
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

showToast({
    message: 'Pedido guardado correctamente.',
})
```

Opciones disponibles:

```js
showToast({
    message: 'Pedido guardado correctamente.',
    variant: 'success',
    showIcon: true,
    duration: 3000,
})
```

Variantes:

```text
info
success
warning
error
```

Valores por defecto:

```text
variant: info
showIcon: false
duration: 3000
```

---

# Pedidos

## OrderTotals

Responsable de mostrar:

* Subtotal.
* Propina.
* Total.

Los cálculos deben realizarse fuera del componente.

---

## OrderCustomerCollapse

Campo colapsable para captura del nombre del cliente.

Características:

* Utiliza v-model.
* Permite mantener la interfaz compacta.
* Su comportamiento depende de customerNameMode.

---

# Criterios de creación

Antes de crear un nuevo componente se debe evaluar:

1. ¿Puede reutilizarse en otro módulo?
2. ¿Existe ya un componente similar?
3. ¿Pertenece a ui, layout o a un módulo específico?

Si un componente puede utilizarse en múltiples módulos debe formar parte del Design System.

```
```
