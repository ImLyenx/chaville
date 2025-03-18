import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { blog } from "@/lib/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!(session?.user?.role === "admin")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, isWrittenByAdmin } = await req.json();

    if (!title?.trim()) {
      return Response.json({ error: "Title is required" }, { status: 400 });
    }

    if (!content?.trim()) {
      return Response.json({ error: "Content is required" }, { status: 400 });
    }

    const [newBlogId] = await db
      .insert(blog)
      .values({
        title: title.trim(),
        content,
        isWrittenByAdmin,
        isValidated: isWrittenByAdmin,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();

    const [insertedBlog] = await db
      .select()
      .from(blog)
      .where(eq(blog.id, newBlogId.id));
    return Response.json(insertedBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || !session.user || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const blogs = await db.query.blog.findMany({
      limit,
      offset,
      orderBy: (blog, { desc }) => [desc(blog.createdAt)],
    });

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(blog);
    const total = totalResult[0].count;

    return NextResponse.json({
      blogs,
      total,
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
