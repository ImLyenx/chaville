import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { images } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

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
