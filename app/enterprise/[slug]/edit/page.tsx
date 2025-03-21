import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { EnterpriseEditForm } from "@/components/enterprise/enterprise-edit-form";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getEnterpriseData(slug: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/sign-in");
  }

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

  if (userId !== data.userId) {
    redirect("/");
  }

  return data;
}

export default async function EditEnterprisePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getEnterpriseData(slug);

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Modifier {data.name}</h1>
        <EnterpriseEditForm {...data} slug={slug} />
      </div>
    </main>
  );
}
