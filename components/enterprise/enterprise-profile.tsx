"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ReviewForm } from "@/components/enterprise/review-form";
import { ReviewsList } from "./reviews-list";
import { StarIcon } from "@heroicons/react/20/solid";
import {
  Facebook,
  Instagram,
  Twitter,
  Globe,
  Phone,
  Mail,
  Link as LinkIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const SocialIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case "facebook":
      return <Facebook className="h-5 w-5" />;
    case "instagram":
      return <Instagram className="h-5 w-5" />;
    case "twitter":
      return <Twitter className="h-5 w-5" />;
    case "website":
      return <Globe className="h-5 w-5" />;
    case "phone":
      return <Phone className="h-5 w-5" />;
    case "email":
      return <Mail className="h-5 w-5" />;
    default:
      return <LinkIcon className="h-5 w-5" />;
  }
};

const formatSocialLink = (type: string, value: string): string => {
  if (!value) return "#";

  const type_lower = type.toLowerCase();
  switch (type_lower) {
    case "facebook":
      return value.startsWith("http") ? value : `https://facebook.com/${value}`;
    case "instagram":
      return value.startsWith("http")
        ? value
        : `https://instagram.com/${value}`;
    case "twitter":
      return value.startsWith("http") ? value : `https://twitter.com/${value}`;
    case "phone":
      return value.startsWith("tel:")
        ? value
        : `tel:${value.replace(/\s/g, "")}`;
    case "email":
      return value.startsWith("mailto:") ? value : `mailto:${value}`;
    case "website":
      return value.startsWith("http") ? value : `https://${value}`;
    default:
      return value.startsWith("http") ? value : `https://${value}`;
  }
};

export function EnterpriseProfile({
  name,
  sector,
  description,
  logo,
  photos,
  socials,
  reviews,
  slug,
  isOwner,
}: {
  name: string;
  sector: string;
  description: string | null;
  logo: string | null;
  photos: string[];
  socials: { type: string; value: string; label: string }[];
  reviews: {
    rating: number;
    count: number;
    distribution: { [key: string]: number };
  };
  slug: string;
  isOwner: boolean;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-6">
        {/* Left Column */}
        <div className="flex-[2] flex flex-col gap-6">
          {/* Name Card */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                {logo && (
                  <div className="relative h-24 w-24 shrink-0">
                    <Image
                      src={logo}
                      alt={name}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold">{name}</h1>
                  <p className="text-muted-foreground mt-1">{sector}</p>
                </div>
              </div>
              {isOwner && (
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/enterprise/${slug}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </Card>

          {/* Content Card */}
          <Card className="p-6">
            <div className="space-y-12">
              {/* About Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">À propos</h2>
                  {isOwner && (
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/enterprise/${slug}/edit#about`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </section>

              {/* Photos Section */}
              {photos.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Photos</h2>
                    {isOwner && (
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/enterprise/${slug}/edit#photos`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {photos.map((photo, index) => (
                      <Dialog key={index}>
                        <DialogTrigger asChild>
                          <div className="relative aspect-square cursor-pointer hover:opacity-90 transition-opacity">
                            <Image
                              src={photo}
                              alt={`${name} photo ${index + 1}`}
                              fill
                              className="rounded-lg object-cover"
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-black/90">
                          <DialogHeader>
                            <DialogTitle className="sr-only">
                              Photo {index + 1} de {name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="relative w-full h-[85vh]">
                            <Image
                              src={photo}
                              alt={`${name} photo ${index + 1}`}
                              fill
                              className="object-contain"
                              priority
                              quality={100}
                              sizes="95vw"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </section>
              )}

              {/* Reviews Section */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">Avis détaillés</h2>
                <ReviewsList slug={slug} />
              </section>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Sector & Socials Card */}
          <Card className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Badge className="w-fit text-lg py-2 px-4" variant="secondary">
                  {sector}
                </Badge>
                {isOwner && (
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/enterprise/${slug}/edit#contact`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {socials.map((social) => (
                  <div key={social.type} className="flex items-center gap-2">
                    <SocialIcon type={social.type} />
                    <Link
                      href={formatSocialLink(social.type, social.value)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {social.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Review Stats Card */}
          <Card className="p-6">
            <div className="space-y-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold">
                    {reviews.rating.toFixed(1)}
                  </span>
                  <StarIcon className="h-8 w-8 text-yellow-400" />
                </div>
                <p className="text-muted-foreground">
                  {reviews.count} avis au total
                </p>
              </div>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.distribution[rating] || 0;
                  const percentage =
                    reviews.count > 0 ? (count / reviews.count) * 100 : 0;

                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <div className="flex items-center gap-1 w-12">
                        <span>{rating}</span>
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              <ReviewForm enterpriseSlug={slug} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
