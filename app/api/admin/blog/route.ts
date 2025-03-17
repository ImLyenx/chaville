import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blog } from "@/lib/schema";
import { desc, sql, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Get total count
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(blog);
    const total = totalCountResult[0].count;

    // Get paginated blogs
    const blogs = await db.query.blog.findMany({
      limit,
      offset,
      orderBy: [desc(blog.createdAt)],
    });

    return NextResponse.json({
      blogs,
      total,
    });
  } catch (error) {
    console.error("Error in blog API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    await db.delete(blog).where(eq(blog.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
