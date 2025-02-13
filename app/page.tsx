"use client"; 

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
    const [isLogin, setIsLogin] = useState(false); 
    const [userName, setUserName] = useState(""); 
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUser = localStorage.getItem("user"); 
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    setIsLogin(true);
                    setUserName(user.name);
                } else {
                    setIsLogin(false);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
                setIsLogin(false);
            }
        };
        fetchUser();
    }, []);

    return (
        <div>
            {isLogin ? (
                <>
                    <button onClick={() => router.push("/")}>{userName}</button>
                </>
            ) : (
                <Link href="/SignUp">
                    <button>Se connecter</button>
                </Link>
            )}
        </div>
    );
}
