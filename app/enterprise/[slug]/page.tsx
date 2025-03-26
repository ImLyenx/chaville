import { EnterpriseProfile } from "@/components/enterprise/enterprise-profile";
import { EnterpriseData } from "@/lib/types";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Header } from "@/app/header";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getEnterpriseData(
  slug: string
): Promise<EnterpriseData & { isOwner: boolean }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;

  const response = await fetch(
    `http://localhost:3000/api/enterprise/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error("Failed to fetch enterprise data");
  }

  const data = await response.json();

  const socials = data.coordonnees.map(
    (coord: { type: string; link: string }) => {
      const type = coord.type.toLowerCase();
      let label = "";

      switch (type) {
        case "facebook":
          label = "Facebook";
          break;
        case "instagram":
          label = "Instagram";
          break;
        case "twitter":
          label = "Twitter";
          break;
        case "website":
          label = "Site web";
          break;
        case "téléphone":
        case "telephone":
        case "phone":
          return {
            type: "phone",
            value: coord.link,
            label: formatPhoneDisplay(coord.link),
          };
        case "email":
          return {
            type: "email",
            value: coord.link,
            label: coord.link,
          };
        default:
          label = type.charAt(0).toUpperCase() + type.slice(1);
      }

      return {
        type,
        value: coord.link,
        label,
      };
    }
  );

  return {
    name: data.name,
    sector: data.sector,
    description: data.description || null,
    logo: data.logo || null,
    photos: data.photos || [],
    socials,
    slug,
    reviews: {
      rating: Number(data.reviews?.rating || 0),
      count: data.reviews?.count || 0,
      distribution: data.reviews?.distribution || {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    },
    isOwner: userId === data.userId,
  };
}

// Helper function to format phone numbers
function formatPhoneDisplay(phone: string): string {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Format French phone number
  if (cleaned.startsWith("33")) {
    return cleaned.replace(
      /(\d{2})(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/,
      "+$1 $2 $3 $4 $5 $6"
    );
  }

  // Format regular phone number
  return cleaned.replace(
    /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
    "$1 $2 $3 $4 $5"
  );
}

export default async function EnterprisePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getEnterpriseData(slug);

  return (
    <main className="min-h-screen bg-background">
      <div className="sm:m-10 m-2">
        <Header />
      </div>
      <div className="py-8">
        <EnterpriseProfile {...data} />
      </div>
    </main>
  );
}
