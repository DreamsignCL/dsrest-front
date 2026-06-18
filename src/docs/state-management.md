# State Management

## Objetivo

Definir cómo debe gestionarse el estado dentro de la aplicación.

El objetivo principal es evitar:

* Estados duplicados.
* Información inconsistente.
* Componentes difíciles de mantener.
* Sincronizaciones innecesarias.

---

# Principio Fundamental

## Single Source of Truth

Cada dato debe tener un único propietario.

La información debe vivir en el componente de más alto nivel que realmente la necesita.

Ejemplo:

```text
NewOrderView
↓
QuickOrderView
↓
OrderItemCard
```

El propietario del pedido debe ser:

```text
NewOrderView
```

y no los componentes hijos.

---

# Flujo de Datos

La aplicación utiliza un flujo unidireccional:

```text
Parent
↓ props
Child
↓ emit
Parent
```

---

## Props

Los hijos reciben información mediante props.

Ejemplo:

```vue
<QuickOrderView
    :items="orderItems"
    :customer-name="customerName" />
```

---

## Emits

Los hijos notifican cambios mediante eventos.

Ejemplo:

```js
emit(
    'update:items',
    updatedItems
)
```

---

## Actualización

El componente padre recibe el evento y actualiza el estado.

Ejemplo:

```vue
<QuickOrderView
    v-model:items="orderItems" />
```

---

# Propiedad del Estado

## Correcto

```text
NewOrderView
├── orderItems
├── customerName
└── subtotal
```

Los hijos utilizan props y emits.

---

## Incorrecto

```text
NewOrderView
└── orderItems

QuickOrderView
└── orderItems

OrderItemCard
└── orderItems
```

La misma información no debe existir en múltiples niveles.

---

# Props son de Solo Lectura

Las props no deben modificarse directamente.

Incorrecto:

```js
props.items.push(item)
```

Incorrecto:

```js
props.items = []
```

Incorrecto:

```js
props.items.value = []
```

---

La modificación debe realizarse mediante emit.

Correcto:

```js
emit(
    'update:items',
    updatedItems
)
```

---

# v-model Personalizado

Cuando un componente necesita modificar información del padre debe utilizar:

```js
defineProps()
defineEmits()
```

Ejemplo:

```vue
<OrderCustomerCollapse
    v-model="customerName" />
```

Internamente:

```js
emit(
    'update:modelValue',
    value
)
```

---

# Estado Local

El estado local sólo debe utilizarse cuando la información pertenece exclusivamente al componente.

Ejemplos válidos:

```js
const isOpen = ref(false)

const showModal = ref(false)

const search = ref('')
```

---

Estos datos no necesitan existir fuera del componente.

---

# Estado Compartido

Cuando múltiples componentes necesitan acceder a la misma información se debe evaluar:

* provide / inject
* composables
* Pinia

según el alcance requerido.

---

# Provide / Inject

Actualmente utilizado para:

```text
currentUser
currentLocal
currentToken
```

Provistos desde:

```text
AppLayout
```

Consumidos mediante:

```js
inject('currentLocal')
```

---

# Composables

Los composables pueden exponer estado compartido.

Ejemplos:

```js
useToast()
```

```js
useBusinessConfig()
```

---

# Caso de Estudio

## Flujo de Nuevo Pedido

Propietario:

```text
NewOrderView
```

Estado:

```js
customerName
orderItems
subtotal
tipAmount
```

---

QuickOrderView:

Responsable de mostrar información.

No es propietario del pedido.

---

OrderItemCard:

Responsable de mostrar un plato.

No es propietario del pedido.

---

Resultado:

```text
NewOrderView
↓
QuickOrderView
↓
OrderItemCard
```

Toda modificación retorna siempre al propietario mediante emits.

---

# Reglas del Proyecto

Antes de crear un nuevo ref o reactive preguntarse:

## 1

¿Este dato ya existe en otro componente?

Si la respuesta es sí, probablemente no debe duplicarse.

---

## 2

¿Quién es realmente el propietario de este dato?

El estado debe vivir allí.

---

## 3

¿El hijo necesita modificar el dato?

Si la respuesta es sí:

```text
props + emits
```

---

## 4

¿El dato será utilizado por múltiples módulos?

Evaluar:

```text
Composable
Pinia
Provide / Inject
```

---

# Resumen

Regla principal del proyecto:

```text
Una pieza de información
=
Un único propietario
```

Todos los componentes deben seguir este principio para mantener un flujo de datos predecible y evitar inconsistencias.

```
```
