"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Tiptap from "@/components/tiptap";
import { Header } from "@/app/header";
import Footer from "@/app/footer";
import { InfoIcon } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  isWrittenByAdmin: boolean;
  isValidated: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditEnterpriseBlogPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const slug = params.slug as string;
  const postId = params.id as string;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/enterprise/${slug}/blog/${postId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        setPost(data.post);
        setTitle(data.post.title);
        setContent(data.post.content);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Erreur lors du chargement de l'article");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug && postId) {
      fetchPost();
    }
  }, [slug, postId]);

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
      const response = await fetch(`/api/enterprise/${slug}/blog/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update blog post");
      }

      toast.success("Article mis à jour avec succès");

      // If the post was already validated, inform that it will need revalidation
      if (post?.isValidated) {
        toast.info(
          "Votre article devra être validé à nouveau par un administrateur"
        );
      }

      router.push(`/enterprise/${slug}/blog`);
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast.error("Erreur lors de la mise à jour de l'article");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="sm:m-10 m-2">
        <Header />
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl sm:m-10 mt-10">
          <div className="flex items-center justify-center min-h-[300px]">
            <p>Chargement...</p>
          </div>
        </div>
        <Footer />
      </section>
    );
  }

  if (!post) {
    return (
      <section className="sm:m-10 m-2">
        <Header />
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl sm:m-10 mt-10">
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">Article introuvable</h2>
            <p className="text-muted-foreground mb-6">
              Cet article n&apos;existe pas ou a été supprimé.
            </p>
            <Button
              className="bg-[#155093] text-white px-5 rounded-full"
              onClick={() => router.push(`/enterprise/${slug}/blog`)}
            >
              Retour aux articles
            </Button>
          </div>
        </div>
        <Footer />
      </section>
    );
  }

  return (
    <section className="sm:m-10 m-2">
      <Header />

      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl sm:m-10 mt-10">
        <Card>
          <CardHeader>
            <CardTitle>Modifier l&apos;article</CardTitle>
          </CardHeader>
          <CardContent>
            {post.isValidated && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md flex items-start">
                <InfoIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm">Information</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    La modification de cet article nécessitera une nouvelle
                    validation par un administrateur avant d&apos;être visible
                    publiquement.
                  </p>
                </div>
              </div>
            )}

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
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
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
