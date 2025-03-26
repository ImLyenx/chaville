import { db } from "@/lib/db";
import { entreprise, images, coordonnees, user, reviews } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const [enterpriseData] = await db
      .select({
        id: entreprise.id,
        name: entreprise.name,
        description: entreprise.description,
        sector: entreprise.sector,
        logo: entreprise.logo,
        location: entreprise.location,
        status: entreprise.status,
        businessHours: entreprise.businessHours,
        siret: entreprise.siret,
        userId: entreprise.userId,
        userName: user.name,
      })
      .from(entreprise)
      .leftJoin(user, eq(entreprise.userId, user.id))
      .where(eq(entreprise.slug, slug));

    if (!enterpriseData) {
      return NextResponse.json(
        { error: "Enterprise not found" },
        { status: 404 }
      );
    }

    const enterpriseImages = await db
      .select({
        url: images.url,
        alternatif: images.alternatif,
      })
      .from(images)
      .where(eq(images.entrepriseId, enterpriseData.id));

    const contactInfo = await db
      .select({
        type: coordonnees.type,
        link: coordonnees.link,
      })
      .from(coordonnees)
      .where(eq(coordonnees.entrepriseId, enterpriseData.id));

    const [reviewsData] = await db
      .select({
        avgRating: sql<number>`CAST(AVG(${reviews.rating}) AS DECIMAL(2,1))`,
        totalCount: sql<number>`COUNT(*)`,
        distribution: sql<Record<number, number>>`
          JSON_OBJECT(
            '1', SUM(CASE WHEN ${reviews.rating} = 1 THEN 1 ELSE 0 END),
            '2', SUM(CASE WHEN ${reviews.rating} = 2 THEN 1 ELSE 0 END),
            '3', SUM(CASE WHEN ${reviews.rating} = 3 THEN 1 ELSE 0 END),
            '4', SUM(CASE WHEN ${reviews.rating} = 4 THEN 1 ELSE 0 END),
            '5', SUM(CASE WHEN ${reviews.rating} = 5 THEN 1 ELSE 0 END)
          )
        `,
      })
      .from(reviews)
      .where(eq(reviews.entrepriseId, enterpriseData.id));

    const socials = contactInfo.filter(
      (info) => info.type !== "phone" && info.type !== "email"
    );

    const phone = contactInfo.find((c) => c.type === "phone")?.link || "";
    const email = contactInfo.find((c) => c.type === "email")?.link || "";

    const responseData = {
      ...enterpriseData,
      photos: enterpriseImages.map((img) => img.url),
      coordonnees: contactInfo,
      socials,
      phone,
      email,
      reviews: {
        rating: reviewsData.avgRating || 0,
        count: reviewsData.totalCount || 0,
        distribution: reviewsData.distribution || {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching enterprise:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();

    const [enterprise] = await db
      .select({
        id: entreprise.id,
        userId: entreprise.userId,
      })
      .from(entreprise)
      .where(eq(entreprise.slug, slug));

    if (!enterprise) {
      return NextResponse.json(
        { error: "Enterprise not found" },
        { status: 404 }
      );
    }

    if (enterprise.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db
      .update(entreprise)
      .set({
        name: body.name,
        sector: body.sector,
        description: body.description,
        logo: body.logo,
      })
      .where(eq(entreprise.id, enterprise.id));

    await db.delete(images).where(eq(images.entrepriseId, enterprise.id));

    if (body.photos && body.photos.length > 0) {
      await db.insert(images).values(
        body.photos.map((url: string) => ({
          id: uuidv4(),
          entrepriseId: enterprise.id,
          url,
          alternatif: body.name,
        }))
      );
    }

    await db
      .delete(coordonnees)
      .where(eq(coordonnees.entrepriseId, enterprise.id));

    if (body.coordonnees && body.coordonnees.length > 0) {
      await db.insert(coordonnees).values(
        body.coordonnees.map((contact: { type: string; link: string }) => ({
          id: uuidv4(),
          entrepriseId: enterprise.id,
          type: contact.type,
          link: contact.link,
        }))
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating enterprise:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
