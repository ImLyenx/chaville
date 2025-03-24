import ContactMairie from "../contact-mairie";
import { ModeToggle } from "../mode-toggle";

export default function support() {
    return  (
        <div className="p-2">
            <ModeToggle />
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="w-full max-w-3xl">
                    <ContactMairie />
                </div>
            </div>
        </div>
    )
}