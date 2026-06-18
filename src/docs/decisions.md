# Decisiones de arquitectura

## Separación entre Layout y Contenido

### Contexto

Inicialmente las vistas mezclaban estructura de layout con contenido específico del módulo.

Esto generaba inconsistencias entre pantallas y dificultaba mantener una experiencia homogénea.

### Decisión

Centralizar la estructura visual mediante:

```text
AppContentHeader
AppContentBody
AppContentFooter
```

Las vistas deben enfocarse únicamente en su contenido.

### Beneficios

* Consistencia visual.
* Menor duplicación.
* Mejor mantenimiento.
* Adaptación responsive simplificada.

---

## AppContent como contenedor transversal

### Contexto

Todas las vistas administrativas comparten la misma estructura general.

### Decisión

Todo componente cargado mediante RouterView debe renderizarse dentro de AppContent.

Estructura:

```text
AppLayout
├── AppSidebar
└── AppContent
    └── RouterView
```

### Beneficios

* Estructura única para toda la aplicación.
* Comportamiento consistente entre módulos.
* Facilita la creación de componentes globales.

---

## Reemplazo de useBusinessRules por useBusinessConfig

### Contexto

Inicialmente las decisiones operativas dependían del tipo de negocio.

Ejemplo:

```text
Restaurante → usa mesas
Cafetería rápida → no usa mesas
```

Durante el desarrollo se identificó que la lógica real depende de la configuración de la empresa y no del tipo de negocio.

### Decisión

Renombrar el composable:

```text
useBusinessRules
↓
useBusinessConfig
```

Y exponer configuraciones operativas.

Ejemplo:

```js
config.tablesMode
config.customerNameMode
```

### Beneficios

* Refleja correctamente la lógica de negocio.
* Permite personalización independiente del tipo de local.
* Reduce reglas rígidas.

---

## NewOrderView como orquestador

### Contexto

Existen dos flujos distintos para crear pedidos:

* Locales con mesas.
* Locales sin mesas.

Inicialmente la lógica estaba distribuida entre distintas vistas.

### Decisión

Centralizar la decisión en:

```text
NewOrderView
```

Responsabilidades:

* Renderizar encabezado.
* Renderizar footer.
* Calcular totales.
* Seleccionar flujo de creación.

```text
QuickOrderView
RestaurantOrderView
```

### Beneficios

* Evita duplicar estructura.
* Mantiene una única fuente de verdad.
* Simplifica el mantenimiento.

---

## Fuente única de verdad en formularios

### Contexto

Algunos componentes mantenían estado propio además del estado del padre.

Esto generaba inconsistencias y dificultades para sincronizar información.

### Decisión

La información debe vivir en el componente de más alto nivel posible.

Los componentes hijos reciben props y emiten eventos.

Ejemplo:

```text
NewOrderView
↓
QuickOrderView
↓
OrderItemCard
```

Los hijos no deben ser propietarios de los datos.

### Beneficios

* Flujo de datos predecible.
* Menor complejidad.
* Mejor reutilización.

```
```
