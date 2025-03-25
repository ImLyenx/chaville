"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { useEffect, useState, Fragment } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Link from "next/link";

interface Blog {
  id: number;
  title: string;
  content: string;
  isWrittenByAdmin: boolean;
  isValidated: boolean;
  entrepriseId: string | null;
  enterpriseName?: string;
  enterpriseSlug?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BlogResponse {
  blogs: Blog[];
  total?: number;
}

const ITEMS_PER_PAGE = 10;

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/blog?page=${currentPage}&limit=${ITEMS_PER_PAGE}`
      );
      if (!response.ok) throw new Error("Failed to fetch blogs");

      const data = (await response.json()) as BlogResponse;
      setBlogs(data.blogs);
      setTotalPages(
        data.total
          ? Math.ceil(data.total / ITEMS_PER_PAGE)
          : data.blogs.length < ITEMS_PER_PAGE
          ? currentPage
          : currentPage + 1
      );
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
      toast.error("Erreur lors du chargement des articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      toast.success("Article supprimé avec succès");
      fetchBlogs(); // Refresh the list
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Erreur lors de la suppression de l'article");
    }
  };

  const handleValidate = async (id: number, isValidated: boolean) => {
    try {
      const response = await fetch(`/api/admin/blog/${id}/validate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isValidated }),
      });

      if (!response.ok) {
        throw new Error("Failed to update validation status");
      }

      toast.success(
        isValidated
          ? "Article validé avec succès"
          : "Article marqué comme non validé"
      );
      fetchBlogs(); // Refresh the list
    } catch (error) {
      console.error("Error updating validation status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const createPageUrl = (pageNum: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", pageNum.toString());
      return `?${params.toString()}`;
    };

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious href={createPageUrl(currentPage - 1)} />
            </PaginationItem>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((pageNum) => {
              return (
                pageNum === 1 ||
                pageNum === totalPages ||
                Math.abs(pageNum - currentPage) <= 1
              );
            })
            .map((pageNum, index, array) => {
              if (index > 0 && array[index - 1] !== pageNum - 1) {
                return (
                  <Fragment key={`ellipsis-${pageNum}`}>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href={createPageUrl(pageNum)}
                        isActive={pageNum === currentPage}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  </Fragment>
                );
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href={createPageUrl(pageNum)}
                    isActive={pageNum === currentPage}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext href={createPageUrl(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion du Blog</CardTitle>
          <Button className="gap-2" asChild>
            <Link href="/admin/blog/new">
              <Plus className="h-4 w-4" />
              Nouvel Article
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Chargement...</p>
          ) : !blogs || blogs.length === 0 ? (
            <p className="text-center py-4">Aucun article trouvé</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Date de création
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Dernière modification
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium">
                        {blog.title}
                      </TableCell>
                      <TableCell>
                        {blog.isWrittenByAdmin ? (
                          <Badge variant="default">Admin</Badge>
                        ) : blog.enterpriseSlug ? (
                          <Link href={`/enterprise/${blog.enterpriseSlug}`}>
                            <Badge
                              variant="secondary"
                              className="cursor-pointer hover:bg-secondary/80"
                            >
                              {blog.enterpriseName || "Entreprise"}
                            </Badge>
                          </Link>
                        ) : (
                          <Badge variant="secondary">
                            {blog.enterpriseName || "Entreprise"}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={blog.isValidated ? "success" : "warning"}
                          className="w-fit"
                        >
                          {blog.isValidated ? "Validé" : "En attente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(blog.createdAt)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(blog.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/blog/${blog.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          {!blog.isWrittenByAdmin && (
                            <Button
                              variant={blog.isValidated ? "ghost" : "outline"}
                              size="icon"
                              onClick={() =>
                                handleValidate(blog.id, !blog.isValidated)
                              }
                            >
                              {blog.isValidated ? (
                                <X className="h-4 w-4" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Confirmer la suppression
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer cet article
                                  ? Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(blog.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {renderPagination()}
        </CardContent>
      </Card>
    </div>
  );
}
