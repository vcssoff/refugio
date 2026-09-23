import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando sembrado de datos (Seed)...");

  // Limpiar datos previos
  await prisma.petComment.deleteMany();
  await prisma.adoptionApplication.deleteMany();
  await prisma.petImage.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.userAdoptionProfile.deleteMany();
  await prisma.user.deleteMany();

  // 1. Crear Usuarios de prueba con datos de Uruguay
  const adminPassword = await bcrypt.hash("admin123", 10);
  const shelterPassword = await bcrypt.hash("refugio123", 10);
  const userPassword = await bcrypt.hash("usuario123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Administrador Refugio Patitas",
      email: "admin@patitas.uy",
      password: adminPassword,
      role: "ADMIN",
      isVerifiedShelter: true,
      city: "Montevideo, Uruguay",
      phone: "+598 99 111 222",
    },
  });

  const shelter = await prisma.user.create({
    data: {
      name: "Refugio Patitas Uruguay",
      email: "refugio@patitas.uy",
      password: shelterPassword,
      role: "REFUGIO",
      isVerifiedShelter: true,
      shelterName: "Refugio Patitas Sede Central Montevideo",
      phone: "+598 94 333 444",
      city: "Montevideo, Uruguay",
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: "Martín Rodríguez",
      email: "martin.uruguay@gmail.com",
      password: userPassword,
      role: "USUARIO",
      phone: "+598 98 555 666",
      city: "Pocitos, Montevideo",
    },
  });

  console.log("Usuarios creados: Admin, Refugio Verificado y Usuario Regular (Uruguay)");

  // 2. Mascotas en Adopción

  // Luna (Pocitos)
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
        "Luna fue rescatada en la zona de Pocitos. Es súper cariñosa, obediente y le encanta pasear por la rambla. Se entrega castrada y con libreta sanitaria al día. Ideal para familias con patio o departamento amplio con paseos diarios.",
      contactEmail: "refugio@patitas.uy",
      contactPhone: "+598 94 333 444",
      city: "Pocitos, Montevideo",
      address: "Plaza Gomensoro",
      latitude: -34.9152,
      longitude: -56.1495,
      shelterLocation: "Sede Pocitos / Parque Rodó (Visitas de 10:00 a 18:00hs)",
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

  // Abuelo Coco (VIEJITO / URGENTE - Patitas Doradas)
  const petCoco = await prisma.pet.create({
    data: {
      title: "Abuelo Coco, 11 añitos buscando un hogar cálido y tranquilo",
      type: "ADOPCION",
      status: "PUBLICADO",
      species: "PERRO",
      name: "Coco",
      gender: "MACHO",
      ageGroup: "SENIOR",
      size: "MEDIANO",
      color: "Canela y hocico canoso",
      isUrgent: true,
      healthCondition: "Cataratas leves en ojo derecho y artrosis controlada con suplementos",
      vaccinated: true,
      dewormed: true,
      neutered: true,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: true,
      description:
        "Coco es un viejito sabio, dulce y extremadamente leal. Su dueño anterior falleció y él necesita pasar sus años dorados en un hogar tibio con amor y siestas al sol. Camina despacito y le encanta que le acaricien las orejas. El refugio patrocina sus chequeos geriátricos de por vida.",
      contactEmail: "refugio@patitas.uy",
      contactPhone: "+598 94 333 444",
      city: "Carrasco, Montevideo",
      address: "Av. Arocena y Rivera",
      latitude: -34.8872,
      longitude: -56.0592,
      shelterLocation: "Sede Carrasco / Canelones (Visitas de 10:00 a 17:00hs)",
      userId: shelter.id,
      images: {
        create: [
          {
            urlThumb: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=320&auto=format&fit=crop&q=80",
            urlCard: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=640&auto=format&fit=crop&q=80",
            urlDetail: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1024&auto=format&fit=crop&q=85",
            urlOriginal: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1600&auto=format&fit=crop&q=90",
            order: 0,
          },
        ],
      },
    },
  });

  // Oliver (TRÍPODE / HERIDA / URGENTE)
  const petOliver = await prisma.pet.create({
    data: {
      title: "Oliver, gatazo valiente de 3 patitas buscando una segunda oportunidad",
      type: "ADOPCION",
      status: "PUBLICADO",
      species: "GATO",
      name: "Oliver",
      gender: "MACHO",
      ageGroup: "ADULTO",
      size: "MEDIANO",
      color: "Negro brillante y ojos verdes",
      isUrgent: true,
      healthCondition: "Le falta una patita trasera (trípode totalmente recuperado)",
      vaccinated: true,
      dewormed: true,
      neutered: true,
      goodWithKids: true,
      goodWithDogs: false,
      goodWithCats: true,
      description:
        "Oliver fue rescatado tras un accidente vial. Tuvo que ser amputada su pata trasera izquierda pero se recuperó de forma milagrosa y corre, salta y juega sin ningún impedimento. Es muy ronroneador y busca un departamento con redes en ventanas.",
      contactEmail: "refugio@patitas.uy",
      contactPhone: "+598 94 333 444",
      city: "Punta Carretas, Montevideo",
      address: "Ellauri y 21 de Setiembre",
      latitude: -34.9222,
      longitude: -56.1558,
      shelterLocation: "Sede Pocitos / Punta Carretas (Visitas con turno)",
      userId: shelter.id,
      images: {
        create: [
          {
            urlThumb: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=320&auto=format&fit=crop&q=80",
            urlCard: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=640&auto=format&fit=crop&q=80",
            urlDetail: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1024&auto=format&fit=crop&q=85",
            urlOriginal: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1600&auto=format&fit=crop&q=90",
            order: 0,
          },
        ],
      },
    },
  });

  // Milo (Cordón)
  const petMilo = await prisma.pet.create({
    data: {
      title: "Milo, gato naranja súper ronroneador y tranquilo",
      type: "ADOPCION",
      status: "PUBLICADO",
      species: "GATO",
      name: "Milo",
      gender: "MACHO",
      ageGroup: "JOVEN",
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
      contactEmail: "refugio@patitas.uy",
      contactPhone: "+598 94 333 444",
      city: "Cordón, Montevideo",
      address: "18 de Julio y Tristán Narvaja",
      latitude: -34.9038,
      longitude: -56.1752,
      shelterLocation: "Sede Cordón Centro (Visitas de 11:00 a 19:00hs)",
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

  // Rocco (Parque Rodó)
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
      contactEmail: "refugio@patitas.uy",
      contactPhone: "+598 94 333 444",
      city: "Parque Rodó, Montevideo",
      address: "Sarmiento y Rambla Presidente Wilson",
      latitude: -34.9150,
      longitude: -56.1680,
      shelterLocation: "Sede Parque Rodó (Visitas de 09:00 a 17:00hs)",
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

  // 3. Mascota Perdida (Pocitos, Montevideo - con radio de 300m)
  const petPerdido = await prisma.pet.create({
    data: {
      title: "URGENTE: Caniche blanco perdido con collar azul en Pocitos",
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
        "Se asustó con los ruidos del tránsito y salió corriendo por la zona de Benito Blanco y Av. Brasil. Llevaba collar azul sin chapita. Por favor avisar si alguien lo retuvo o lo vio cerca de la rambla.",
      contactEmail: "martin.uruguay@gmail.com",
      contactPhone: "+598 98 555 666",
      city: "Pocitos, Montevideo",
      address: "Av. Brasil y Benito Blanco",
      latitude: -34.9152,
      longitude: -56.1512,
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

  // Añadir un reporte de avistamiento comunitario para Simón
  await prisma.petComment.create({
    data: {
      petId: petPerdido.id,
      authorName: "Lucía Pérez",
      authorPhone: "+598 91 888 999",
      location: "Rambla República del Perú y Trouville",
      message:
        "¡Hola Martín! Creo haberlo visto hace unos 25 minutos corriendo hacia la plaza Trouville por la vereda de la rambla. Tenía el collar azul y parecía asustado. Intenté llamarlo pero siguió trotando hacia Punta Carretas.",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
  });

  // 4. Mascota Encontrada (Ciudad Vieja, Montevideo - con coordenadas para el mapa de 300m)
  const petEncontrado = await prisma.pet.create({
    data: {
      title: "Encontrado gatito siamés desorientado en peatonal Sarandí",
      type: "ENCONTRADO",
      status: "PUBLICADO",
      species: "GATO",
      gender: "DESCONOCIDO",
      ageGroup: "JOVEN",
      size: "PEQUENO",
      color: "Siamés (crema con puntas oscuras)",
      description:
        "Apareció en el hall de un edificio en peatonal Sarandí y Bartolomé Mitre. Es dócil, muy cariñoso y está bien cuidado, tiene pinta de haberse escapado de algún apartamento cercano.",
      contactEmail: "vecinos.ciudadvieja@gmail.com",
      contactPhone: "+598 99 777 888",
      city: "Ciudad Vieja, Montevideo",
      address: "Sarandí y Bartolomé Mitre",
      latitude: -34.9065,
      longitude: -56.2023,
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

  // 5. Mascota Pendiente de Moderación (Prado, Montevideo - para probar el panel de moderación)
  const petPendiente = await prisma.pet.create({
    data: {
      title: "Gatita tricolor rescatada en el Rosedal del Prado",
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
        "Cleo fue encontrada en el Prado. Es muy juguetona y sociable. Esperando aprobación de los moderadores para ser visible en el catálogo público.",
      contactEmail: "mariana.rescatista.uy@gmail.com",
      contactPhone: "+598 92 444 555",
      city: "Prado, Montevideo",
      latitude: -34.8625,
      longitude: -56.2052,
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

  console.log("Mascotas creadas con éxito con geolocalización en Montevideo, Uruguay.");
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
