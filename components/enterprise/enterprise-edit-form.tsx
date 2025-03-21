"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";
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

// Define valid contact types
const VALID_CONTACT_TYPES = [
  "Facebook",
  "Instagram",
  "LinkedIn",
  "Twitter",
  "TikTok",
  "YouTube",
  "WhatsApp",
  "Email",
  "Téléphone",
  "Site Web",
  "Autre",
] as const;

interface EnterpriseEditFormProps {
  name: string;
  sector: string;
  description: string | null;
  logo: string | null;
  photos: string[];
  coordonnees: { type: string; link: string }[];
  slug: string;
  id: string;
}

export function EnterpriseEditForm({
  name: initialName,
  sector: initialSector,
  description: initialDescription,
  logo: initialLogo,
  photos: initialPhotos,
  coordonnees: initialCoordonnees,
  slug,
  id,
}: EnterpriseEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(initialName);
  const [sector, setSector] = useState(initialSector);
  const [description, setDescription] = useState(initialDescription || "");
  const [logo, setLogo] = useState(initialLogo);
  const [photos, setPhotos] = useState(initialPhotos);
  const [coordonnees, setCoordonnees] = useState(initialCoordonnees);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/enterprise/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          sector,
          description,
          logo,
          photos,
          coordonnees,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update enterprise");
      }

      toast.success("Entreprise mise à jour", {
        description: "Les modifications ont été enregistrées avec succès.",
      });

      router.push(`/enterprise/${slug}`);
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'entreprise:", error);
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la mise à jour.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info Card */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Informations de base</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de l&apos;entreprise</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="sector">Secteur d&apos;activité</Label>
            <Select value={sector} onValueChange={setSector} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un secteur" />
              </SelectTrigger>
              <SelectContent>
                {VALID_SECTORS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
            />
          </div>
        </div>
      </Card>

      {/* Media Card */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Médias</h2>
        <div className="space-y-6">
          {/* Logo Section */}
          <div>
            <Label>Logo</Label>
            <div className="mt-2">
              {logo && (
                <div className="relative h-24 w-24 mb-4">
                  <Image
                    src={logo}
                    alt="Logo"
                    fill
                    className="rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setLogo(null)}
                  >
                    ×
                  </Button>
                </div>
              )}
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    setLogo(res[0].ufsUrl);
                    toast.success("Logo téléchargé avec succès");
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error("Erreur", {
                    description:
                      error.message ||
                      "Une erreur est survenue lors du téléchargement.",
                  });
                }}
              />
            </div>
          </div>

          {/* Photos Section */}
          <div>
            <Label>Photos</Label>
            <div className="mt-2 grid grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setPhotos(photos.filter((_, i) => i !== index));
                    }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <div className="aspect-square flex items-center justify-center border-2 border-dashed rounded-lg">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      setPhotos([...photos, res[0].ufsUrl]);
                      toast.success("Photo téléchargée avec succès");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error("Erreur", {
                      description:
                        error.message ||
                        "Une erreur est survenue lors du téléchargement.",
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Info Card */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Coordonnées</h2>
        <div className="space-y-4">
          {coordonnees.map((contact, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor={`contact-type-${index}`}>Type</Label>
                <Select
                  value={contact.type}
                  onValueChange={(value) => {
                    const newCoordonnees = [...coordonnees];
                    newCoordonnees[index] = {
                      ...contact,
                      type: value,
                    };
                    setCoordonnees(newCoordonnees);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {VALID_CONTACT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-[2]">
                <Label htmlFor={`contact-link-${index}`}>Valeur</Label>
                <Input
                  id={`contact-link-${index}`}
                  value={contact.link}
                  onChange={(e) => {
                    const newCoordonnees = [...coordonnees];
                    newCoordonnees[index] = {
                      ...contact,
                      link: e.target.value,
                    };
                    setCoordonnees(newCoordonnees);
                  }}
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setCoordonnees(coordonnees.filter((_, i) => i !== index));
                  }}
                >
                  ×
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setCoordonnees([...coordonnees, { type: "", link: "" }]);
            }}
          >
            Ajouter un contact
          </Button>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
}
