import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || "Refugio <onboarding@resend.dev>";
const appUrl =
  process.env.NEXTAUTH_URL ||
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

interface PendingModerationParams {
  petId: string;
  petTitle: string;
  petType: string;
  authorEmail: string;
  toEmail?: string;
}

export async function sendPendingModerationAlert({
  petId,
  petTitle,
  petType,
  authorEmail,
  toEmail,
}: PendingModerationParams) {
  const targetEmail = toEmail || process.env.ADMIN_EMAIL || "admin@refugio.com";
  const moderationUrl = `${appUrl}/moderacion`;

  const subject = `🐾 Nueva publicación pendiente de moderación: "${petTitle}" (${petType})`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0d9488; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">🐾 Refugio - Moderación Requerida</h1>
      </div>
      <div style="padding: 24px;">
        <p>Hola,</p>
        <p>Se ha creado una nueva publicación que requiere tu revisión antes de ser visible en la plataforma:</p>
        <div style="background-color: #f8fafc; border-left: 4px solid #0d9488; padding: 12px 16px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Título:</strong> ${petTitle}</p>
          <p style="margin: 4px 0;"><strong>Tipo:</strong> ${petType}</p>
          <p style="margin: 4px 0;"><strong>Publicado por:</strong> ${authorEmail}</p>
        </div>
        <p>Para aprobarla o rechazarla, haz clic en el siguiente enlace:</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${moderationUrl}" style="background-color: #0d9488; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Ir al Panel de Moderación
          </a>
        </div>
      </div>
      <div style="background-color: #f1f5f9; padding: 12px; text-align: center; font-size: 12px; color: #64748b;">
        Plataforma Refugio • Cuidando a los animales juntos
      </div>
    </div>
  `;

  if (!resend) {
    console.log(`[EMAIL SIMULADO] Alerta de moderación para ${targetEmail}: "${petTitle}"`);
    return { success: true, simulated: true };
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: targetEmail,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error al enviar email con Resend:", error);
    return { success: false, error };
  }
}

interface AdoptionApplicationParams {
  petTitle: string;
  petId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  housingType: string;
  hasYard: boolean;
  freeTimeHours: string;
  householdMembers?: string;
  womenCount?: number;
  menCount?: number;
  teensCount?: number;
  kidsCount?: number;
  babiesCount?: number;
  dogsCount?: number;
  catsCount?: number;
  hasBabiesOrKids?: boolean;
  otherAnimals?: string | null;
  experience?: string | null;
  notes?: string | null;
  shelterEmail: string;
}

export async function sendAdoptionApplicationAlert(params: AdoptionApplicationParams) {
  const {
    petTitle,
    applicantName,
    applicantEmail,
    applicantPhone,
    housingType,
    hasYard,
    freeTimeHours,
    householdMembers,
    womenCount = 0,
    menCount = 0,
    teensCount = 0,
    kidsCount = 0,
    babiesCount = 0,
    dogsCount = 0,
    catsCount = 0,
    hasBabiesOrKids,
    otherAnimals,
    experience,
    notes,
    shelterEmail,
  } = params;

  const subject = `🐶 ¡Nueva postulación de adopción para "${petTitle}"!`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #059669; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">❤️ Solicitud de Adopción Recibida</h1>
      </div>
      <div style="padding: 24px;">
        <p>¡Buenas noticias! <strong>${applicantName}</strong> ha completado el formulario para adoptar a <strong>${petTitle}</strong>.</p>
        
        <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Datos de Contacto del Postulante</h3>
        <ul style="list-style: none; padding-left: 0;">
          <li><strong>Nombre:</strong> ${applicantName}</li>
          <li><strong>Email:</strong> <a href="mailto:${applicantEmail}">${applicantEmail}</a></li>
          <li><strong>Teléfono / WhatsApp:</strong> <a href="tel:${applicantPhone}">${applicantPhone}</a></li>
        </ul>

        <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Cuestionario de Adopción</h3>
        <ul style="list-style: none; padding-left: 0;">
          <li><strong>Tipo de vivienda:</strong> ${housingType}</li>
          <li><strong>¿Cuenta con patio cerrado?:</strong> ${hasYard ? "Sí, cuenta con patio seguro" : "No tiene patio"}</li>
          <li><strong>Tiempo libre para dedicarle:</strong> ${freeTimeHours}</li>
          <li><strong>Integrantes de la casa:</strong> ${householdMembers}</li>
          <li><strong>¿Hay niños o bebés en casa?:</strong> ${hasBabiesOrKids ? "Sí, hay niños/bebés" : "No"}</li>
          <li><strong>Otros animales en el hogar:</strong> ${otherAnimals || "Ninguno declarado"}</li>
          <li><strong>Experiencia previa con animales:</strong> ${experience || "No especificada"}</li>
        </ul>

        ${notes ? `
          <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Mensaje adicional del postulante:</h3>
          <p style="background: #f8fafc; padding: 12px; border-radius: 6px; font-style: italic;">"${notes}"</p>
        ` : ""}

        <div style="text-align: center; margin: 24px 0;">
          <a href="mailto:${applicantEmail}?subject=Respuesta%20a%20tu%20postulaci%C3%B3n%20para%20${encodeURIComponent(petTitle)}" style="background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Responder al Postulante por Email
          </a>
        </div>
      </div>
      <div style="background-color: #f1f5f9; padding: 12px; text-align: center; font-size: 12px; color: #64748b;">
        Refugio • Conectando corazones con patitas
      </div>
    </div>
  `;

  if (!resend) {
    console.log(`[EMAIL SIMULADO] Solicitud de adopción enviada a ${shelterEmail} para ${petTitle}`);
    return { success: true, simulated: true };
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: shelterEmail,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error al enviar email de postulación con Resend:", error);
    return { success: false, error };
  }
}
