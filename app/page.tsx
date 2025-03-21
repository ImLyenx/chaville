import Image from "next/image";
import { CarouselOne } from "./carousel_1";
import { CarouselTwo } from "./carousel_2";
import { Header } from "./header";
import { Button } from "@/components/ui/button";

export default function homepage() {
  return (
    <><section className="sm:m-10 m-2">
      <Header />

      <div className="flex justify-center items-center mt-10">
        <Image
          src="/decouvrir-commercant.png"
          alt="Search icon"
          width={1500}
          height={1000}
          priority />
      </div>

      <div>
        <h1 className="font-bold text-xl mt-16 mb-5 sm:text-3xl">Actualités</h1>
      </div>
      <CarouselOne />

      <div className="flex justify-start">
        <h1 className="font-bold text-xl mt-16 mb-5 sm:text-3xl">Catégories</h1>
      </div>
      <CarouselTwo/>
      <div className="flex justify-center mt-10">
        <Button className="bg-[#155093] text-white px-5 rounded-full">Voir plus</Button>
      </div>
    </section></>
  )
}