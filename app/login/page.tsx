import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";

import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center">
      <Image
        src="https://kdog16zdet.ufs.sh/f/0fIBcaT6jsOdAvHMFuIa1R6tTshfO3XLrGPEom8KYFceuWk0"
        alt="Login background"
        width={1000}
        height={1000}
        className="hidden md:block w-full h-full object-cover fixed top-0 left-0 -z-50"
      />
      <Card className="w-full h-full ml-auto max-w-[800px] rounded-r-none md:rounded-l-3xl rounded-l-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Se connecter</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
