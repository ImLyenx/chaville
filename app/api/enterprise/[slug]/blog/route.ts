import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { blog, entreprise } from "@/lib/schema";
import { eq } from "drizzle-orm";

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = params;
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

    const posts = await db.query.blog.findMany({
      where: eq(blog.entrepriseId, enterprise.id),
      orderBy: (blog, { desc }) => [desc(blog.createdAt)],
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching enterprise blog posts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { slug } = params;
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

    const { title, content } = await request.json();

    if (!title?.trim()) {
      return new NextResponse("Title is required", { status: 400 });
    }

    if (!content?.trim()) {
      return new NextResponse("Content is required", { status: 400 });
    }

    const [newBlogId] = await db
      .insert(blog)
      .values({
        title: title.trim(),
        content,
        isWrittenByAdmin: false,
        isValidated: false,
        entrepriseId: enterprise.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();

    const [insertedBlog] = await db
      .select()
      .from(blog)
      .where(eq(blog.id, newBlogId.id));

    return NextResponse.json({ post: insertedBlog });
  } catch (error) {
    console.error("Error creating enterprise blog post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
