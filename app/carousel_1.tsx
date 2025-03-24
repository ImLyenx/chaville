import * as React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  {
    title: "MARCHE DES CREATEURS 🛍️",
    description: "Rencontrez vos commerçants locaux !",
    image: "/marche_createur.png",
  },
  {
    title: "OFFRE SPECIALE 🔥",
    description: "Profitez de 10% de réduction sur votre première commande !",
    image: "/offre_special.png",
  },
  {
    title: "NOUVEAU SERVICE 🍰",
    description: "Passionné(e) de pâtisserie ? Découvrez Julie Lemoine.",
    image: "/marche_createur.png",
  },
  {
    title: "MARCHE DES CREATEURS 🛍️",
    description: "Rencontrez vos commerçants locaux !",
    image: "/offre_special.png",
  },
  {
    title: "OFFRE SPECIALE 🔥",
    description: "Profitez de 10% de réduction sur votre première commande !",
    image: "/marche_createur.png",
  },
  {
    title: "NOUVEAU SERVICE 🍰",
    description: "Passionné(e) de pâtisserie ? Découvrez Julie Lemoine.",
    image: "/offre_special.png",
  },
];

export function CarouselOne() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className=""
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="h-[200px]">
              <Card className="rounded-3xl h-full">
                <CardContent className=" h-full w-full grid grid-cols-2 items-center p-0 rounded-3xl bg-[#1550935b]">
                  <div className="text-left m-5">
                    <h3 className="font-bold text-lg">{slide.title}</h3>
                    <p className="mb-4">{slide.description}</p>
                    <Button className="bg-[#155093] text-white px-5 rounded-full">
                      Découvrir
                    </Button>
                  </div>
                  <div className="w-full h-full relative">
                    <Image
                      src={slide.image}
                      className="w-full h-full m-0 p-0 rounded-r-3xl"
                      alt={slide.title}
                      layout="fill"
                      objectFit="cover"
                      priority
                    />
                  </div>

                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="sm:bottom-[220] bottom-[210]" />
      <CarouselNext className="sm:bottom-[220] bottom-[210]"/>
    </Carousel>
  );
}
