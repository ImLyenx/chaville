import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  type: "email-verif" | "support" | "user-contact",
  to: string,
  params: Record<string, any>
) => {
  console.log("🚀 sendEmail() appelé avec :", { type, to, params });

  try {
    if (type === "email-verif") {
      console.log("📧 Envoi d'un email-verif...");
      return await resend.emails.send({
        from: `Chaville Entrepreneurs <${process.env.RESEND_FROM_EMAIL}>`,
        to: [to],
        subject: "Vérifiez votre adresse email",
        text: `Cliquez sur le lien suivant pour vérifier votre adresse email: ${params.url}`,
      });
    }

    if (type === "support") {
      console.log("📧 Envoi d'un email de support...");
      return await resend.emails.send({
        from: `Chaville Entrepreneurs <${process.env.RESEND_FROM_EMAIL}>`,
        to: [to],
        subject: "Nouveau message de support",
        text: `De: ${params.email}\n\n${params.message}`,
      });
    }

    if (type === "user-contact") {
      console.log("📧 Envoi d'un email de contact utilisateur...");
      return await resend.emails.send({
        from: `Chaville Entrepreneurs <${process.env.RESEND_FROM_EMAIL}>`,
        to: [to],
        subject: "Nouveau message de contact",
        text: `De: ${params.email}\n\n${params.message}`,
      });
    }

    console.warn("❗ Type d'email non géré :", type);
    return { error: { message: "Type d'email non pris en charge" } };
  } catch (err) {
    console.error("❌ Erreur dans sendEmail:", err);
    return { error: { message: (err as Error).message } };
  }
};

