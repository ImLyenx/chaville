import Image from "next/image";
import { CarouselOne } from "./carousel_1";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./mode-toggle";

export default function homepage() {
  return (
    <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
    >
    <section className="m-10">
      <div className="bg-[#155093] p-5 rounded-full flex flex-row justify-between">
        <div className="text-white flex flex-row mt-2">
          <p>Consommer Local - </p>
          <p className="font-bold">Chaville</p>
        </div>
        <div className="flex gap-5">
          <ModeToggle />
          <div className="relative">
            <input
              className="p-2 w-96 rounded-full mr-5 pl-10"
              type="text"
              placeholder="Rechercher des commerçants" />
            <Image
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              src="/magnifying-glass-solid.svg"
              alt="Search icon"
              width={15}
              height={15}
              priority />
          </div>
          <button className=" w-32 bg-white p-2 rounded-full dark:bg-black ">Compte ▼</button>
        </div>
      </div>

      <div className="flex justify-center items-center mt-10">
        <Image
          src="/decouvrir-commercant.png"
          alt="Search icon"
          width={1500}
          height={1000}
          priority />
      </div>

      <div>
        <h1 className="font-bold text-3xl mt-16 mb-5">Actualités</h1>
      </div>
      <CarouselOne />

      <div className="flex justify-between">
        <h1 className="font-bold text-3xl mt-16 mb-5">Catégories</h1>
        <Button></Button>
      </div>
    </section>
    </ThemeProvider>
  );
}