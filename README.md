# ComerciantesApp — Frontend Angular

Aplicación web desarrollada en **Angular 18** con **Clean Architecture** para la gestión de comerciantes y establecimientos de la Agremiación Nacional de Comercio.

## 🏗️ Arquitectura

```
comerciantes-app/
├── src/
│   └── app/
│       ├── core/                    # Guards, interceptores, servicios singleton
│       │   ├── guards/              # auth.guard.ts — protección de rutas
│       │   ├── interceptors/        # auth.interceptor.ts — JWT en headers
│       │   └── services/            # auth.service.ts, merchants.service.ts
│       ├── shared/                  # Componentes, pipes y directivas reutilizables
│       ├── features/                # Módulos de funcionalidad
│       │   ├── auth/                # Módulo de autenticación (Login)
│       │   └── merchants/           # Módulo de comerciantes (Home + Formulario)
│       └── store/                   # Estado global NgRx
```

## 🚀 Páginas implementadas

| Reto | Página | Ruta | Auth |
|------|--------|------|------|
| 09 | Login | `/login` | ❌ Público |
| 10 | Home — Lista Comerciantes | `/merchants` | ✅ JWT |
| 11 | Formulario Crear/Editar | `/merchants/new` `/merchants/:id` | ✅ JWT |

## 🔐 Seguridad (OWASP)

- JWT almacenado en memoria vía NgRx (no localStorage)
- Interceptor HTTP agrega el token automáticamente en cada request
- Guards protegen todas las rutas privadas
- Sanitización de inputs por defecto con Angular
- Manejo de errores 401/403 con redirección automática al login

## ⚙️ Stack Tecnológico

- **Angular 18** — Framework principal (Standalone Components)
- **NgRx 18** — Gestión de estado global (Store + Effects)
- **Angular Material 18** — Componentes UI (tema Azure/Blue)
- **TypeScript** — Tipado estático
- **SCSS** — Estilos

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

# La app estará disponible en: http://localhost:4200
```

## 🏗️ Build para producción

```bash
ng build --configuration production
```

El compilado se genera en la carpeta `dist/comerciantes-app`.

## 🧪 Ejecutar pruebas unitarias

```bash
ng test
```

## 🔗 Backend API

Este frontend consume la API REST desarrollada en .NET 8.
**Base URL:** `http://localhost:8080`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Autenticación JWT |
| GET | `/api/municipios` | Lista de municipios |
| GET | `/api/comerciantes` | Lista paginada de comerciantes |
| GET | `/api/comerciantes/{id}` | Detalle de comerciante |
| POST | `/api/comerciantes` | Crear comerciante |
| PUT | `/api/comerciantes/{id}` | Actualizar comerciante |
| DELETE | `/api/comerciantes/{id}` | Eliminar (solo Administrador) |
| PATCH | `/api/comerciantes/{id}/estado` | Activar/Inactivar |
| GET | `/api/reporte/comerciantes/csv` | Reporte CSV (solo Administrador) |

## 👤 Usuarios de prueba

| Correo | Contraseña | Rol |
|--------|-----------|-----|
| admin@agremiacion.com | Admin$2026! | Administrador |
| auxiliar@agremiacion.com | Aux1liar#2026 | Auxiliar de Registro |

## 📁 Rama de desarrollo

| Rama | Propósito |
|------|-----------|
| `main` | Código estable — producción |
| `develop` | Rama principal de desarrollo |
