"use client";

import { useState } from "react";
import Upload from "./upload"; // On importe le composant corrigé

export default function ContactMairie() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [fileUrls, setFileUrls] = useState<{ url: string; name: string }[]>([]);
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
        body: JSON.stringify({
          subject,
          message,
          fileUrls: fileUrls.map((f) => f.url),
        })
        
      });

      if (!response.ok) throw new Error("Échec de l'envoi du message");

      setSuccess(true);
      setMessage("");
      setSubject("");
      setFileUrls([]); // On réinitialise les fichiers après envoi
    } catch (err) {
      setError((err as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 shadow-md rounded-lg border border-gray-500">
      <h2 className="text-xl font-semibold mb-2">Contacter la mairie</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex item-center gap-4 mb-4">
          <label className="flex items-center gap-2 w-full">
            Sujet:
            <textarea
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full h-7 pl-2 border border-gray-500 mt-1"
            ></textarea>
          </label>
        </div>
        <label className="block mb-2">
          Votre message:
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full p-2 h-40 border border-gray-500 rounded mt-1"
          ></textarea>
        </label>
        {fileUrls.length > 0 && (
  <div className="mt-4">
    <p className="font-semibold mb-2">Fichiers ajoutés :</p>
    <ul className="space-y-2">
      {fileUrls.map(({ url, name }, idx) => (
        <li key={idx} className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setFileUrls((prev) => prev.filter((_, i) => i !== idx))
            }
            className="text-red-500 hover:text-red-700 text-sm"
            title="Supprimer ce fichier"
          >
            ❌
          </button>

          {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
            <a href={url} target="_blank" rel="noopener noreferrer">
              <img
                src={url}
                alt={name}
                className="h-16 w-auto rounded border hover:opacity-80 transition"
              />
            </a>
          ) : (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline break-all max-w-[200px] truncate"
            >
              {name}
            </a>
          )}
        </li>
      ))}
    </ul>
  </div>
)}


        <div className="flex items-center gap-3 mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Envoi..." : "Envoyer"}
        </button>
          <Upload setFileUrls={setFileUrls} />
        </div>
      </form>
      {success && <p className="text-green-500 mt-2">Message envoyé !</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}