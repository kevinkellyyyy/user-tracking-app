"use client";

import dynamic from "next/dynamic";
import { useGeolocation } from "../hooks/useGeolocation";
import useWebSocket from "react-use-websocket";
import { useEffect, useRef, useState } from "react";
import { UsersResponse } from "../types";

// Dynamically import both Map and ControlPanel to avoid SSR issues
const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
  loading: () => (
    <div className="mb-4 p-4 bg-gray-100 rounded-lg animate-pulse">
      Loading map...
    </div>
  ),
});

const ControlPanel = dynamic(() => import("../components/ControlPanel"), {
  ssr: false,
});

export default function MainApp({
  username,
  userUuid,
}: {
  username: string;
  userUuid: string;
}) {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://127.0.0.1:5555";
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(wsUrl, {
    queryParams: { username, uuid: userUuid },
  });

  const { getLocation, location } = useGeolocation({ username, userUuid });
  const lastSentLocationRef = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Fake users state (lifted from ControlPanel)
  const [fakeUserCount, setFakeUserCount] = useState(0);

  // Follow system state
  const [followedUserId, setFollowedUserId] = useState<string | null>(null);
  const [followedUserData, setFollowedUserData] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Send initial connection message once
  useEffect(() => {
    getLocation();
    sendJsonMessage({ longitude: 0, latitude: 0, uuid: userUuid });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // disable exhaustive-deps to avoid re-running when getLocation or sendJsonMessage change

  // Handle location updates separately from WebSocket messages
  useEffect(() => {
    if (!location) return;

    const LOCATION_THRESHOLD = 0.00001; // ~1.1 meters at equator

    // Check if location has changed significantly from last sent location, to prevent server request flooding
    const lastSent = lastSentLocationRef.current;
    const hasLocationChanged =
      !lastSent ||
      Math.abs(lastSent.latitude - location.latitude) >= LOCATION_THRESHOLD ||
      Math.abs(lastSent.longitude - location.longitude) >= LOCATION_THRESHOLD;

    if (hasLocationChanged) {
      const message = {
        longitude: location.longitude,
        latitude: location.latitude,
        uuid: userUuid,
      };

      sendJsonMessage(message);

      // Update the last sent location reference
      lastSentLocationRef.current = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
    }
  }, [location, userUuid, sendJsonMessage]);

  return (
    <div className="relative h-screen">
      {/* Control Panel Component */}
      <ControlPanel
        username={username}
        userUuid={userUuid}
        fakeUserCount={fakeUserCount}
        setFakeUserCount={setFakeUserCount}
        followedUserId={followedUserId}
        followedUserData={followedUserData}
        onUnfollow={() => {
          setFollowedUserId(null);
          setFollowedUserData(null);
        }}
      />

      {/* Map Component */}
      <Map
        location={location}
        username={username}
        userUuid={userUuid}
        otherUserLoc={lastJsonMessage as UsersResponse}
        fakeUserCount={fakeUserCount}
        followedUserId={followedUserId}
        onFollowUser={(userId, userData) => {
          setFollowedUserId(userId);
          setFollowedUserData(userData);
        }}
        onUnfollowUser={() => {
          setFollowedUserId(null);
          setFollowedUserData(null);
        }}
      />
    </div>
  );
}
