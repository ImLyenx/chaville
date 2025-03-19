"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalRegistrationForm } from "@/components/auth/personal-registration-form";
import { ProfessionalRegistrationForm } from "@/components/auth/professional-registration-form";
import Image from "next/image";
import bgImage from "@/public/images/bg-login.jpg";

export default function RegisterPage() {
  return (
    <div className="flex h-screen w-full items-center">
      <Image
        src={bgImage}
        alt="Login background"
        width={1000}
        height={1000}
        className="hidden md:block w-full h-full object-cover fixed top-0 left-0 -z-50"
      />
      <Card className="w-full h-full ml-auto max-w-[800px] rounded-r-none md:rounded-l-3xl rounded-l-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">S'inscrire</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personnel</TabsTrigger>
              <TabsTrigger value="professional">Professionnel</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <PersonalRegistrationForm />
            </TabsContent>
            <TabsContent value="professional">
              <ProfessionalRegistrationForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
