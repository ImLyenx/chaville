"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  enterpriseSlug: string;
}

export function ReviewForm({ enterpriseSlug }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Veuillez sélectionner une note");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/enterprise/${enterpriseSlug}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating,
            comment: comment.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      toast.success("Votre avis a été publié avec succès");
      setRating(0);
      setComment("");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center space-y-2">
        <h3 className="text-lg font-semibold">Laisser un avis</h3>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className="p-1 focus:outline-none"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              <Star
                className={`w-8 h-8 ${
                  value <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                } transition-colors`}
              />
            </button>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {rating === 0 ? "Sélectionnez une note" : `Note: ${rating}/5`}
        </span>
      </div>

      <Textarea
        placeholder="Partagez votre expérience... (optionnel)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
      />

      <Button
        type="submit"
        className="w-full"
        disabled={rating === 0 || isSubmitting}
      >
        {isSubmitting ? "Envoi en cours..." : "Publier l'avis"}
      </Button>
    </form>
  );
}
