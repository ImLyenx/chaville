"use client";

import { useState } from "react";

export default function ContactMairie() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const response = await fetch("/api/send-mail-mairie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      if (!response.ok) throw new Error("Échec de l'envoi du message");

      setSuccess(true);
      setMessage("");
    } catch (err) {
      setError((err as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 shadow-md rounded-lg border  border-gray-500
">
      <h2 className="text-xl font-semibold mb-5">Contacter la mairie</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Votre message:
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full p-10 border border-gray-500 rounded mt-1"
          ></textarea>
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </form>
      {success && <p className="text-green-500 mt-2">Message envoyé !</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

