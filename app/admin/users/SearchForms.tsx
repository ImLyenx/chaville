"use client";

import { Input } from "@/components/ui/input";
import { Mail, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface SearchFormsProps {
  initialEmail?: string;
  initialName?: string;
}

export function SearchForms({ initialEmail, initialName }: SearchFormsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    return params.toString();
  };

  const handleSearch = (field: "email" | "name", value: string) => {
    startTransition(() => {
      const queryString = createQueryString(field, value);
      router.push(`?${queryString}`);
    });
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher par email..."
          defaultValue={initialEmail}
          className="w-full rounded-md pl-8 md:w-[200px]"
          onChange={(e) => handleSearch("email", e.target.value)}
        />
      </div>
      <div className="relative">
        <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher par nom..."
          defaultValue={initialName}
          className="w-full rounded-md pl-8 md:w-[200px]"
          onChange={(e) => handleSearch("name", e.target.value)}
        />
      </div>
    </div>
  );
}
