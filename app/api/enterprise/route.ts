import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { entreprise } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, userId, siret, sector, logo } = body;

    // Validate SIRET format
    if (!/^\d{14}$/.test(siret)) {
      return NextResponse.json(
        { error: "Format de SIRET invalide" },
        { status: 400 }
      );
    }

    const enterpriseId = uuidv4();

    // Create the enterprise record
    await db.insert(entreprise).values({
      id: enterpriseId,
      name,
      description,
      userId,
      siret,
      sector,
      logo,
    });

    // Fetch the created enterprise
    const [newEnterprise] = await db
      .select()
      .from(entreprise)
      .where(eq(entreprise.id, enterpriseId));

    return NextResponse.json(newEnterprise);
  } catch (error) {
    console.error("Error creating enterprise:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'entreprise" },
      { status: 500 }
    );
  }
}
