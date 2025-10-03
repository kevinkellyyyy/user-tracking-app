"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import FollowButton from "./FollowButton";

interface UserMarkerProps {
  uuid: string;
  userData: {
    username: string;
    state: { latitude: number; longitude: number };
  };
  icon: L.Icon;
  title: string;
  subtitle?: string;
  showFollowButton?: boolean;
  followedUserId?: string | null;
  onToggleFollow?: (userId: string | null) => void;
}

export default function UserMarker({
  uuid,
  userData,
  icon,
  title,
  subtitle,
  showFollowButton = false,
  followedUserId,
  onToggleFollow,
}: UserMarkerProps) {
  return (
    <Marker
      key={uuid}
      position={[userData.state.latitude, userData.state.longitude]}
      icon={icon}
    >
      <Popup>
        <div className="flex flex-col gap-1">
          <div className="font-bold text-lg">{title}</div>
          {subtitle && (
            <small className="text-gray-500 block mb-2">{subtitle}</small>
          )}
          <span>
            <strong>ID: </strong>
            {uuid}
          </span>
          <span>
            <strong>Name: </strong>
            {userData.username}
          </span>
          <span>
            <strong>Lat: </strong>
            {userData.state.latitude.toFixed(6)}
          </span>
          <span>
            <strong>Long: </strong>
            {userData.state.longitude.toFixed(6)}
          </span>
          {showFollowButton &&
            followedUserId !== undefined &&
            onToggleFollow && (
              <FollowButton
                userId={uuid}
                latitude={userData.state.latitude}
                longitude={userData.state.longitude}
                label={
                  uuid.startsWith("simulated") ? "Follow Bot" : "Follow User"
                }
                followedUserId={followedUserId}
                onToggleFollow={onToggleFollow}
              />
            )}
        </div>
      </Popup>
    </Marker>
  );
}
