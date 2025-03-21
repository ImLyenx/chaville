import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { entreprise } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { notFound } from "next/navigation";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { isValidated } = await request.json();

    // Update the enterprise validation status
    await db
      .update(entreprise)
      .set({
        isValidated,
        updatedAt: new Date(),
      })
      .where(eq(entreprise.id, params.id));

    // Fetch the updated enterprise
    const [updatedEnterprise] = await db
      .select()
      .from(entreprise)
      .where(eq(entreprise.id, params.id));

    if (!updatedEnterprise) {
      return NextResponse.json(
        { error: "Entreprise non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEnterprise);
  } catch (error) {
    console.error("Error updating enterprise validation status:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
