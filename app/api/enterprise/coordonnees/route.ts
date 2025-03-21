import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { coordonnees } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { coordonnees: coordonneesList } = body;

    // Create the coordonnees records
    await db.insert(coordonnees).values(
      coordonneesList.map(
        (coordonnee: {
          type: string;
          link: string;
          label?: string;
          entrepriseId: string;
        }) => ({
          id: uuidv4(),
          type:
            coordonnee.type === "Autre" ? coordonnee.label : coordonnee.type,
          link: coordonnee.link,
          entrepriseId: coordonnee.entrepriseId,
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating coordonnees:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création des coordonnées" },
      { status: 500 }
    );
  }
}
