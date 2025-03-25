"use client";

import { useEffect, useState } from "react";
import { Header } from "../header";
import Filtres from "./filter"; // Make sure the path matches
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
  const [selectedSector, setSelectedSector] = useState(""); // State for selected sector

  useEffect(() => {
    // Function to fetch merchant data
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

  // Filter commercants based on selected sector
  const filteredCommercants = selectedSector
    ? commercants.filter((commercant) => commercant.sector === selectedSector)
    : commercants;

  return (
    <section className="m:m-10 m-2">
      <Header />
      <div className="flex justify-center">
        <h1 className="text-6xl m-auto mt-10">
          (Re) Découvrir vos commerçants
        </h1>
      </div>
      <div className="flex justify-center gap-20 mt-20">
        <h2 className="text-2xl font-bold mr-10">Filtres:</h2>
        <Filtres onSectorChange={setSelectedSector} />{" "}
        {/* Pass setSelectedSector to Filter */}
      </div>
      <div className="grid grid-cols-4 gap-5 ml-14">
        {filteredCommercants.map((commercant) => (
          <Link href={`/enterprise/${commercant.slug}`} key={commercant.id}>
            <div
              key={commercant.id}
              className="w-60 h-80 bg-slate-500 rounded-3xl m-5 p-4 flex flex-col justify-between"
            >
              <Image
                src={commercant.logo}
                className="w-full h-full m-0 p-0 rounded-3xl"
                alt={commercant.name}
                width={50}
                height={50}
                priority
              />
              <h3 className="text-xl font-bold">{commercant.name}</h3>
              <p className="text-sm font-light">{commercant.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
