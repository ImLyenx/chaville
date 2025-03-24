import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { entreprise } from "@/lib/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { generateSlug } from "@/lib/utils";
import type { InferModel } from "drizzle-orm";

type Enterprise = InferModel<typeof entreprise, "select"> & {
  user?: {
    name: string | null;
  } | null;
};

export async function GET() {
  try {
    const fetchedEnterprises = await db.query.entreprise.findMany({
      with: {
        user: true,
      },
    });

    // Transform the response to include user's full name
    const transformedEnterprises = fetchedEnterprises.map(
      (enterprise: Enterprise) => ({
        ...enterprise,
        userName: enterprise.user?.name || null,
        user: undefined, // Remove the full user object from the response
      })
    );

    return NextResponse.json(transformedEnterprises);
  } catch (error) {
    console.error("Error fetching enterprises:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const baseSlug = generateSlug(name);

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
