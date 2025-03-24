import { Header } from "../header";
import Filter from "./filter";

export default function Commercants(){
    return(
        <section className="m:m-10 m-2">
            <Header />
            <div className="flex justify-center">
                <h1 className="text-6xl m-auto mt-10">(Re) Découvrir vos commerçants</h1>
            </div>
            <div className="flex justify-center gap-20 mt-20">
                <h2 className="text-2xl font-bold mr-10">Filtres:</h2>
                <Filter />
            </div>
            <div className="grid grid-cols-4 grid-rows-2 ml-14">
                <div className="w-56 h-80 bg-slate-500 rounded-3xl m-5"></div>
                <div className="w-56 h-80 bg-slate-500 rounded-3xl m-5"></div>
                <div className="w-56 h-80 bg-slate-500 rounded-3xl m-5"></div>
                <div className="w-56 h-80 bg-slate-500 rounded-3xl m-5"></div>
                <div className="w-56 h-80 bg-slate-500 rounded-3xl m-5"></div>
                <div className="w-56 h-80 bg-slate-500 rounded-3xl m-5"></div>
                <div className="w-56 h-80 bg-slate-500 rounded-3xl m-5"></div>
                <div className="w-56 h-80 bg-slate-500 rounded-3xl m-5"></div>
            </div>
        </section>
    )
}