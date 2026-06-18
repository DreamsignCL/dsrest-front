# Convenciones del proyecto

## Naming

Se utiliza metodología BEM.

Ejemplo:

```text
app-content
app-content__header
app-content__body
app-content__footer
```

---

## Componentes

### components/ui

Componentes genéricos reutilizables.

Ejemplos:

* BaseButton
* BaseInput
* BaseSelect
* BaseModal
* BaseToast

No contienen lógica de negocio.

---

### components/layout

Componentes estructurales.

Ejemplos:

* AppSidebar
* AppContentHeader
* AppContentFooter

Responsables únicamente del layout.

---

### components/orders

Componentes específicos del módulo de pedidos.

Ejemplos:

* OrderItemCard
* OrderTotals
* OrderCustomerCollapse

---

## Composables

Los composables deben exponer una responsabilidad clara.

Ejemplos:

* useCurrentUser
* useBusinessConfig
* useToast

---

## Estilos

Las vistas no deben contener estilos específicos de componentes reutilizables.

Los estilos pertenecen al componente responsable.

---

## Estado

La fuente de verdad debe existir en el nivel más alto posible.

Los componentes hijos deben recibir props y emitir eventos.

Evitar modificar props directamente.

```
```
