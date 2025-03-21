import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { entreprise } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { generateSlug } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, userId, siret, sector, logo } = body;

    // Validate SIRET format
    if (!/^\d{14}$/.test(siret)) {
      return NextResponse.json(
        { error: "Format de SIRET invalide" },
        { status: 400 }
      );
    }

    // Generate base slug from name
    let baseSlug = generateSlug(name);

    // Check for existing slugs with the same base
    const existingSlugs = await db
      .select({ slug: entreprise.slug })
      .from(entreprise)
      .where(eq(entreprise.slug, baseSlug));

    // Ensure unique slug
    let slug = baseSlug;
    let counter = 1;
    while (existingSlugs.some((e) => e.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const enterpriseId = uuidv4();

    // Create enterprise with generated slug
    await db.insert(entreprise).values({
      id: enterpriseId,
      name,
      slug,
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
