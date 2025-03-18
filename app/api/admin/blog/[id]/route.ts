import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { blog } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || !session.user || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const blogPost = await db.query.blog.findFirst({
      where: eq(blog.id, parseInt(params.id)),
    });

    if (!blogPost) {
      return new NextResponse("Blog post not found", { status: 404 });
    }

    return NextResponse.json(blogPost);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || !session.user || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, isWrittenByAdmin } = body;

    if (!title?.trim()) {
      return new NextResponse("Title is required", { status: 400 });
    }

    await db
      .update(blog)
      .set({
        title: title.trim(),
        content,
        isWrittenByAdmin,
        updatedAt: new Date(),
      })
      .where(eq(blog.id, parseInt(params.id)));

    const updatedBlog = await db.query.blog.findFirst({
      where: eq(blog.id, parseInt(params.id)),
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
