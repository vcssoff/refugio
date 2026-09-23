export type PetType = "ADOPCION" | "PERDIDO" | "ENCONTRADO";
export type PetStatus = "PENDIENTE_MODERACION" | "PUBLICADO" | "RECHAZADO" | "ADOPTADO" | "REUNIDO";
export type Species = "PERRO" | "GATO" | "OTRO";
export type Gender = "MACHO" | "HEMBRA" | "DESCONOCIDO";
export type AgeGroup = "CACHORRO" | "JOVEN" | "ADULTO" | "SENIOR";
export type PetSize = "PEQUENO" | "MEDIANO" | "GRANDE";
export type UserRole = "ADMIN" | "REFUGIO" | "USUARIO";
export type ApplicationStatus = "ENVIADO" | "EN_REVISION" | "APROBADO" | "RECHAZADO";

export interface WebPImages {
  thumb: string;     // 320w
  card: string;      // 640w
  detail: string;    // 1024w
  original: string;  // 1600w
}

export const SPECIES_LABELS: Record<Species, string> = {
  PERRO: "Perro",
  GATO: "Gato",
  OTRO: "Otro",
};

export const TYPE_LABELS: Record<PetType, { label: string; badgeColor: string; description: string }> = {
  ADOPCION: {
    label: "En Adopción",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    description: "Busca un hogar responsable y cariñoso",
  },
  PERDIDO: {
    label: "Mascota Perdida",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
    description: "Su familia lo está buscando desesperadamente",
  },
  ENCONTRADO: {
    label: "Mascota Encontrada",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    description: "Fue hallado y se busca a su familia original",
  },
};

export const AGE_LABELS: Record<AgeGroup, string> = {
  CACHORRO: "Cachorro (0-1 año)",
  JOVEN: "Joven (1-3 años)",
  ADULTO: "Adulto (3-8 años)",
  SENIOR: "Senior (8+ años)",
};

export const SIZE_LABELS: Record<PetSize, string> = {
  PEQUENO: "Pequeño (hasta 10kg)",
  MEDIANO: "Mediano (10 a 25kg)",
  GRANDE: "Grande (más de 25kg)",
};

export const GENDER_LABELS: Record<Gender, string> = {
  MACHO: "Macho",
  HEMBRA: "Hembra",
  DESCONOCIDO: "Desconocido",
};

export const HOUSING_OPTIONS = [
  { value: "CASA_CON_PATIO_CERRADO", label: "Casa con patio cerrado y seguro" },
  { value: "CASA_SIN_PATIO", label: "Casa sin patio o jardín" },
  { value: "DEPARTAMENTO_CON_BALCON", label: "Departamento con balcón (protegido con red)" },
  { value: "DEPARTAMENTO_SIN_BALCON", label: "Departamento sin balcón" },
  { value: "QUINTA_O_CAMPO", label: "Quinta, chacra o casa de campo" },
];
