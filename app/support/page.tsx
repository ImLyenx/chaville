import ContactMairie from "../contact-mairie";
import { Header } from "../header";
import Footer from "../footer";

export default function support() {
    return  (
        <div className="sm:m-10 m-2">
        <Header/>
        <div className="flex items-center justify-center mt-12 px-4">
                <div className="w-full max-w-3xl">
                    <ContactMairie />
                </div>
            </div>
        <Footer/>
        </div>
    )
}