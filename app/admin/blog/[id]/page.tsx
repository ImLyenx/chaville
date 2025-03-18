"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Tiptap from "@/components/tiptap";
import { authClient } from "@/lib/auth-client";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  isWrittenByAdmin: boolean;
  entrepriseId: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/blog/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch post");
        const data = await response.json();
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Erreur lors du chargement de l'article");
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Le titre est obligatoire");
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content,
          isWrittenByAdmin: session?.user?.role === "admin",
        }),
      });

      if (!response.ok) throw new Error("Failed to update post");

      toast.success("Article mis à jour avec succès");
      router.push("/admin/blog");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Erreur lors de la mise à jour de l'article");
    }
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Modifier l'article</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Titre de l'article"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                aria-required="true"
              />
            </div>
            <Tiptap
              initialContent={content}
              onUpdate={(newContent) => setContent(newContent)}
            />
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/blog")}
              >
                Annuler
              </Button>
              <Button onClick={handleSave}>Enregistrer</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
