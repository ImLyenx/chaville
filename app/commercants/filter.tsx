"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the type for the props
interface FiltresProps {
  onSectorChange: (sector: string) => void; // Type for the callback function
}

const Filtres: React.FC<FiltresProps> = ({ onSectorChange }) => {
  const [position, setPosition] = React.useState("bottom");

  const handleSectorChange = (sector: string) => {
    setPosition(sector);
    onSectorChange(sector); // Call the callback with the selected sector
  };

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

  return (
    <section className="flex justify-center gap-20">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="sm:w-32 w-24 p-2 px-10">
              Secteur ▼
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={handleSectorChange}
            >
              {VALID_SECTORS.map((sector) => (
                <DropdownMenuRadioItem key={sector} value={sector}>
                  <Button>{sector}</Button>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>
  );
};

export default Filtres;
