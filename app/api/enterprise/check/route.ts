import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { entreprise } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const enterprise = await db.query.entreprise.findFirst({
      where: eq(entreprise.userId, session.user.id),
      columns: {
        slug: true,
      },
    });

    return NextResponse.json({ slug: enterprise?.slug || null });
  } catch (error) {
    console.error("Failed to check enterprise:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
