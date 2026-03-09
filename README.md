# ComerciantesApp — Frontend Angular

Aplicación web desarrollada en **Angular 18** con **Clean Architecture** para la gestión de comerciantes y establecimientos de la Agremiación Nacional de Comercio.

---

## 📦 Compilado de Producción

### Repositorio público

🔗 [https://github.com/Jdescobar10/comerciantes-app](https://github.com/Jdescobar10/comerciantes-app)

### Archivo compilado

El compilado de producción se encuentra en el **raíz del repositorio** como:

> 📁 `comerciantes-app-production.zip`

**Para descargarlo directamente:**

1. Ir a: [https://github.com/Jdescobar10/comerciantes-app](https://github.com/Jdescobar10/comerciantes-app)
2. En la rama `develop`, hacer clic sobre el archivo **`comerciantes-app-production.zip`**
3. Clic en **Download raw file** (ícono de descarga)

**O clonar el repositorio y encontrarlo en el raíz:**

```bash
git clone https://github.com/Jdescobar10/comerciantes-app.git
cd comerciantes-app
# El compilado está en la raíz del proyecto:
# comerciantes-app-production.zip
```

### Servir el compilado localmente

```bash
# Descomprimir el ZIP y luego:
npm install -g http-server
http-server comerciantes-app -p 4200
# Disponible en: http://localhost:4200
```

---

## 🏗️ Arquitectura

```
comerciantes-app/
├── src/
│   └── app/
│       ├── core/
│       │   ├── guards/              # auth.guard.ts — protección de rutas
│       │   ├── interceptors/        # auth.interceptor.ts — JWT en headers
│       │   └── services/            # auth.service.ts, merchants.service.ts
│       ├── shared/                  # Componentes, pipes y directivas reutilizables
│       ├── features/
│       │   ├── auth/
│       │   │   └── pages/login/     # Reto 09 — Login con JWT
│       │   └── merchants/
│       │       └── pages/
│       │           ├── home/        # Reto 10 — Lista de comerciantes
│       │           └── form/        # Reto 11 — Crear / Editar comerciante
│       └── store/
│           └── auth/                # state | actions | reducer | selectors | effects
└── dist/
    └── comerciantes-app/            # ← Compilado de producción
```

---

## 🚀 Retos implementados

| Reto | Página | Ruta | Auth | Estado |
|------|--------|------|------|--------|
| 09 | Login con JWT | `/login` | ❌ Público | ✅ Completo |
| 10 | Lista Comerciantes | `/merchants` | ✅ JWT | ✅ Completo |
| 11 | Crear / Editar Comerciante | `/merchants/new` · `/merchants/edit/:id` | ✅ JWT | ✅ Completo |

---

## 📋 Funcionalidades por pantalla

### Reto 09 — Login
- Formulario reactivo: correo, contraseña y checkbox de términos y condiciones
- Autenticación contra `/api/auth/login` con JWT
- Token almacenado en NgRx Store en memoria (OWASP — no localStorage)
- Header con nombre y rol del usuario tras iniciar sesión
- Redirección automática al home tras login exitoso
- Mensaje de error ante credenciales incorrectas

### Reto 10 — Lista Comerciantes
- Navbar con navegación y datos del usuario autenticado (nombre + rol)
- Tabla: Razón Social, Teléfono, Correo, Fecha Registro, No. Establecimientos, Estado, Acciones
- Datos desde `/api/Reporte/comerciantes`
- Paginación configurable: 5, 10 y 15 ítems por página
- Acciones por fila: ✏️ Editar · 🔴/🟢 Activar/Inactivar · 🗑️ Eliminar (solo Administrador) · ⬇️ CSV individual
- Botón **Descargar Reporte CSV** — solo rol Administrador
- Botón **Nuevo Comerciante**
- Opción de **Cerrar sesión**

### Reto 11 — Formulario Crear / Editar
- Modo creación (`/merchants/new`) y modo edición (`/merchants/edit/:id`)
- Campos: Nombre/Razón Social *, Correo Electrónico, Teléfono, Municipio *, Fecha de Registro *, Estado *, ¿Posee establecimientos?
- Selector dinámico de municipios desde `/api/municipios`
- Validaciones reactivas en todos los campos:
  - Nombre: requerido, mínimo 3 caracteres, máximo 255
  - Correo: formato email válido (opcional)
  - Teléfono: máximo 20 caracteres (opcional)
  - Fecha: requerida, no puede ser futura (validador personalizado)
  - Estado y Municipio: requeridos
- Footer fijo (solo en modo edición) con **Total Ingresos** y **Cantidad de Empleados** de todos los establecimientos asociados
- Snackbar de confirmación/error al guardar
- Redirección al home tras guardar exitosamente

---

## 🧪 Pruebas Unitarias — Jest

```bash
ng test
```

**Resultados: 23 passed / 24 total**

| Suite | Casos cubiertos |
|-------|----------------|
| Inicialización | Creación del componente, detección de modo, carga de municipios |
| Validaciones | Campos requeridos, formato email, fecha futura, campos opcionales |
| Modo edición | Carga de datos, footer con ingresos/empleados, llamada a updateComerciante |
| Modo creación | Llamada a createComerciante, bloqueo si formulario inválido |
| getFieldError | Mensajes correctos por tipo de error |

---

## 🔐 Seguridad — OWASP

| Medida | Implementación |
|--------|---------------|
| JWT en memoria | Token en NgRx Store, nunca en `localStorage` ni `sessionStorage` |
| Auth Interceptor | `Authorization: Bearer TOKEN` automático en cada request HTTP |
| Route Guards | `auth.guard.ts` redirige a `/login` sin sesión activa |
| Sanitización | Angular sanitiza todos los valores interpolados (protección XSS) |
| Control por Rol | Eliminar y Descargar CSV solo visibles para `Administrador` |
| Formularios seguros | Reactive Forms con validadores estrictos en cada campo |

---

## ⚙️ Stack Tecnológico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Angular | 18.2.11 | Framework principal — Standalone Components |
| NgRx | 18.x | Gestión de estado global (Store + Effects) |
| Angular Material | 18.x | Componentes UI — tema Azure/Blue |
| TypeScript | 5.x | Tipado estático |
| SCSS | — | Preprocesador de estilos |
| Jest | — | Pruebas unitarias |
| Node.js | 22.18.0 | Runtime |
| npm | 11.8.0 | Package manager |

---

## 🔧 Requisitos previos

- Node.js 22+
- npm 11+
- Angular CLI 18+
- Backend API corriendo en `http://localhost:8080`

## 🚀 Instalación y ejecución

```bash
# Clonar el repositorio
git clone https://github.com/Jdescobar10/comerciantes-app.git
cd comerciantes-app

# Instalar dependencias
npm install

# Ejecutar en desarrollo
ng serve

# Disponible en: http://localhost:4200
```

## 🏗️ Build para producción

```bash
ng build --configuration production
# Compilado en: dist/comerciantes-app/
```

---

## 🔗 Backend API

**Base URL:** `http://localhost:8080`

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| POST | `/api/auth/login` | Autenticación JWT | ❌ Público | — |
| GET | `/api/municipios` | Lista de municipios | ✅ JWT | Todos |
| GET | `/api/reporte/comerciantes` | Lista con establecimientos e ingresos | ✅ JWT | Todos |
| GET | `/api/comerciantes/{id}` | Detalle de comerciante | ✅ JWT | Todos |
| POST | `/api/comerciantes` | Crear comerciante | ✅ JWT | Todos |
| PUT | `/api/comerciantes/{id}` | Actualizar comerciante | ✅ JWT | Todos |
| DELETE | `/api/comerciantes/{id}` | Eliminar comerciante | ✅ JWT | Administrador |
| PATCH | `/api/comerciantes/{id}/estado` | Activar / Inactivar | ✅ JWT | Todos |
| GET | `/api/reporte/comerciantes/csv` | Reporte CSV | ✅ JWT | Administrador |

---

## 👤 Usuarios de prueba

| Correo | Contraseña | Rol |
|--------|-----------|-----|
| admin@agremiacion.com | Admin123! | Administrador |
| auxiliar@agremiacion.com | Auxiliar123! | Auxiliar de Registro |

---

## 📁 Ramas

| Rama | Propósito |
|------|-----------|
| `main` | Código estable — producción + compilado `dist/` |
| `develop` | Rama principal de desarrollo |

---

*Prueba Técnica De Uso Exclusivo De OL Software & Development*
