"use client";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Users, Settings, Home, Loader2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, error } = authClient.useSession();
  if (process.env.NODE_ENV === "development") {
    console.log(session);
  }
  if (error) {
    redirect("/");
  }
  if (session && !(session.user.role === "admin")) {
    redirect("/");
  }
  return <AdminLayout>{children}</AdminLayout>;
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, error } = authClient.useSession();

  return (
    <>
      {!session && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm font-medium">Chargement...</p>
          </div>
        </div>
      )}
      <SidebarProvider defaultOpen>
        <div className="flex h-screen w-screen">
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center gap-2 px-4 py-2">
                <Settings className="h-6 w-6" />
                <span className="font-semibold">Panel Admin</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <div className="flex flex-col gap-2 p-2">
                <Button
                  variant={"ghost"}
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    Retour à l'accueil
                  </Link>
                </Button>
                <Button
                  variant={pathname === "/admin/users" ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link href="/admin/users">
                    <Users className="h-4 w-4" />
                    Utilisateurs
                  </Link>
                </Button>
                <Button
                  variant={pathname === "/admin/blog" ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link href="/admin/blog">
                    <Paperclip className="h-4 w-4" />
                    Blog
                  </Link>
                </Button>
              </div>
            </SidebarContent>
          </Sidebar>

          <SidebarInset>
            <div className="flex items-center justify-between border-b px-4 py-2">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">Panel Admin</h1>
              <div className="w-10" />
            </div>
            <div className="p-4">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}

export default AdminLayoutWrapper;
