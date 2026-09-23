# 🐾 Refugio - Plataforma Comunitaria de Adopción y Búsqueda

Plataforma fullstack moderna construida con **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **Leaflet + OpenStreetMap** y **Resend**.

Optimizada para **costo cero en infraestructura** y alto impacto social y de rescate animal.

---

## 🚀 Características Principales

1. **Catálogo de Adopciones Responsables:**
   - Filtros facetados en tiempo real por especie (Perro, Gato, Otros), tamaño, edad, género y compatibilidad con niños, perros y gatos.
   - Fichas detalladas con galería fotográfica adaptable.

2. **Cuestionario de Adopción Primeriza:**
   - Formulario que evalúa tipo de vivienda, si cuenta con patio cerrado, integrantes de la casa (bebés/niños), tiempo libre y experiencia previa.
   - Envío automático de la postulación al correo electrónico del refugio o rescatista mediante **Resend**.

3. **Mascotas Perdidas y Encontradas con Mapa de 300 Metros:**
   - Mapa interactivo con **Leaflet + OpenStreetMap** (100% gratuito, sin límites ni claves API de Google).
   - Visualización y selector de radio de **300 metros** alrededor del último punto de avistamiento.

4. **Pipeline de Fotos WebP en Cliente (0 Costo en Vercel):**
   - Las fotos se convierten y redimensionan en el navegador del usuario a **WebP en 4 resoluciones** (320px, 640px, 1024px, 1600px).
   - Renderizado con la etiqueta nativa `<picture>` y `<img loading="lazy" srcset="...">`.
   - **0 consumo de la cuota de optimización de imágenes de Vercel**.

5. **Sistema de Moderación Comunitaria:**
   - Todas las publicaciones nuevas entran en estado `PENDIENTE_MODERACION`.
   - El dueño del sitio (`ADMIN`) y los rescatistas verificados (`REFUGIO`) pueden aprobar o rechazar publicaciones desde el panel `/moderacion`.
   - Notificación por correo al administrador cuando entra una nueva publicación.

6. **Autenticación y Roles:**
   - Soporte para inicio de sesión con Credenciales (Email + Contraseña con hash bcrypt) y Google OAuth.
   - Roles definidos: `ADMIN`, `REFUGIO` (Verificado), `USUARIO`.

---

## 🛠️ Instalación y Ejecución Local

### 1. Clonar e Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

*(En desarrollo local ya viene configurado para usar SQLite `file:./dev.db` sin necesidad de instalar Postgres localmente).*

### 3. Crear Base de Datos y Cargar Datos de Prueba
```bash
npx prisma db push
npm run db:seed
```

### 4. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
Abre en tu navegador: [http://localhost:3000](http://localhost:3000).

---

## 👤 Cuentas Demo de Prueba (Sembradas en `db:seed`)

Para probar los diferentes roles con un solo clic:
* **Administrador (Acceso total y moderación):**
  * Email: `admin@refugio.com`
  * Contraseña: `admin123`
* **Refugio Verificado (Aprobación comunitaria de publicaciones):**
  * Email: `refugio@huellas.org`
  * Contraseña: `refugio123`
* **Usuario Adoptante:**
  * Email: `usuario@ejemplo.com`
  * Contraseña: `usuario123`

---

## ☁️ Despliegue en GitHub y Vercel

### Paso 1: Subir a tu GitHub
```bash
git add .
git commit -m "feat: initial commit of Refugio platform"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/refugio.git
git push -u origin main
```

### Paso 2: Importar en Vercel
1. Ve a [vercel.com](https://vercel.com) y selecciona **Add New Project**.
2. Importa tu repositorio `refugio`.
3. En la pestaña **Storage** de Vercel:
   - Añade una base de datos **Postgres** (Neon gratuito). Esto inyectará automáticamente `DATABASE_URL` y `POSTGRES_PRISMA_URL`.
   - Añade un almacenamiento **Blob** (para almacenar las imágenes WebP). Esto inyectará `BLOB_READ_WRITE_TOKEN`.
4. En **Environment Variables**, configura:
   - `NEXTAUTH_SECRET`: una clave secreta segura (genera con `openssl rand -base64 32`).
   - `NEXTAUTH_URL`: la URL de tu proyecto en Vercel (ej. `https://refugio.vercel.app`).
   - `ADMIN_EMAIL`: tu correo electrónico para recibir las alertas de moderación.
   - `RESEND_API_KEY`: tu clave API gratuita de [resend.com](https://resend.com).
   - `RESEND_FROM_EMAIL`: `onboarding@resend.dev` (o tu dominio verificado).
5. En `prisma/schema.prisma`, cambia `provider = "sqlite"` a `provider = "postgresql"`.
6. En Vercel, agrega el comando de build o ejecuta `npx prisma db push` en el primer deploy.

---

## 📄 Licencia y Misión
Desarrollado con pasión para salvar vidas y conectar animales rescatados con familias para siempre.
