"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Header } from "@/app/header";
import Footer from "@/app/footer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  isWrittenByAdmin: boolean;
  isValidated: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EnterpriseBlogPage() {
  const params = useParams();
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const slug = params.slug as string;

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch(`/api/enterprise/${slug}/blog`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }
        const data = await response.json();
        setBlogPosts(data.posts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchBlogPosts();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/enterprise/${slug}/blog/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog post");
      }

      setBlogPosts((prev) => prev.filter((post) => post.id !== id));
      setShowDeleteDialog(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  };

  return (
    <section className="sm:m-10 m-2">
      <Header />

      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl sm:m-10 mt-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Gestion de vos articles</CardTitle>
            <Button
              className="bg-[#155093] text-white rounded-full"
              onClick={() => router.push(`/enterprise/${slug}/blog/new`)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouvel article
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun article</h3>
                <p className="text-muted-foreground mb-6">
                  Vous n&apos;avez pas encore créé d&apos;articles pour votre
                  entreprise.
                </p>
                <Button
                  className="bg-[#155093] text-white rounded-full"
                  onClick={() => router.push(`/enterprise/${slug}/blog/new`)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Créer votre premier article
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Dernière modification</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">
                        {post.title}
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge
                                variant={
                                  post.isValidated ? "success" : "warning"
                                }
                                className="cursor-help"
                              >
                                {post.isValidated
                                  ? "Publié"
                                  : "En attente de validation"}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              {post.isValidated
                                ? "Cet article est visible publiquement"
                                : "Cet article doit être validé par un administrateur avant d&apos;être visible publiquement"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>{formatDate(post.createdAt)}</TableCell>
                      <TableCell>{formatDate(post.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(
                              `/enterprise/${slug}/blog/${post.id}/edit`
                            )
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setPostToDelete(post.id);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer cet article ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;article sera définitivement
              supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => postToDelete && handleDelete(postToDelete)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
