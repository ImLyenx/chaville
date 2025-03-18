"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";

interface EditorUploadButtonProps {
  onUploadComplete: (url: string) => void;
}

export default function EditorUploadButton({
  onUploadComplete,
}: EditorUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res: { ufsUrl: string }[]) => {
      if (res?.[0]?.ufsUrl) {
        onUploadComplete(res[0].ufsUrl);
        toast.success("Upload completed");
      }
    },
    onUploadError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await startUpload([file]);
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        ref={fileInputRef}
        className="hidden"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={isUploading ? "bg-gray-200" : ""}
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
    </>
  );
}
