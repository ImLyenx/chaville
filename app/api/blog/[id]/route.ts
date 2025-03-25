import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blog } from "@/lib/schema";
import { eq } from "drizzle-orm";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return new NextResponse("Invalid blog post ID", { status: 400 });
    }

    // Only allow access to validated blog posts
    const post = await db.query.blog.findFirst({
      where: eq(blog.id, parseInt(id)),
    });

    if (!post) {
      return new NextResponse("Blog post not found", { status: 404 });
    }

    // Only return validated posts to public users
    if (!post.isValidated) {
      return new NextResponse("Blog post not found", { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
