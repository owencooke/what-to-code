"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  initialLikes: number;
  projectId: string;
}

export default function LikeButton({
  initialLikes,
  projectId,
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    try {
      // TODO: Implement API call to update likes
      // const response = await fetch(`/api/projects/${projectId}/like`, { method: 'POST' });
      // if (response.ok) {
      setLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
      setIsLiked(!isLiked);
      // }
    } catch (error) {
      console.error("Failed to update like", error);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleLike();
      }}
      className="flex items-center focus:outline-none"
    >
      <Heart
        className={`w-4 h-4 mr-1 ${isLiked ? "fill-red-500 text-red-500" : "text-red-500"}`}
      />
      <span className="text-sm text-muted-foreground">{likes}</span>
    </button>
  );
}
