"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiPUT } from "@/api/apiMethods";
import React from "react";

interface LikeButtonProps {
  reviewId: number;
  initialLiked: boolean;
  updateUrl: string;
  className?: string;
  onToggle?: (newLiked: boolean) => void;
}

export default function LikeButton({
  reviewId,
  initialLiked,
  updateUrl,
  className,
  onToggle,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);  

  const toggleLike = async () => {
    console.log("Toggling like...");
    setLoading(true);
    try {
    console.log("Final PUT URL:", updateUrl.replace(":id", reviewId.toString()));
      const res = await apiPUT(
        updateUrl,
        reviewId.toString(),
        JSON.stringify({ liked: !liked })
      );
      if (res.success) {
        const newLiked = !liked;
        setLiked(newLiked);
        onToggle?.(newLiked);
      } else {
        console.error("Failed to update like status:", res.error);
      }
    } catch (err) {
      console.error("Like toggle error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={cn(
        "p-2 rounded-full transition-colors",
        liked ? "text-red-500" : "text-gray-400",
        className
      )}
      title={liked ? "Unlike" : "Like"}
    >
      <Heart
        className="w-5 h-5"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
      />
    </button>
  );
}
