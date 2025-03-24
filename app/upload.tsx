import { UploadButton } from "@uploadthing/react";

export default function Upload({
  setFileUrls,
}: {
  setFileUrls: (urls: { url: string; name: string }[]) => void;
}) {
  return (
    <div className="flex items-center relative group">
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-dark dark:text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
        Joindre une image
      </div>

      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (!res) return;

          const uploads = res.map((f) => ({
            url: f.url,
            name: f.name, // ← c’est ça qui manquait !
          }));

          setFileUrls((prev) => [...prev, ...uploads]);
        }}
        onUploadError={(error) => {
          alert(`Erreur de téléversement : ${error.message}`);
        }}
        appearance={{
          container: "w-8 h-8 flex items-center justify-center",
          button: "w-full h-full p-0 bg-transparent border-none cursor-pointer",
          allowedContent: "hidden",
        }}
        content={{
          button({ ready }) {
            return (
              <img
                src="/logo_send-files.png"
                alt="Joindre un fichier"
                className="w-6 h-6"
              />
            );
          },
        }}
      />
    </div>
  );
}



