import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { images } from "@/lib/schema";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { images: imagesList } = body;

    // Create the image records
    await db.insert(images).values(
      imagesList.map(
        (image: { url: string; alternatif: string; entrepriseId: string }) => ({
          id: uuidv4(),
          ...image,
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating images:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création des images" },
      { status: 500 }
    );
  }
}
