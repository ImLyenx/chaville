import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Header } from "../header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountForm } from "@/components/auth/account-form";

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sm:m-10 m-2">
        <Header />
      </div>
      <div className="flex justify-center items-center py-8">
        <Card className="w-full max-w-[800px]">
          <CardHeader>
            <CardTitle className="text-2xl">Votre Compte</CardTitle>
          </CardHeader>
          <CardContent>
            <AccountForm user={session.user} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
