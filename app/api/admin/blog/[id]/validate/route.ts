import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { blog } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || !session.user || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return new NextResponse("Invalid blog post ID", { status: 400 });
    }

    const { isValidated } = await request.json();

    // Update the blog post validation status
    await db
      .update(blog)
      .set({
        isValidated,
        updatedAt: new Date(),
      })
      .where(eq(blog.id, parseInt(id)));

    const updatedPost = await db.query.blog.findFirst({
      where: eq(blog.id, parseInt(id)),
    });

    if (!updatedPost) {
      return new NextResponse("Blog post not found", { status: 404 });
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating blog post validation status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
