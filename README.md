# Refugio Patitas

Sistema web para la gestión de adopciones responsables y el reporte de mascotas perdidas o encontradas en Uruguay.

La plataforma permite a refugios, rescatistas y particulares publicar animales en adopción, recibir solicitudes con formularios detallados de convivencia y geolocalizar avisos de animales perdidos manteniendo la privacidad del hogar.

---

## Funcionalidades

### Adopciones
- **Catálogo interactivo:** Filtros por especie (perros, gatos, otros), tamaño, sexo, edad y compatibilidad comprobada con niños, perros y gatos.
- **Ficha completa del animal:** Nombre, historia, cuidados especiales, vacunas, castración y estado de salud.
- **Perfil de adoptante responsable:** Formulario que registra tipo de vivienda (casa, departamento, patio cerrado), integrantes de la familia, tiempo disponible y experiencia previa.
- **Gestión de solicitudes:** Los administradores y rescatistas pueden revisar postulaciones, coordinar visitas y confirmar o rechazar adopciones con notificación directa.

### Mascotas Perdidas y Encontradas
- **Reporte comunitario:** Publicación de avisos con fotos, señas particulares y fecha de pérdida o hallazgo.
- **Mapa de ubicación:** Integración con Leaflet y OpenStreetMap que muestra un radio aproximado de 300 metros para resguardar la dirección exacta del usuario.
- **Muro de avistamientos:** Espacio en cada ficha para que vecinos dejen comentarios o información sobre posibles avistamientos.
- **Cierre de publicaciones:** Los usuarios pueden marcar a su mascota como recuperada o eliminar la publicación cuando se resuelve el caso.

### Test de Afinidad ("Mi Mascota Ideal")
- Cuestionario guiado que analiza el tiempo libre, espacio en el hogar y composición familiar para sugerir los animales más afines disponibles en el refugio.

### Panel de Administración
- Publicación directa o moderación de avisos comunitarios.
- Edición de fichas existentes (datos generales, fotos y herramienta de reencuadre facial interactivo).
- Historial y seguimiento de solicitudes de adopción.

---

## Tecnologías

- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Base de datos y ORM:** PostgreSQL con Prisma
- **Autenticación:** NextAuth.js
- **Mapas:** Leaflet / OpenStreetMap
- **Imágenes:** Carga y conversión a formato WebP en el navegador, almacenamiento en Vercel Blob
- **Correos y Notificaciones:** Resend

---

## Instalación y Configuración Local

### 1. Requisitos
- Node.js 18 o superior
- Base de datos PostgreSQL (local o servicio en la nube como Neon / Supabase)

### 2. Clonar e instalar dependencias
```bash
git clone https://github.com/vcssoff/refugio.git
cd refugio
npm install
```

### 3. Configurar variables de entorno
Crear un archivo `.env` a partir del ejemplo:
```bash
cp .env.example .env
```
Completar las variables requeridas en `.env` (cadena de conexión de PostgreSQL, secret de NextAuth y credenciales de servicios).

### 4. Sincronizar base de datos
```bash
npx prisma db push
```

*(Opcional) Cargar datos de prueba:*
```bash
npm run db:seed
```

### 5. Iniciar en desarrollo
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en el puerto 3000.
- `npm run build`: Genera el cliente de Prisma y compila la aplicación para producción.
- `npm run start`: Inicia el servidor compilado en producción.
- `npm run lint`: Ejecuta el linter ESLint.
- `npm run db:seed`: Carga datos iniciales de prueba en la base de datos.
