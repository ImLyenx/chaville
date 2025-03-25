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

  return (
    <section className="flex justify-center gap-20">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="sm:w-32 w-24 p-2 px-10">Secteur ▼</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup value={position} onValueChange={handleSectorChange}>
              <DropdownMenuRadioItem value="Bien être"><Button>Bien être</Button></DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Commerce"><Button>Commerce</Button></DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Services"><Button>Services</Button></DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Restauration"><Button>Restauration</Button></DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>
  );
};

export default Filtres;
