// @ts-nocheck
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define valid sectors
const VALID_SECTORS = [
  "Commerce",
  "Services",
  "Restauration",
  "Artisanat",
  "Santé",
  "Bien-être",
  "Construction",
  "Transport",
  "Éducation",
  "Autre",
] as const;

const professionalFormSchema = z
  .object({
    companyName: z.string().min(2, {
      message: "Le nom de l'entreprise doit contenir au moins 2 caractères.",
    }),
    userName: z.string().min(2, {
      message: "Votre nom doit contenir au moins 2 caractères.",
    }),
    logo: z
      .string()
      .url({
        message: "Veuillez ajouter un logo pour votre entreprise.",
      })
      .refine((url) => url.includes(".ufs.sh/f/"), {
        message: "Le logo doit être uploadé via notre service.",
      }),
    siret: z
      .string()
      .length(14, {
        message: "Le numéro de SIRET doit contenir exactement 14 chiffres.",
      })
      .regex(/^\d+$/, {
        message: "Le numéro de SIRET ne doit contenir que des chiffres.",
      }),
    additionalImages: z
      .array(
        z
          .string()
          .url({
            message:
              "Veuillez entrer une URL valide pour l'image supplémentaire.",
          })
          .refine((url) => url.includes(".ufs.sh/f/"), {
            message: "Les images doivent être uploadées via notre service.",
          })
      )
      .max(5, {
        message: "Vous ne pouvez pas ajouter plus de 5 images supplémentaires.",
      })
      .default([]),
    sector: z.enum(VALID_SECTORS, {
      required_error: "Veuillez sélectionner un secteur d'activité.",
      invalid_type_error: "Veuillez sélectionner un secteur d'activité valide.",
    }),
    description: z
      .string()
      .min(10, {
        message: "La description doit contenir au moins 10 caractères.",
      })
      .max(1000, {
        message: "La description ne doit pas dépasser 1000 caractères.",
      }),
    email: z.string().email({
      message: "Veuillez entrer une adresse email valide.",
    }),
    password: z
      .string()
      .min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères.",
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;

export function ProfessionalRegistrationForm() {
  const router = useRouter();
  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: {
      companyName: "",
      userName: "",
      logo: "",
      siret: "",
      sector: undefined,
      description: "",
      email: "",
      password: "",
      confirmPassword: "",
      additionalImages: [],
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: ProfessionalFormValues) {
    setIsLoading(true);
    try {
      // First, create the user account with the user's name
      const response = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.userName,
      });

      if (response.error) {
        toast.error(response.error.message);
        setIsLoading(false);
        return;
      }

      // Then, create the enterprise record
      const enterpriseResponse = await fetch("/api/enterprise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.companyName,
          description: data.description,
          userId: response.data.user.id,
          siret: data.siret,
          sector: data.sector,
          logo: data.logo,
        }),
      });

      if (!enterpriseResponse.ok) {
        toast.error("Erreur lors de la création de l'entreprise");
        setIsLoading(false);
        return;
      }

      const enterprise = await enterpriseResponse.json();

      // Finally, create the additional images records
      if (data.additionalImages && data.additionalImages.length > 0) {
        const imagesResponse = await fetch("/api/enterprise/images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            images: data.additionalImages.map((url) => ({
              url,
              alternatif: "Image supplémentaire",
              entrepriseId: enterprise.id,
            })),
          }),
        });

        if (!imagesResponse.ok) {
          toast.error("Erreur lors de l'ajout des images supplémentaires");
        }
      }

      toast.success("Compte créé avec succès");
      router.push("/success");
    } catch (error) {
      toast.error("Une erreur est survenue lors de la création du compte");
    }
    setIsLoading(false);
  }

  const removeAdditionalImage = (index: number) => {
    const currentImages = form.getValues("additionalImages") || [];
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    form.setValue("additionalImages", newImages, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <div className="flex flex-col h-[calc(100vh-200px)]">
        <div className="flex-1 overflow-y-auto pr-4 -mr-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Prénom et nom" {...field} />
                  </FormControl>
                  <FormDescription>
                    Votre nom qui sera utilisé pour votre compte personnel
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'entreprise</FormLabel>
                  <FormControl>
                    <Input placeholder="Raison sociale" {...field} />
                  </FormControl>
                  <FormDescription>
                    Le nom officiel de votre entreprise tel qu'il apparaît sur
                    votre SIRET
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo de l'entreprise</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {field.value ? (
                        <div className="relative w-32 h-32">
                          <Image
                            src={field.value}
                            alt="Logo"
                            fill
                            className="object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2"
                            onClick={() => form.setValue("logo", "")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <UploadDropzone
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            if (res?.[0]?.ufsUrl) {
                              form.setValue("logo", res[0].ufsUrl);
                              toast.success("Logo ajouté avec succès");
                            }
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(
                              `Erreur lors de l'upload: ${error.message}`
                            );
                          }}
                          config={{ mode: "auto" }}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro SIRET</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="14 chiffres"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, "");
                        if (value.length <= 14) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalImages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images supplémentaires</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        {field.value?.map((image, index) => (
                          <div key={index} className="relative w-32 h-32">
                            <Image
                              src={image}
                              alt={`Image ${index + 1}`}
                              fill
                              className="object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2"
                              onClick={() => removeAdditionalImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        {(field.value?.length || 0) < 5 && (
                          <UploadDropzone
                            endpoint="imageUploader"
                            maxFiles={5 - (field.value?.length || 0)}
                            onClientUploadComplete={(res) => {
                              const currentImages = field.value || [];
                              const newUrls = res.map((file) => file.ufsUrl);
                              const updatedImages = [
                                ...currentImages,
                                ...newUrls,
                              ].slice(0, 5);
                              form.setValue("additionalImages", updatedImages, {
                                shouldValidate: true,
                              });
                              toast.success("Images ajoutées avec succès");
                            }}
                            onUploadError={(error: Error) => {
                              toast.error(
                                `Erreur lors de l'upload: ${error.message}`
                              );
                            }}
                            config={{ mode: "auto", multiple: true }}
                          />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Ajoutez jusqu'à 5 images supplémentaires de votre entreprise
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secteur d'activité</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un secteur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {VALID_SECTORS.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description de votre entreprise</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez votre activité en quelques lignes..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Cette description sera visible sur votre profil
                    professionnel.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email professionnel</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="entreprise@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </div>

        <div className="pt-4 mt-4 border-t sticky bottom-0 bg-white">
          <Button
            type="submit"
            className="w-full bg-accent"
            disabled={isLoading}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Créer mon compte professionnel"
            )}
          </Button>
          <div className="text-center text-sm">
            <Separator className="my-6" />
            <span className="text-muted-foreground">
              Vous avez déjà un compte?{" "}
            </span>
            <Link href="/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </Form>
  );
}
