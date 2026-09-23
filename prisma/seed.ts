import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando sembrado de datos (Seed)...");

  // Limpiar datos previos
  await prisma.adoptionApplication.deleteMany();
  await prisma.petImage.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.user.deleteMany();

  // 1. Crear Usuarios de prueba
  const adminPassword = await bcrypt.hash("admin123", 10);
  const shelterPassword = await bcrypt.hash("refugio123", 10);
  const userPassword = await bcrypt.hash("usuario123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Administrador Refugio",
      email: "admin@refugio.com",
      password: adminPassword,
      role: "ADMIN",
      isVerifiedShelter: true,
      city: "Buenos Aires",
    },
  });

  const shelter = await prisma.user.create({
    data: {
      name: "Asociación Huellas Unidas",
      email: "refugio@huellas.org",
      password: shelterPassword,
      role: "REFUGIO",
      isVerifiedShelter: true,
      shelterName: "Huellas Unidas Rescate Animal",
      phone: "+54 9 11 5555-0101",
      city: "Buenos Aires",
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: "Carlos Gómez",
      email: "usuario@ejemplo.com",
      password: userPassword,
      role: "USUARIO",
      phone: "+54 9 11 4444-0202",
      city: "Buenos Aires",
    },
  });

  console.log("Usuarios creados: Admin, Refugio Verificado y Usuario Regular");

  // 2. Mascotas en Adopción
  const petLuna = await prisma.pet.create({
    data: {
      title: "Luna, perrita mestiza dulce y juguetona busca hogar",
      type: "ADOPCION",
      status: "PUBLICADO",
      species: "PERRO",
      name: "Luna",
      gender: "HEMBRA",
      ageGroup: "JOVEN",
      size: "MEDIANO",
      color: "Dorado y blanco",
      vaccinated: true,
      dewormed: true,
      neutered: true,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      description:
        "Luna fue rescatada de un terreno baldío. Es súper cariñosa, obediente y le encanta salir a pasear. Se entrega castrada y con libreta sanitaria completa. Ideal para familias con patio o departamento amplio con paseos diarios.",
      contactEmail: "refugio@huellas.org",
      contactPhone: "+54 9 11 5555-0101",
      city: "Palermo, CABA",
      address: "Plaza Armenia",
      latitude: -34.5886,
      longitude: -58.4239,
      userId: shelter.id,
      images: {
        create: [
          {
            urlThumb: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=320&auto=format&fit=crop&q=80",
            urlCard: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=640&auto=format&fit=crop&q=80",
            urlDetail: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1024&auto=format&fit=crop&q=85",
            urlOriginal: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1600&auto=format&fit=crop&q=90",
            order: 0,
          },
          {
            urlThumb: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=320&auto=format&fit=crop&q=80",
            urlCard: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=640&auto=format&fit=crop&q=80",
            urlDetail: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1024&auto=format&fit=crop&q=85",
            urlOriginal: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1600&auto=format&fit=crop&q=90",
            order: 1,
          },
        ],
      },
    },
  });

  const petMilo = await prisma.pet.create({
    data: {
      title: "Milo, gato naranja súper ronroneador y tranquilo",
      type: "ADOPCION",
      status: "PUBLICADO",
      species: "GATO",
      name: "Milo",
      gender: "MACHO",
      ageGroup: "ADULTO",
      size: "PEQUENO",
      color: "Naranja atigrado",
      vaccinated: true,
      dewormed: true,
      neutered: true,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: true,
      description:
        "Milo tiene 2 años. Es muy mimoso, utiliza el arenero a la perfección y convive pacíficamente con otros gatos. Se entrega a hogares con protección en ventanas o balcones.",
      contactEmail: "refugio@huellas.org",
      contactPhone: "+54 9 11 5555-0101",
      city: "Belgrano, CABA",
      address: "Av. Cabildo y Juramento",
      latitude: -34.5627,
      longitude: -58.4563,
      userId: shelter.id,
      images: {
        create: [
          {
            urlThumb: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=320&auto=format&fit=crop&q=80",
            urlCard: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=640&auto=format&fit=crop&q=80",
            urlDetail: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1024&auto=format&fit=crop&q=85",
            urlOriginal: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1600&auto=format&fit=crop&q=90",
            order: 0,
          },
        ],
      },
    },
  });

  const petRocco = await prisma.pet.create({
    data: {
      title: "Rocco, cachorro cruza de labrador con ganas de aprender",
      type: "ADOPCION",
      status: "PUBLICADO",
      species: "PERRO",
      name: "Rocco",
      gender: "MACHO",
      ageGroup: "CACHORRO",
      size: "GRANDE",
      color: "Negro brillante",
      vaccinated: true,
      dewormed: true,
      neutered: false,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: true,
      description:
        "Rocco tiene apenas 5 meses. Es activo, alegre y sociable. Compromiso de castración a los 6 meses firmado en el contrato de adopción.",
      contactEmail: "refugio@huellas.org",
      contactPhone: "+54 9 11 5555-0101",
      city: "Caballito, CABA",
      address: "Parque Rivadavia",
      latitude: -34.6186,
      longitude: -58.4354,
      userId: shelter.id,
      images: {
        create: [
          {
            urlThumb: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=320&auto=format&fit=crop&q=80",
            urlCard: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=640&auto=format&fit=crop&q=80",
            urlDetail: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=1024&auto=format&fit=crop&q=85",
            urlOriginal: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=1600&auto=format&fit=crop&q=90",
            order: 0,
          },
        ],
      },
    },
  });

  // 3. Mascota Perdida (con coordenadas exactas y radio de 300m)
  const petPerdido = await prisma.pet.create({
    data: {
      title: "URGENTE: Caniche blanco perdido con collar azul",
      type: "PERDIDO",
      status: "PUBLICADO",
      species: "PERRO",
      name: "Simón",
      gender: "MACHO",
      ageGroup: "ADULTO",
      size: "PEQUENO",
      color: "Blanco rizado",
      vaccinated: true,
      neutered: true,
      description:
        "Se asustó con una moto y salió corriendo por la zona de Plaza Serrano. Llevaba collar azul sin chapita. Por favor avisar si alguien lo retuvo o lo vio.",
      contactEmail: "carlos.gomez@gmail.com",
      contactPhone: "+54 9 11 4444-0202",
      city: "Palermo Soho, CABA",
      address: "Honduras y Thames (Plaza Serrano)",
      latitude: -34.5884,
      longitude: -58.4307,
      lostOrFoundDate: new Date(),
      userId: regularUser.id,
      images: {
        create: [
          {
            urlThumb: "https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?w=320&auto=format&fit=crop&q=80",
            urlCard: "https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?w=640&auto=format&fit=crop&q=80",
            urlDetail: "https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?w=1024&auto=format&fit=crop&q=85",
            urlOriginal: "https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?w=1600&auto=format&fit=crop&q=90",
            order: 0,
          },
        ],
      },
    },
  });

  // 4. Mascota Encontrada (con coordenadas para el mapa de 300m)
  const petEncontrado = await prisma.pet.create({
    data: {
      title: "Encontrado gatito siamés desorientado en San Telmo",
      type: "ENCONTRADO",
      status: "PUBLICADO",
      species: "GATO",
      gender: "DESCONOCIDO",
      ageGroup: "JOVEN",
      size: "PEQUENO",
      color: "Siamés (crema con puntas oscuras)",
      description:
        "Apareció en el patio de un café en Defensa y San Juan. Es dócil y está bien cuidado, tiene pinta de haberse escapado de alguna casa cercana.",
      contactEmail: "vecinos.santelmo@gmail.com",
      contactPhone: "+54 9 11 3333-0303",
      city: "San Telmo, CABA",
      address: "Defensa y Av. San Juan",
      latitude: -34.6212,
      longitude: -58.3718,
      lostOrFoundDate: new Date(),
      userId: regularUser.id,
      images: {
        create: [
          {
            urlThumb: "https://images.unsplash.com/photo-1513360309081-36f20ca48f22?w=320&auto=format&fit=crop&q=80",
            urlCard: "https://images.unsplash.com/photo-1513360309081-36f20ca48f22?w=640&auto=format&fit=crop&q=80",
            urlDetail: "https://images.unsplash.com/photo-1513360309081-36f20ca48f22?w=1024&auto=format&fit=crop&q=85",
            urlOriginal: "https://images.unsplash.com/photo-1513360309081-36f20ca48f22?w=1600&auto=format&fit=crop&q=90",
            order: 0,
          },
        ],
      },
    },
  });

  // 5. Mascota Pendiente de Moderación (para probar el panel de moderación)
  const petPendiente = await prisma.pet.create({
    data: {
      title: "Gatita tricolor rescatada busca familia",
      type: "ADOPCION",
      status: "PENDIENTE_MODERACION",
      species: "GATO",
      name: "Cleo",
      gender: "HEMBRA",
      ageGroup: "CACHORRO",
      size: "PEQUENO",
      color: "Calicó / Tricolor",
      vaccinated: true,
      dewormed: true,
      neutered: false,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: true,
      description:
        "Cleo fue encontrada en una caja. Es muy juguetona y sociable. Esperando aprobación de los moderadores para ser visible en el catálogo público.",
      contactEmail: "mariana.rescatista@gmail.com",
      contactPhone: "+54 9 11 2222-0404",
      city: "Villa Urquiza, CABA",
      userId: regularUser.id,
      images: {
        create: [
          {
            urlThumb: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=320&auto=format&fit=crop&q=80",
            urlCard: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=640&auto=format&fit=crop&q=80",
            urlDetail: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=1024&auto=format&fit=crop&q=85",
            urlOriginal: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=1600&auto=format&fit=crop&q=90",
            order: 0,
          },
        ],
      },
    },
  });

  console.log("Mascotas creadas con éxito.");
  console.log("¡Sembrado finalizado exitosamente!");
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
