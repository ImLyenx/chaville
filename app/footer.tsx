"use client";
import { Button } from "@/components/ui/button";


export default function Footer(){
    return(
        <footer className="flex justify-center flex-col items-center p-4 text-gray-600">
            <hr className="w-full bg-[#797979] h-1 rounded-full bg-opacity-50 sm:mt-20"></hr>
            <div className="m-0">
                <Button className="bg-transparent text-[#797979] px-5 shadow-none hover:bg-transparent">Contact</Button>
                <Button className="bg-transparent text-[#797979] px-5 shadow-none hover:bg-transparent">Mentions légales</Button>
                <Button className="bg-transparent text-[#797979] px-5 shadow-none hover:bg-transparent">CESU</Button>
            </div>
        </footer>
    )
}