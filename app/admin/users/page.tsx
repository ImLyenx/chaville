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
  // UserPlus,
  // ShieldCheck,
  Ban,
  // RefreshCw,
  // Trash2,
  UserCog,
  Search,
  Check,
  X,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { toast } from "sonner";
import { getEnterprisesByUserIds, updateEnterpriseValidation } from "./actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

// Define the Enterprise type
interface Enterprise {
  id: string;
  name: string;
  siret: string;
  isValidated: boolean;
  sector: string;
  slug: string;
}

// Update the User interface
interface User {
  id: string;
  name?: string;
  email: string;
  role?: string | null;
  banned?: boolean | null;
  enterprise?: Enterprise | null;
}

interface UserResponse {
  users: User[];
  total?: number;
}

const ITEMS_PER_PAGE = 10;

// Add sectors constant
const SECTORS = [
  "Restauration",
  "Commerce",
  "Services",
  "Artisanat",
  "Construction",
  "Transport",
  "Autre",
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedValidation, setSelectedValidation] = useState<string>("all");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const searchParams = useSearchParams();
  const searchedEmail = searchParams.get("email");
  const searchedName = searchParams.get("name");
  const currentPage = Number(searchParams.get("page")) || 1;

  const fetchUsersWithEnterprises = async (options?: {
    limit?: number;
    offset?: number;
    searchField?: "email" | "name";
    searchValue?: string;
  }) => {
    const response = await authClient.admin.listUsers({
      query: {
        limit: options?.limit || ITEMS_PER_PAGE,
        offset: options?.offset || 0,
        ...(options?.searchField && {
          searchField: options.searchField,
          searchValue: options.searchValue,
        }),
      },
    });

    if ("data" in response && response.data) {
      const data = response.data as unknown as UserResponse;
      const userIds = data.users.map((user) => user.id);
      const enterpriseMap = await getEnterprisesByUserIds(userIds);

      return {
        users: data.users.map((user) => ({
          ...user,
          enterprise: enterpriseMap.get(user.id)?.[0] || null,
        })),
        total: data.total,
      };
    }

    throw new Error("Failed to fetch users");
  };

  // Add filter function
  const filterUsers = (users: User[]) => {
    let filteredUsers = [...users];

    // Sort unvalidated enterprises first
    filteredUsers.sort((a, b) => {
      if (a.enterprise?.isValidated === b.enterprise?.isValidated) return 0;
      if (!a.enterprise?.isValidated) return -1;
      if (!b.enterprise?.isValidated) return 1;
      return 0;
    });

    // Filter by validation status
    if (selectedValidation !== "all") {
      filteredUsers = filteredUsers.filter((user) => {
        if (selectedValidation === "validated") {
          return user.enterprise?.isValidated === true;
        }
        if (selectedValidation === "unvalidated") {
          return user.enterprise?.isValidated === false;
        }
        if (selectedValidation === "noEnterprise") {
          return !user.enterprise;
        }
        return true;
      });
    }

    // Filter by sector
    if (selectedSector !== "all") {
      filteredUsers = filteredUsers.filter(
        (user) => user.enterprise?.sector === selectedSector
      );
    }

    return filteredUsers;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { users: fetchedUsers, total } = await fetchUsersWithEnterprises({
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
        });

        const filteredUsers = filterUsers(fetchedUsers);
        setUsers(filteredUsers);
        setTotalPages(
          total
            ? Math.ceil(total / ITEMS_PER_PAGE)
            : filteredUsers.length < ITEMS_PER_PAGE
            ? currentPage
            : currentPage + 1
        );
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [
    searchedEmail,
    searchedName,
    currentPage,
    selectedValidation,
    selectedSector,
  ]);

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
      const { users: updatedUsers } = await fetchUsersWithEnterprises({
        limit: ITEMS_PER_PAGE,
        offset: (currentPage - 1) * ITEMS_PER_PAGE,
      });
      setUsers(updatedUsers);
      toast.success("Rôle mis à jour avec succès");
    } catch (error) {
      console.error("Error changing role:", error);
      toast.error("Erreur lors de la mise à jour du rôle");
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
      const { users: updatedUsers } = await fetchUsersWithEnterprises({
        limit: ITEMS_PER_PAGE,
        offset: (currentPage - 1) * ITEMS_PER_PAGE,
      });
      setUsers(updatedUsers);
      toast.success(ban ? "Utilisateur banni" : "Utilisateur réactivé");
    } catch (error) {
      console.error("Error updating user ban status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleValidateEnterprise = async (
    enterpriseId: string,
    isValidated: boolean
  ) => {
    try {
      // Call the function without storing the result
      await updateEnterpriseValidation(enterpriseId, isValidated);

      // Update the users list to reflect the change
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.enterprise?.id === enterpriseId) {
            return {
              ...user,
              enterprise: {
                ...user.enterprise,
                isValidated,
              },
            };
          }
          return user;
        })
      );

      toast.success(
        isValidated
          ? "Entreprise validée avec succès"
          : "Entreprise marquée comme non validée"
      );
    } catch (error) {
      console.error("Error updating enterprise validation status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Gestion des Utilisateurs</CardTitle>
          <div className="flex items-center gap-4">
            {/* Filters */}
            <div className="hidden md:flex items-center gap-4">
              <Select
                value={selectedValidation}
                onValueChange={setSelectedValidation}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statut de validation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="validated">Validées</SelectItem>
                  <SelectItem value="unvalidated">Non validées</SelectItem>
                  <SelectItem value="noEnterprise">Sans entreprise</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Secteur d'activité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les secteurs</SelectItem>
                  {SECTORS.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <SearchForms
                initialEmail={searchedEmail || undefined}
                initialName={searchedName || undefined}
              />
            </div>

            {/* Mobile filters button */}
            <div className="md:hidden">
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Filtres</DrawerTitle>
                    <DrawerDescription>
                      Filtrez et recherchez des utilisateurs
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 space-y-4">
                    <Select
                      value={selectedValidation}
                      onValueChange={setSelectedValidation}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Statut de validation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="validated">Validées</SelectItem>
                        <SelectItem value="unvalidated">
                          Non validées
                        </SelectItem>
                        <SelectItem value="noEnterprise">
                          Sans entreprise
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedSector}
                      onValueChange={setSelectedSector}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Secteur d'activité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les secteurs</SelectItem>
                        {SECTORS.map((sector) => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <SearchForms
                      initialEmail={searchedEmail || undefined}
                      initialName={searchedName || undefined}
                    />
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">Fermer</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !users || users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun utilisateur trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Nom</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Rôle</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                    <TableHead className="font-semibold">Entreprise</TableHead>
                    <TableHead className="font-semibold text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: User) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {user.name || "Sans nom"}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin" ? "destructive" : "secondary"
                          }
                          className="font-normal"
                        >
                          {user.role === "admin"
                            ? "Administrateur"
                            : "Utilisateur"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.banned ? "destructive" : "default"}
                          className="font-normal"
                        >
                          {user.banned ? "Banni" : "Actif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.enterprise ? (
                          <div className="space-y-1.5">
                            <div className="font-medium">
                              <Link
                                href={`/enterprise/${user.enterprise.slug}`}
                                className="hover:underline text-blue-600 dark:text-blue-400"
                              >
                                {user.enterprise.name}
                              </Link>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              SIRET: {user.enterprise.siret}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Secteur: {user.enterprise.sector}
                            </div>
                            <Badge
                              variant={
                                user.enterprise.isValidated
                                  ? "default"
                                  : "secondary"
                              }
                              className="font-normal"
                            >
                              {user.enterprise.isValidated
                                ? "Validée"
                                : "En attente"}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Aucune entreprise
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <UserCog className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Role Change Option */}
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(
                                  user.id,
                                  user.role === "admin" ? "user" : "admin"
                                )
                              }
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              {user.role === "admin"
                                ? "Retirer droits admin"
                                : "Donner droits admin"}
                            </DropdownMenuItem>

                            {/* Ban/Unban Option */}
                            <DropdownMenuItem
                              onClick={() =>
                                handleBanUser(user.id, !user.banned)
                              }
                            >
                              {user.banned ? (
                                <>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Réactiver l&apos;utilisateur
                                </>
                              ) : (
                                <>
                                  <Ban className="mr-2 h-4 w-4" />
                                  Bannir l&apos;utilisateur
                                </>
                              )}
                            </DropdownMenuItem>

                            {/* Enterprise Validation/Unvalidation Option */}
                            {user.enterprise && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleValidateEnterprise(
                                    user.enterprise!.id,
                                    !user.enterprise!.isValidated
                                  )
                                }
                              >
                                {user.enterprise.isValidated ? (
                                  <>
                                    <X className="mr-2 h-4 w-4" />
                                    Invalider l&apos;entreprise
                                  </>
                                ) : (
                                  <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Valider l&apos;entreprise
                                  </>
                                )}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
