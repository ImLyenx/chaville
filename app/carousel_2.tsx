import * as React from "react"
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const slidestwo = [
    {
      title: "Artisanat & Créateurs",
      image: "/artisanat.png",
    },
    {
      title: "Services aux particuliers",
      image: "/services.png",
    },
    {
      title: "Bien être  & Santé",
      image: "/sante.png",
    },
    {
        title: "Evènementiel",
        image: "/evenementiel.png",
    },
    {
        title: "Alimentation & Restauration",
        image: "/alimentation.png",
    },
    {
      title: "Artisanat & Créateurs",
      image: "/artisanat.png",
    },
    {
      title: "Services aux particuliers",
      image: "/services.png",
    },
    {
      title: "Evènementiel",
      image: "/evenementiel.png",
  },
  {
      title: "Alimentation & Restauration",
      image: "/alimentation.png",
  },
  ];

export function CarouselTwo() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className=""
    >
    <CarouselContent>
        {slidestwo.map((slide, index) => (
        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/5 flex justify-center">
            <div className=" w-60 h-96">
                <Card className="w-60 h-96 rounded-3xl relative bg-[#155093cb]">
                    <CardContent className="w-60 h-96 p-0">
                    <Image
                        src={slide.image}
                        className="w-60 h-96 object-cover rounded-3xl opacity-70"
                        alt={slide.title}
                        width={60}
                        height={96}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                    />
                    <div className="absolute inset-0 flex flex-col justify-end items-center text-center mb-10">
                      <h1 className="text-white text-xl font-bold mb-4">{slide.title}</h1>
                      <Button className="bg-[#920F4F] text-white px-5 rounded-full">Découvrir</Button>
                    </div>
                    </CardContent>
                </Card>

            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="sm:bottom-[400] bottom-[390]"/>
      <CarouselNext className="sm:bottom-[400] bottom-[390]" />
    </Carousel>
  )
}
