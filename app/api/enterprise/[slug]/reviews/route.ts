import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews, entreprise, user } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { eq, and, desc } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get enterprise ID from slug
    const [enterprise] = await db
      .select({ id: entreprise.id })
      .from(entreprise)
      .where(eq(entreprise.slug, slug));

    if (!enterprise) {
      return NextResponse.json(
        { error: "Entreprise non trouvée" },
        { status: 404 }
      );
    }

    // Fetch reviews with user information
    const reviewsList = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        userName: user.name,
      })
      .from(reviews)
      .leftJoin(user, eq(reviews.userId, user.id))
      .where(eq(reviews.entrepriseId, enterprise.id))
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json(reviewsList);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des avis" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log("Received request for slug:", slug);

    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour laisser un avis" },
        { status: 401 }
      );
    }

    // Get enterprise ID from slug
    console.log("Looking for enterprise with slug:", slug);
    const query = db
      .select({ id: entreprise.id })
      .from(entreprise)
      .where(eq(entreprise.slug, slug));

    console.log("SQL Query:", query.toSQL());
    const [enterprise] = await query;

    console.log("Enterprise found:", enterprise);

    if (!enterprise) {
      return NextResponse.json(
        { error: "Entreprise non trouvée" },
        { status: 404 }
      );
    }

    const { rating, comment } = await request.json();

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "La note doit être comprise entre 1 et 5" },
        { status: 400 }
      );
    }

    // Check if user has already reviewed this enterprise
    const [existingReview] = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.entrepriseId, enterprise.id),
          eq(reviews.userId, session.user.id)
        )
      );

    if (existingReview) {
      return NextResponse.json(
        { error: "Vous avez déjà laissé un avis pour cette entreprise" },
        { status: 400 }
      );
    }

    // Create the review
    await db.insert(reviews).values({
      id: uuidv4(),
      rating,
      comment: comment || null,
      entrepriseId: enterprise.id,
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création de l'avis" },
      { status: 500 }
    );
  }
}
