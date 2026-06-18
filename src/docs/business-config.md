# Business Config

## Objetivo

Centralizar las configuraciones operativas que modifican el comportamiento de la aplicación.

Estas configuraciones no representan reglas de negocio rígidas, sino preferencias y características configurables por cada empresa.

---

# Contexto

Inicialmente la aplicación determinaba su comportamiento según el tipo de negocio.

Ejemplo:

```text
Restaurante → usa mesas
Cafetería rápida → no usa mesas
Foodtruck → requiere nombre de cliente
```

Durante el desarrollo se identificó que estas decisiones no dependen realmente del tipo de negocio, sino de la configuración definida por cada empresa.

Por esta razón se reemplazó:

```text
useBusinessRules
```

por:

```text
useBusinessConfig
```

---

# useBusinessConfig

Composable encargado de exponer configuraciones operativas del local actual.

Uso:

```js
import { useBusinessConfig } from '@/composables/useBusinessConfig'

const { config } = useBusinessConfig()
```

---

# Fuente de Datos

Las configuraciones provienen de la información asociada a la empresa del local.

Actualmente estas configuraciones son almacenadas en el objeto local disponible durante la sesión.

Ejemplo:

```js
{
    usaMesas: 'no',
    usaNombreCliente: 'si',
}
```

---

# Configuraciones Disponibles

## tablesMode

Determina si el negocio utiliza mesas.

Acceso:

```js
config.tablesMode
```

Valores posibles:

```text
si
no
```

---

### Impacto

Cuando el valor es:

```text
si
```

La aplicación utiliza:

```text
RestaurantOrderView
```

y habilita funcionalidades relacionadas con:

* Mesas.
* Zonas.
* Asignación física de pedidos.

---

Cuando el valor es:

```text
no
```

La aplicación utiliza:

```text
QuickOrderView
```

y oculta funcionalidades relacionadas con mesas.

---

## customerNameMode

Determina el uso del nombre del cliente.

Acceso:

```js
config.customerNameMode
```

Valores posibles:

```text
si
no
opcional
```

---

### Impacto

Afecta:

* Creación de pedidos.
* Visualización de pedidos.
* Validaciones futuras.

---

### si

El nombre del cliente es obligatorio.

---

### no

El nombre del cliente no forma parte del flujo.

---

### opcional

El nombre del cliente puede ingresarse, pero no es obligatorio.

---

# Implementación Actual

Actualmente el composable expone:

```js
const rules = computed(() => ({
    tablesMode:
        local.value?.usaMesas ?? 'no',

    customerNameMode:
        local.value?.usaNombreCliente ?? 'no',
}))
```

---

# Principios

## Evitar lógica basada en tipo de negocio

No deben implementarse condiciones como:

```js
if (local.tipo === 'Restaurante')
```

o

```js
if (local.tipo === 'Foodtruck')
```

Las decisiones operativas deben depender exclusivamente de:

```js
useBusinessConfig()
```

---

## Configuración sobre Convención

Siempre que sea posible, el comportamiento de la aplicación debe estar definido por configuraciones y no por supuestos asociados al tipo de negocio.

Esto permite que negocios con características similares compartan funcionalidades independientemente de su clasificación comercial.

---

# Futuras Configuraciones

Este documento debe actualizarse cuando se incorporen nuevas configuraciones operativas.

Posibles ejemplos:

* Manejo de propinas.
* Impresión automática.
* Autorizaciones superiores.
* Observaciones obligatorias.
* Diferencias permitidas de caja.
* Gestión de reservas.
* Gestión de delivery.
* Gestión de cocina.

Todas las configuraciones futuras deben exponerse mediante:

```js
useBusinessConfig()
```

para mantener una única fuente de verdad.

```
```
