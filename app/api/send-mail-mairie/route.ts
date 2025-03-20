"use server";

import { sendEmail } from "@/lib/email";

export async function sendSupportEmail(message: string) {
  if (!process.env.RESEND_FROM_EMAIL || !process.env.RESEND_SUPPORT_EMAIL) {
    throw new Error("Les variables d'environnement ne sont pas définies.");
  }

  const result = await sendEmail("support", process.env.RESEND_SUPPORT_EMAIL!, { message });

  if (!result || result.error) {
    throw new Error(result?.error?.message || "Erreur inconnue lors de l'envoi de l'email.");
  }

  return result.data;
}
