"use client";

import { useEffect, useState } from "react";
import { Header } from "../header";
import Filtres from "./filter";
import Image from "next/image";
import Link from "next/link";

export default function Commercants() {
  const [commercants, setCommercants] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
      logo: string;
      sector: string;
      slug: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState("");

  useEffect(() => {
    const fetchCommercants = async () => {
      try {
        const response = await fetch("/api/enterprise");
        const data = await response.json();
        setCommercants(data);
      } catch (error) {
        console.error("Erreur de récupération des commerçants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommercants();
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  const filteredCommercants = selectedSector
    ? commercants.filter((commercant) => commercant.sector === selectedSector)
    : commercants;

  return (
    <section className="m-4 md:m-10">
      <Header />
      <div className="flex justify-center">
        <h1 className="text-4xl md:text-6xl text-center mt-10">
          (Re)découvrez vos commerçants
        </h1>
      </div>
      <div className="flex flex-col md:flex-row justify-center gap-5 mt-10 items-center">
        <h2 className="text-xl md:text-2xl font-bold">Filtres :</h2>
        <Filtres onSectorChange={setSelectedSector} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10 px-4">
        {filteredCommercants.map((commercant) => (
          <Link href={`/enterprise/${commercant.slug}`} key={commercant.id}>
            <div className="bg-slate-500 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 flex flex-col">
              <div className="relative w-full aspect-square">
                <Image
                  src={commercant.logo}
                  alt={commercant.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-xl font-bold">{commercant.name}</h3>
                <p className="text-sm font-light line-clamp-4">
                  {commercant.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
