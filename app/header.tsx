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

export function Header() {
    const [position, setPosition] = React.useState("bottom")
   
    return (
        <section>
            <div className="bg-[#155093] p-5 rounded-full flex flex-row justify-between">
                <div className="text-white flex flex-row mt-2">
                    <p className="text-sm sm:text-base">Consommer Local - Chaville</p>
                </div>
                <div className="flex">
                    <div className="relative">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="sm:w-32 w-20 bg-white p-2 rounded-full">Compte ▼</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>Gérer votre compte</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                                        <DropdownMenuRadioItem value="top"><Button>Votre compte</Button></DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="bottom"><Button>Paramètre</Button></DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="right"><Button>Se déconnecter</Button></DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </section>
    )
  }