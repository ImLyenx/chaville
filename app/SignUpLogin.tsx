"use client";

import { useState } from "react";
import { signUp, signIn } from "@/lib/auth-client"; 
import { useRouter } from "next/navigation";

export default function SignUpLogin() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLogin, setIsLogin] = useState(true); 

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            let user;
            if (isLogin) {
                console.log("Tentative de connexion...");
                user = await signIn.email({ email, password });
                setSuccess("Connexion réussie !");
            } else {
                console.log("Tentative d'inscription...");
                user = await signUp.email({ email, name, password });
                setSuccess("Inscription réussie, connexion en cours...");

                console.log("Connexion automatique...");
                await signIn.email({ email, password });
            }

            localStorage.setItem("user", JSON.stringify({ name }));

            console.log("Redirection vers /...");
            router.push("/");
            
        } catch (err: any) {
            console.error("Erreur :", err);
            setError(err.message || "Une erreur est survenue.");
        }
    };

    return (
        <div>
            <h2>{isLogin ? "Connexion" : "Inscription"}</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <form onSubmit={handleSubmit}>
                {!isLogin && ( 
                    <input
                        type="text"
                        placeholder="Nom"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isLogin ? "Se connecter" : "S'inscrire"}</button>
            </form>

            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Pas encore inscrit ? Créez un compte" : "Déjà inscrit ? Connectez-vous"}
            </button>
        </div>
    );
}

