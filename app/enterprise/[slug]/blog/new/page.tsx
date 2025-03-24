"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Tiptap from "@/components/tiptap";
import { Header } from "@/app/header";
import Footer from "@/app/footer";
import { InfoIcon } from "lucide-react";

export default function NewEnterpriseBlogPage() {
  const params = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const slug = params.slug as string;

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Le titre est obligatoire");
      return;
    }

    if (!content.trim()) {
      toast.error("Le contenu est obligatoire");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/enterprise/${slug}/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create blog post");
      }

      toast.success("Article créé avec succès et en attente de validation");
      router.push(`/enterprise/${slug}/blog`);
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast.error("Erreur lors de la création de l'article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="sm:m-10 m-2">
      <Header />

      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl sm:m-10 mt-10">
        <Card>
          <CardHeader>
            <CardTitle>Nouvel article</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md flex items-start">
              <InfoIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-sm">Information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Votre article devra être validé par un administrateur avant
                  d&apos;être visible publiquement.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Titre de l'article"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  aria-required="true"
                  className="mb-4"
                />
              </div>
              <Tiptap
                initialContent={content}
                onUpdate={(newContent) => setContent(newContent)}
              />
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/enterprise/${slug}/blog`)}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-[#155093] text-white"
                >
                  {isSubmitting ? "Création..." : "Créer l'article"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </section>
  );
}
