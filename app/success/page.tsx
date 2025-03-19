import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-8 text-center gap-4">
      <h1 className="text-2xl font-bold">Compte créé avec succès</h1>
      <p className="text-sm text-gray-500">
        Votre compte a été créé avec succès. Vous allez recevoir un email de
        confirmation, veuillez le consulter et cliquer sur le lien pour accéder
        à votre compte.
      </p>
      <Link href="/" className="text-primary hover:underline">
        Retour à l'accueil
      </Link>
    </div>
  );
}
