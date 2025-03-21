import { db } from "@/lib/db";
import { entreprise, images, coordonnees, user, reviews } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch enterprise data with related user info
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

    // Fetch enterprise images
    const enterpriseImages = await db
      .select({
        url: images.url,
        alternatif: images.alternatif,
      })
      .from(images)
      .where(eq(images.entrepriseId, enterpriseData.id));

    // Fetch contact information
    const contactInfo = await db
      .select({
        type: coordonnees.type,
        link: coordonnees.link,
      })
      .from(coordonnees)
      .where(eq(coordonnees.entrepriseId, enterpriseData.id));

    // Fetch reviews data
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

    // Filter social links from contact info
    const socials = contactInfo.filter(
      (info) => info.type !== "phone" && info.type !== "email"
    );

    // Get phone and email from contacts
    const phone = contactInfo.find((c) => c.type === "phone")?.link || "";
    const email = contactInfo.find((c) => c.type === "email")?.link || "";

    // Prepare response data
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
