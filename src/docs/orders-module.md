# Módulo de Pedidos

## Objetivo

El módulo de pedidos es responsable de la creación, visualización y administración de las órdenes generadas por el local.

La implementación considera distintos tipos de operación dependiendo de la configuración del negocio.

---

# Configuración Operativa

El comportamiento del módulo depende de:

```js
useBusinessConfig()
```

Actualmente se consideran dos configuraciones principales:

## tablesMode

Determina si el local trabaja con mesas.

Valores posibles:

```text
si
no
```

Cuando el valor es:

```text
si
```

El flujo utiliza:

```text
RestaurantOrderView
```

Cuando el valor es:

```text
no
```

El flujo utiliza:

```text
QuickOrderView
```

---

## customerNameMode

Determina el uso del nombre del cliente.

Valores posibles:

```text
si
no
opcional
```

Esta configuración afecta:

* Formularios de creación de pedidos.
* Visualización de pedidos.
* Validaciones futuras.

---

# Arquitectura

## NewOrderView

Actúa como orquestador principal.

Responsabilidades:

* Renderizar AppContentHeader.
* Renderizar AppContentFooter.
* Calcular totales.
* Mantener la información principal del pedido.
* Seleccionar el flujo adecuado.

Estructura:

```text
NewOrderView
├── QuickOrderView
└── RestaurantOrderView
```

---

# Flujo Quick Order

## Objetivo

Permitir la creación rápida de pedidos en negocios que no utilizan mesas.

Ejemplos:

* Cafeterías rápidas.
* Foodtrucks.
* Negocios de retiro.

---

## Estructura

```text
QuickOrderView
├── OrderCustomerCollapse
├── Botón Agregar Platos
├── Lista de platos seleccionados
└── OrderDishSelectorModal
```

---

## OrderCustomerCollapse

Permite ingresar el nombre del cliente.

Características:

* Colapsable.
* Puede mantenerse oculto.
* Utiliza v-model.
* Su comportamiento depende de customerNameMode.

---

## OrderItemCard

Representa un plato agregado al pedido.

Responsabilidades:

* Mostrar cantidad.
* Mostrar precio unitario.
* Mostrar subtotal individual.
* Aumentar cantidad.
* Disminuir cantidad.
* Eliminar plato.

No contiene estado propio.

Toda la información proviene del componente padre.

---

## OrderTotals

Componente responsable de mostrar:

* Subtotal.
* Propina.
* Total.

Los cálculos son realizados por NewOrderView.

---

# Selector de Platos

## OrderDishSelectorModal

Permite agregar platos al pedido.

Responsabilidades:

* Buscar platos.
* Filtrar por categoría.
* Seleccionar múltiples platos.
* Confirmar selección.

---

## Prevención de duplicados

Una vez agregado un plato al pedido:

* Debe mostrarse con indicador visual de selección.
* No puede ser desmarcado desde el modal.
* Si el usuario intenta seleccionarlo nuevamente se muestra un Toast informativo.

Motivación:

Evitar inconsistencias cuando el usuario ya modificó cantidades dentro de la orden.

---

## Flujo esperado

```text
Abrir modal
↓
Seleccionar platos
↓
Agregar
↓
Modificar cantidades
↓
Abrir modal nuevamente
↓
Los platos agregados permanecen identificados
↓
No pueden ser desmarcados accidentalmente
```

---

# Listado de Pedidos

## OrdersView

Responsable de visualizar los pedidos existentes.

Utiliza:

```text
AppListToolbar
AppListItem
OrderItemContent
```

---

## OrderItemContent

Representa la información visual de un pedido.

La información mostrada depende de:

```js
useBusinessConfig()
```

Ejemplos:

* Mostrar mesa sólo cuando el local utiliza mesas.
* Mostrar cliente sólo cuando existe información asociada.

---

# Decisiones Relevantes

## Fuente única de verdad

Toda la información del pedido debe existir en el nivel más alto posible.

Actualmente:

```text
NewOrderView
```

es propietario del estado.

Los componentes hijos reciben props y emiten eventos.

---

## Separación de flujos

Se decidió mantener dos experiencias distintas:

```text
QuickOrderView
RestaurantOrderView
```

en lugar de un único formulario altamente condicional.

Motivación:

* Menor complejidad.
* Mejor experiencia de usuario.
* Menor cantidad de condiciones dentro de una misma vista.

```
```
