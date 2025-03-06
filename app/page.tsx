"use client";

import { authClient } from "@/lib/auth-client";

export default function Home() {
  const {
    data: sessionData,
    error: sessionError,
    isPending: isSessionPending,
    refetch: refetchSession,
  } = authClient.useSession();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email: string = formData.get("email") as string;
    const name: string = formData.get("name") as string;
    const password: string = formData.get("password") as string;
    const { data, error } = await authClient.signUp.email({
      email,
      name,
      password,
    });

    if (error) {
      console.error("Sign up error:", error);
    } else {
      console.log("Sign up successful:", data);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email: string = formData.get("email") as string;
    const password: string = formData.get("password") as string;
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });
  };
  return (
    <div>
      {sessionData?.user?.email}
      <form className="flex flex-col gap-4 max-w-96" onSubmit={handleSignUp}>
        <input type="email" name="email" required />
        <input type="text" name="name" required />
        <input type="password" name="password" required />
        <button type="submit">Sign Up</button>
      </form>
      <form className="flex flex-col gap-4 max-w-96" onSubmit={handleSignIn}>
        <input type="email" name="email" required />
        <input type="password" name="password" required />
        <button type="submit">Sign In</button>
      </form>
      <button onClick={() => authClient.signOut()}>Sign Out</button>
    </div>
  );
}
