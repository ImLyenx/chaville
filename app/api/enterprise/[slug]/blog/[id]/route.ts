import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { blog, entreprise } from "@/lib/schema";
import { and, eq } from "drizzle-orm";

interface Params {
  params: {
    slug: string;
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug, id } = params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const enterprise = await db.query.entreprise.findFirst({
      where: eq(entreprise.slug, slug),
    });

    if (!enterprise) {
      return new NextResponse("Enterprise not found", { status: 404 });
    }

    if (enterprise.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const post = await db.query.blog.findFirst({
      where: and(
        eq(blog.id, parseInt(id)),
        eq(blog.entrepriseId, enterprise.id)
      ),
    });

    if (!post) {
      return new NextResponse("Blog post not found", { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { slug, id } = params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const enterprise = await db.query.entreprise.findFirst({
      where: eq(entreprise.slug, slug),
    });

    if (!enterprise) {
      return new NextResponse("Enterprise not found", { status: 404 });
    }

    if (enterprise.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const existingPost = await db.query.blog.findFirst({
      where: and(
        eq(blog.id, parseInt(id)),
        eq(blog.entrepriseId, enterprise.id)
      ),
    });

    if (!existingPost) {
      return new NextResponse("Blog post not found", { status: 404 });
    }

    const { title, content } = await request.json();

    if (!title?.trim()) {
      return new NextResponse("Title is required", { status: 400 });
    }

    if (!content?.trim()) {
      return new NextResponse("Content is required", { status: 400 });
    }

    await db
      .update(blog)
      .set({
        title: title.trim(),
        content,
        isValidated: false,
        updatedAt: new Date(),
      })
      .where(eq(blog.id, parseInt(id)));

    const updatedPost = await db.query.blog.findFirst({
      where: eq(blog.id, parseInt(id)),
    });

    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { slug, id } = params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const enterprise = await db.query.entreprise.findFirst({
      where: eq(entreprise.slug, slug),
    });

    if (!enterprise) {
      return new NextResponse("Enterprise not found", { status: 404 });
    }

    if (enterprise.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const existingPost = await db.query.blog.findFirst({
      where: and(
        eq(blog.id, parseInt(id)),
        eq(blog.entrepriseId, enterprise.id)
      ),
    });

    if (!existingPost) {
      return new NextResponse("Blog post not found", { status: 404 });
    }

    await db.delete(blog).where(eq(blog.id, parseInt(id)));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
