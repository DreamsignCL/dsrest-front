# API Reference

## Objetivo

Este documento registra los endpoints del backend que han sido validados durante el desarrollo y migración de la aplicación.

No pretende documentar toda la API existente, sino únicamente los endpoints que han sido inspeccionados, utilizados o verificados durante el desarrollo.

---

# Perfil

La actualización de perfil requiere modificar tres entidades independientes:

* Usuario
* Local
* Empresa

## Actualizar usuario

Endpoint:

PUT /usuarios/:id

Ejemplo:

PUT /usuarios/3

Payload:

```json
{
    "nombre": "Cristian",
    "telefono": "+56984548342",
    "contrasena": "123456"
}
```

Notas:

* `contrasena` es opcional.
* Si no se envía, la contraseña actual se mantiene.
* El backend acepta payloads parciales.

Campos utilizados actualmente:

| Campo      | Tipo   |
| ---------- | ------ |
| nombre     | String |
| telefono   | String |
| contrasena | String |

---

## Actualizar local

Endpoint:

PUT /locales/:id

Ejemplo:

PUT /locales/2

Payload:

```json
{
    "nombre": "LIDAGUI",
    "nombreFantasia": "dsRest",
    "direccion": "Mi dirección #1234",
    "tipo": "Restaurante",
    "foto": "data:image/jpeg;base64,..."
}
```

Campos utilizados actualmente:

| Campo          | Tipo          |
| -------------- | ------------- |
| nombre         | String        |
| nombreFantasia | String        |
| direccion      | String        |
| tipo           | String        |
| foto           | Base64 / null |

Notas:

* `foto` acepta imágenes en Base64.
* El logo del negocio se almacena en `foto`.
* El tipo de negocio se guarda en el campo `tipo`.

---

## Actualizar empresa

Endpoint:

PUT /empresas/:id

Ejemplo:

PUT /empresas/2

Payload:

```json
{
    "tipoNegocio": "Restaurante",
    "usaMesas": "no",
    "usaNombreCliente": "no"
}
```

Campos utilizados actualmente:

| Campo            | Tipo   |
| ---------------- | ------ |
| tipoNegocio      | String |
| usaMesas         | String |
| usaNombreCliente | String |

Valores observados:

```text
si
no
opcional
```

---

## Obtener empresa desde local

Endpoint:

GET /empresas/por-local/:localId

Ejemplo:

GET /empresas/por-local/2

Uso:

Obtiene la configuración de empresa asociada a un local.

---

# Observaciones

## Duplicidad de tipo de negocio

Actualmente el tipo de negocio se guarda en dos entidades:

### Local

```json
{
    "tipo": "Restaurante"
}
```

### Empresa

```json
{
    "tipoNegocio": "Restaurante"
}
```

Ambos valores deben mantenerse sincronizados.

---

## Configuración operacional

Las siguientes configuraciones pertenecen a Empresa:

```json
{
    "usaMesas": "si",
    "usaNombreCliente": "si"
}
```

Estas configuraciones determinan el comportamiento del flujo de pedidos.

---

## Logo del negocio

El logo se almacena en:

```text
Local.foto
```

No existe actualmente un campo de logo en Empresa.

---

## Flujo actual de actualización de perfil

ProfileView realiza las siguientes operaciones:

1. PUT usuarios/:id
2. PUT locales/:id
3. PUT empresas/:id

Posteriormente actualiza:

* currentUser
* currentLocal
* localStorage

mediante:

```js
updateUser()
updateLocal()
```

para mantener sincronizada la interfaz sin necesidad de cerrar sesión.
