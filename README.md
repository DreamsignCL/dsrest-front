# dsRest Frontend

Sistema POS y gestión de pedidos para restaurantes desarrollado con Vue.js.

## 🚀 Tecnologías utilizadas

- Vue 3
- Vue Router
- Vite
- Bootstrap 5
- ESLint
- JavaScript
- API REST

---

# 📦 Instalación del proyecto

Clonar repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Entrar al proyecto:

```bash
cd nombre-del-proyecto
```

Instalar dependencias:

```bash
npm install
```

---

# ▶️ Ejecutar proyecto en desarrollo

```bash
npm run dev
```

---

# 🏗️ Compilar para producción

```bash
npm run build
```

---

# 🔍 ESLint

Ejecutar revisión ESLint:

```bash
npm run lint
```

Corregir automáticamente errores y warnings soportados:

```bash
npm run lint -- --fix
```

---

# 📝 Exportar resultado ESLint a archivo TXT

Guardar reporte ESLint en un archivo:

```bash
npm run lint > eslint-report.txt
```

Guardar también errores:

```bash
npm run lint > eslint-report.txt 2>&1
```

Con auto-fix y exportación:

```bash
npm run lint -- --fix > eslint-fix-report.txt 2>&1
```

---

# 📁 Estructura general del proyecto

```text
src/
│
├── assets/
├── components/
├── views/
├── router/
├── services/
├── composables/
├── helpers/
└── styles/
```

Ver archivo completo: [estructura.txt](./estructura.txt)

---

# 📌 Notas importantes

- El proyecto actualmente se encuentra en etapa de desarrollo.
- ESLint fue incorporado posteriormente al proyecto para mejorar calidad y mantenimiento.
- Actualmente el proyecto mantiene:
    - 0 errores ESLint
    - warnings controlados y pendientes de optimización futura

---

# 🔮 Mejoras futuras

- Modularización de componentes grandes
- Implementación de composables reutilizables
- Optimización de estados globales
- Mejoras UX/UI
- Integración de pagos
- Impresión de comandas
- WebSockets / tiempo real
- Dashboard administrativo

---

# 👨‍💻 Desarrollo

Proyecto desarrollado por Dreamsign.