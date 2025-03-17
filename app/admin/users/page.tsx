"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  ShieldCheck,
  Ban,
  RefreshCw,
  Trash2,
  UserCog,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SearchForms } from "./SearchForms";
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

// Define the User type based on what's returned from the API
interface User {
  id: string;
  name?: string;
  email: string;
  role?: string | null;
  banned?: boolean | null;
}

interface UserResponse {
  users: User[];
  total?: number;
}

const ITEMS_PER_PAGE = 10;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();
  const searchedEmail = searchParams.get("email");
  const searchedName = searchParams.get("name");
  const currentPage = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await authClient.admin.listUsers({
          query: {
            limit: ITEMS_PER_PAGE,
            offset: (currentPage - 1) * ITEMS_PER_PAGE,
            ...(searchedEmail && {
              searchField: "email",
              searchValue: searchedEmail,
            }),
            ...(searchedName && {
              searchField: "name",
              searchValue: searchedName,
            }),
          },
        });

        if ("data" in response && response.data) {
          const data = response.data as unknown as UserResponse;
          setUsers(data.users);
          // If total is available, use it for pagination
          // Otherwise, check if we got less users than the page size, meaning we're on the last page
          setTotalPages(
            data.total
              ? Math.ceil(data.total / ITEMS_PER_PAGE)
              : data.users.length < ITEMS_PER_PAGE
              ? currentPage
              : currentPage + 1
          );
        } else {
          console.error("Error fetching users:", response);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchedEmail, searchedName, currentPage]);

  const handleRoleChange = async (
    userId: string,
    newRole: "admin" | "user"
  ) => {
    try {
      await authClient.admin.setRole({
        userId,
        role: newRole,
      });
      // Refresh the users list
      const response = await authClient.admin.listUsers({
        query: {
          limit: ITEMS_PER_PAGE,
          offset: (currentPage - 1) * ITEMS_PER_PAGE,
        },
      });
      if ("data" in response && response.data) {
        const data = response.data as unknown as UserResponse;
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  const handleBanUser = async (userId: string, ban: boolean) => {
    try {
      if (ban) {
        await authClient.admin.banUser({ userId });
      } else {
        await authClient.admin.unbanUser({ userId });
      }
      // Refresh the users list
      const response = await authClient.admin.listUsers({
        query: {
          limit: ITEMS_PER_PAGE,
          offset: (currentPage - 1) * ITEMS_PER_PAGE,
        },
      });
      if ("data" in response && response.data) {
        const data = response.data as unknown as UserResponse;
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error updating user ban status:", error);
    }
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
              // Show first page, last page, current page, and pages around current
              return (
                pageNum === 1 ||
                pageNum === totalPages ||
                Math.abs(pageNum - currentPage) <= 1
              );
            })
            .map((pageNum, index, array) => {
              // If there's a gap, show ellipsis
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

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Gestion des Utilisateurs</CardTitle>
            <SearchForms
              initialEmail={searchedEmail || undefined}
              initialName={searchedName || undefined}
            />
          </CardHeader>
          <CardContent>
            <p className="text-center py-4">Chargement...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Gestion des Utilisateurs</CardTitle>
            <SearchForms
              initialEmail={searchedEmail || undefined}
              initialName={searchedName || undefined}
            />
          </CardHeader>
          <CardContent>
            <p className="text-center py-4">Aucun utilisateur trouvé</p>
            {renderPagination()}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion des Utilisateurs</CardTitle>
          <SearchForms
            initialEmail={searchedEmail || undefined}
            initialName={searchedName || undefined}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name || "Sans nom"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "admin" ? "destructive" : "secondary"
                      }
                    >
                      {user.role === "admin" ? "Administrateur" : "Utilisateur"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.banned ? "destructive" : "default"}>
                      {user.banned ? "Banni" : "Actif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <UserCog className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleRoleChange(
                              user.id,
                              user.role === "admin" ? "user" : "admin"
                            )
                          }
                        >
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          {user.role === "admin"
                            ? "Définir comme Utilisateur"
                            : "Définir comme Admin"}
                        </DropdownMenuItem>
                        {user.banned ? (
                          <DropdownMenuItem
                            onClick={() => handleBanUser(user.id, false)}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Réactiver l'Utilisateur
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleBanUser(user.id, true)}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Bannir l'Utilisateur
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {renderPagination()}
        </CardContent>
      </Card>
    </div>
  );
}
