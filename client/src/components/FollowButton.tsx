"use client";

import { useMap } from "react-leaflet";

interface FollowButtonProps {
  userId: string;
  latitude: number;
  longitude: number;
  label?: string;
  followedUserId: string | null;
  onToggleFollow: (userId: string | null) => void;
}

export default function FollowButton({
  userId,
  label = "Follow",
  followedUserId,
  onToggleFollow,
}: FollowButtonProps) {
  const map = useMap();
  const isFollowing = followedUserId === userId;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Always prevent event bubbling

    if (isFollowing) {
      onToggleFollow(null); // Unfollow
    } else {
      onToggleFollow(userId); // Follow this user
      // Close popup after following
      map.closePopup();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`mt-2 px-3 py-1 rounded text-sm transition-colors ${
        isFollowing
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      }`}
    >
      {isFollowing ? "Unfollow" : label}
    </button>
  );
}
