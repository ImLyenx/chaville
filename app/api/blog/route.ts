import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blog } from "@/lib/schema";
import { eq, count } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Only fetch validated blog posts for public consumption
    const posts = await db.query.blog.findMany({
      where: eq(blog.isValidated, true),
      orderBy: (blog, { desc }) => [desc(blog.createdAt)],
      limit,
      offset,
    });

    const totalPosts = await db
      .select({ count: count() })
      .from(blog)
      .where(eq(blog.isValidated, true));

    const totalCount = Number(totalPosts[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        totalPages,
        totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
