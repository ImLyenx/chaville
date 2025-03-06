import { EmailTemplate } from "@/components/test-email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  type: "email-verif" | "support" | "user-contact",
  to: string,
  params: Record<string, any>
) => {
  console.log(type, to, params);
  if (type === "email-verif") {
    const { data, error } = await resend.emails.send({
      from: `Chaville Entrepreneurs <${process.env.RESEND_FROM_EMAIL}>`,
      to: [to],
      subject: "Vérifiez votre adresse email",
      text: `Cliquez sur le lien suivant pour vérifier votre adresse email: ${params.url}`,
    });
    return { data, error };
  } else if (type === "support") {
    const { data, error } = await resend.emails.send({
      from: `Chaville Entrepreneurs <${process.env.RESEND_FROM_EMAIL}>`,
      to: [process.env.RESEND_SUPPORT_EMAIL!],
      subject: "Nouveau message de support",
      text: `De: ${params.email}\n\n${params.message}`,
    });
  } else if (type === "user-contact") {
    const { data, error } = await resend.emails.send({
      from: `Chaville Entrepreneurs <${process.env.RESEND_FROM_EMAIL}>`,
      to: [process.env.RESEND_SUPPORT_EMAIL!],
      subject: "Nouveau message de contact",
      text: `De: ${params.email}\n\n${params.message}`,
    });
  }
};
