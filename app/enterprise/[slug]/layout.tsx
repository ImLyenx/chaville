import { Metadata } from "next";
import { db } from "@/lib/db";
import { entreprise } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { use } from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { slug } = await params;

  const [enterprise] = await db
    .select({
      name: entreprise.name,
      description: entreprise.description,
    })
    .from(entreprise)
    .where(eq(entreprise.slug, slug));

  if (!enterprise) {
    return {
      title: "Enterprise not found - Chaville",
      description: "The requested enterprise could not be found.",
    };
  }

  return {
    title: `${enterprise.name} - Chaville`,
    description: enterprise.description,
  };
}

export default function EnterpriseLayout({ children }: LayoutProps) {
  return children;
}
