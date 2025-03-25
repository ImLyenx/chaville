"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Header } from "../header";
import Footer from "../footer";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/blog");
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }
        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
  };

  // Create an excerpt from HTML content
  const createExcerpt = (htmlContent: string, maxLength: number = 150) => {
    // Remove HTML tags
    const plainText = htmlContent.replace(/<[^>]+>/g, "");
    // Trim to max length
    return plainText.length > maxLength
      ? `${plainText.substring(0, maxLength)}...`
      : plainText;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </CardContent>
              <CardFooter>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <p className="text-center py-12 text-muted-foreground">
          Aucun article de blog disponible pour le moment.
        </p>
      );
    }

    return (
      <div className="grid gap-6">
        {posts.map((post) => (
          <Link href={`/blog/${post.id}`} key={post.id}>
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {createExcerpt(post.content)}
                </p>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                Publié le {formatDate(post.createdAt)}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <section className="sm:m-10 m-2">
      <Header />

      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl sm:m-10 mt-10">
        <h1 className="font-bold text-3xl mb-8">Blog</h1>
        {renderContent()}
      </div>

      <Footer />
    </section>
  );
}
