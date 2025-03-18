"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Tiptap from "@/components/tiptap";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function NewBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { data: session } = authClient.useSession();

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Le titre est obligatoire");
      return;
    }

    if (!content.trim()) {
      toast.error("Le contenu est obligatoire");
      return;
    }

    try {
      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content,
          isWrittenByAdmin: session?.user?.role === "admin",
        }),
      });

      if (!response.ok) throw new Error("Failed to create post");

      toast.success("Article créé avec succès");
      router.push("/admin/blog");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Erreur lors de la création de l'article");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nouvel Article</CardTitle>
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
              initialContent=""
              onUpdate={(newContent) => setContent(newContent)}
            />
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/blog")}
              >
                Annuler
              </Button>
              <Button onClick={handleSave}>Publier</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
