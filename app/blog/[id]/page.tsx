"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Header } from "@/app/header";
import Footer from "@/app/footer";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/blog/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog post");
        }
        const data = await response.json();
        setPost(data.post);
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-1/5"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
          </div>
        </div>
      );
    }

    if (!post) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">Article introuvable</h2>
              <p className="text-muted-foreground mb-6">
                Cet article n&apos;existe pas ou a été supprimé.
              </p>
              <Button
                className="bg-[#155093] text-white px-5 rounded-full"
                onClick={() => router.push("/blog")}
              >
                Retour aux articles
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <>
        <Button
          variant="ghost"
          className="mb-4 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => router.push("/blog")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux articles
        </Button>

        <article>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Publié le {formatDate(post.createdAt)}
            {post.updatedAt !== post.createdAt &&
              ` • Mis à jour le ${formatDate(post.updatedAt)}`}
          </p>

          <div
            className="prose prose-sm sm:prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </>
    );
  };

  return (
    <section className="sm:m-10 m-2">
      <Header />

      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl sm:m-10 mt-10">
        {renderContent()}
      </div>

      <Footer />
    </section>
  );
}
