import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { blog } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || !session.user || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await params;
    const blogPost = await db.query.blog.findFirst({
      where: eq(blog.id, parseInt(id)),
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
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || !session.user || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await params;
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
        isValidated: isWrittenByAdmin,
        updatedAt: new Date(),
      })
      .where(eq(blog.id, parseInt(id)));

    const updatedBlog = await db.query.blog.findFirst({
      where: eq(blog.id, parseInt(id)),
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || !session.user || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await params;
    await db.delete(blog).where(eq(blog.id, parseInt(id)));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
