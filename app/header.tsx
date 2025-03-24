"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";

export function Header() {
  const [position, setPosition] = React.useState("bottom");
  const [enterpriseSlug, setEnterpriseSlug] = useState<string | null>(null);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    const checkEnterprise = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/enterprise/check", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            const data = await response.json();
            if (data.slug) {
              setEnterpriseSlug(data.slug);
            }
          }
        } catch (error) {
          console.error("Failed to check enterprise:", error);
        }
      }
    };

    checkEnterprise();
  }, [session?.user?.id]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const handleAdminDashboard = () => {
    router.push("/admin/users");
  };

  const handleEnterpriseClick = () => {
    if (enterpriseSlug) {
      router.push(`/enterprise/${enterpriseSlug}`);
    }
  };

  return (
    <section>
      <div className="bg-[#155093] p-5 rounded-full flex flex-row justify-between">
        <div className="text-white flex flex-row mt-2">
          <Link href="/">
            <p className="text-sm sm:text-base">Consommer Local - Chaville</p>
          </Link>
        </div>
        <div className="flex gap-2 items-center">
          <ModeToggle />
          {session?.user?.role === "admin" && (
            <Button
              variant="outline"
              className="sm:w-32 w-20 bg-white p-2 rounded-full"
              onClick={handleAdminDashboard}
            >
              Admin
            </Button>
          )}
          {enterpriseSlug && (
            <Button
              variant="outline"
              className="sm:w-32 w-20 bg-white p-2 rounded-full"
              onClick={handleEnterpriseClick}
            >
              Entreprise
            </Button>
          )}
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="sm:w-32 w-20 bg-white p-2 rounded-full"
                >
                  {session ? "Compte ▼" : "Connexion"}
                </Button>
              </DropdownMenuTrigger>
              {session ? (
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Gérer votre compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={position}
                    onValueChange={setPosition}
                  >
                    <DropdownMenuRadioItem value="account">
                      <Button
                        className="w-full justify-start"
                        variant="ghost"
                        onClick={() => router.push("/account")}
                      >
                        Votre compte
                      </Button>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="logout">
                      <Button
                        className="w-full justify-start"
                        variant="ghost"
                        onClick={handleSignOut}
                      >
                        Se déconnecter
                      </Button>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              ) : (
                <DropdownMenuContent className="w-56">
                  <DropdownMenuRadioGroup
                    value={position}
                    onValueChange={setPosition}
                  >
                    <DropdownMenuRadioItem value="login">
                      <Button
                        className="w-full justify-start"
                        variant="ghost"
                        onClick={() => router.push("/login")}
                      >
                        Se connecter
                      </Button>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="register">
                      <Button
                        className="w-full justify-start"
                        variant="ghost"
                        onClick={() => router.push("/register")}
                      >
                        S&apos;inscrire
                      </Button>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
        </div>
      </div>
    </section>
  );
}
