import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { subject, message, fileUrls, email } = await req.json();

    if (!process.env.RESEND_FROM_EMAIL || !process.env.RESEND_SUPPORT_EMAIL) {
      throw new Error("Les variables d'environnement ne sont pas définies.");
    }
    // Construire le message avec les fichiers s’il y en a
    let fullMessage = message;
    if (fileUrls?.length) {
      fullMessage += `\n\nFichiers joints :\n${fileUrls.join("\n")}`;
    }

    const result = await sendEmail("support", process.env.RESEND_SUPPORT_EMAIL!, {
      email,
      message: fullMessage,
      subject,
    });

    if (!result || result.error) {
      console.log("📨 Erreur Resend :", result);
      throw new Error(result?.error?.message || "Erreur lors de l'envoi de l'e-mail.");
    }

    return new Response(JSON.stringify({ message: "Message envoyé", result: result.data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Erreur API /send-mail-mairie :", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

