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

// Fetch all blog posts for an enterprise
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the enterprise ID for this slug
    const enterprise = await db.query.entreprise.findFirst({
      where: eq(entreprise.slug, slug),
    });

    if (!enterprise) {
      return new NextResponse("Enterprise not found", { status: 404 });
    }

    // Verify the user is the owner of this enterprise
    if (enterprise.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Get all blog posts from this enterprise
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

// Create a new blog post for an enterprise
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { slug } = params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the enterprise for this slug
    const enterprise = await db.query.entreprise.findFirst({
      where: eq(entreprise.slug, slug),
    });

    if (!enterprise) {
      return new NextResponse("Enterprise not found", { status: 404 });
    }

    // Verify the user is the owner of this enterprise
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

    // Enterprise-created posts are not validated by default
    const [newBlogId] = await db
      .insert(blog)
      .values({
        title: title.trim(),
        content,
        isWrittenByAdmin: false,
        isValidated: false, // Requires admin validation
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
