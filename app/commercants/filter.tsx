"use client"
 
import * as React from "react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Filtres(){
    const [position, setPosition] = React.useState("bottom")

    return(
        <section className="flex justify-center gap-20">
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="sm:w-32 w-24 p-2 px-10">Premier filtre  ▼</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                            <DropdownMenuRadioItem value="top"><Button>Votre compte</Button></DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="bottom"><Button>Paramètre</Button></DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="right"><Button>Se déconnecter</Button></DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>  
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="sm:w-32 w-20  p-2">Deuxième filtre  ▼</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                            <DropdownMenuRadioItem value="top"><Button>Votre compte</Button></DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="bottom"><Button>Paramètre</Button></DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="right"><Button>Se déconnecter</Button></DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
            <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="sm:w-32 w-20  p-2">Troisième filtre  ▼</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                            <DropdownMenuRadioItem value="top"><Button>Votre compte</Button></DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="bottom"><Button>Paramètre</Button></DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="right"><Button>Se déconnecter</Button></DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
            <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="sm:w-32 w-20  p-2">Quatrième filtre  ▼</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                            <DropdownMenuRadioItem value="top"><Button>Votre compte</Button></DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="bottom"><Button>Paramètre</Button></DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="right"><Button>Se déconnecter</Button></DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </section>
    )
}