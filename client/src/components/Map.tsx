"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { defaultPin, mainPin, realUserPin } from "@/assets/leafletIcons";
import { UsersResponse } from "../types/websocket";
import { LocationData } from "@/types";
import UserMarker from "./UserMarker";

interface MapProps {
  location: LocationData | null;
  username: string;
  userUuid: string;
  otherUserLoc?: UsersResponse;
  fakeUserCount: number;
  followedUserId: string | null;
  onFollowUser: (userId: string, userData: {
    id: string;
    name: string;
  }) => void;
  onUnfollowUser: () => void;
}

function MapEvent({
  followedUserId,
  onToggleFollow,
  currentLocation,
}: {
  followedUserId: string | null;
  onToggleFollow: (userId: string | null) => void;
  currentLocation: LocationData | null;
}) {
  const map = useMap();

  // need onclick event to cancel the follow mode when user clicks on the map (outside of marker/popup)
  useEffect(() => {
    const onClick = () => {
      if (followedUserId && currentLocation) {
        // Cancel follow mode and return to main location
        onToggleFollow(null);
        map.panTo([currentLocation.latitude, currentLocation.longitude]);
      }
    };

    map.on("click", onClick);

    return () => {
      map.off("click", onClick);
    };
  }, [map, followedUserId, onToggleFollow, currentLocation]);

  return null;
}

// Component to update map center when location changes
function MapUpdater({ location }: { location: LocationData | null }) {
  const map = useMap();
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (location) {
      if (!hasInitializedRef.current) {
        // First time: set initial view with default zoom
        map.setView([location.latitude, location.longitude], 16);
        hasInitializedRef.current = true;
      } else {
        // Subsequent updates: only update center, preserve user's zoom level
        const currentZoom = map.getZoom();
        map.setView([location.latitude, location.longitude], currentZoom);
      }
    }
  }, [location, map]);

  // Handle map container size changes and hot reloading
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

// Component that continuously follows a selected user
function FollowManager({
  followedUserId,
  otherUsers,
  otherUserLoc,
  currentLocation,
}: {
  followedUserId: string | null;
  otherUsers: UsersResponse;
  otherUserLoc?: UsersResponse;
  currentLocation: LocationData | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!followedUserId) return;

    // Find the followed user in fake users, real users, or current user
    let targetLocation: { latitude: number; longitude: number } | null = null;

    if (followedUserId === "self" && currentLocation) {
      targetLocation = currentLocation;
    } else if (otherUsers[followedUserId]) {
      targetLocation = otherUsers[followedUserId].state;
    } else if (otherUserLoc && otherUserLoc[followedUserId]) {
      targetLocation = otherUserLoc[followedUserId].state;
    }

    if (targetLocation) {
      // Use setView to force positioning (overrides popup auto-positioning)
      map.setView(
        [targetLocation.latitude, targetLocation.longitude],
        map.getZoom(),
        {
          animate: true,
          duration: 1.0,
        }
      );
    }
  }, [followedUserId, otherUsers, otherUserLoc, currentLocation, map]);

  return null;
}

export default function Map({
  location,
  otherUserLoc,
  username,
  userUuid,
  fakeUserCount,
  followedUserId,
  onFollowUser,
  onUnfollowUser,
}: MapProps) {
  const defaultCenter: [number, number] = [0, 0];

  // simulate other 5 user live location, but with change position every 1 seconds with 1 meter lat long movement (+/- 0.00001)
  const [otherUsers, setOtherUsers] = useState<UsersResponse>({});

  // Track if we've already created users for current count
  const hasCreatedUsersRef = useRef(0);

  // Handle follow toggle
  const handleFollowToggle = (userId: string | null) => {
    if (userId === null) {
      onUnfollowUser();
    } else {
      // Find user data to pass to parent
      let userData = null;
      
      if (otherUsers[userId]) {
        // Fake user
        userData = {
          id: userId,
          name: otherUsers[userId].username,
        };
      } else if (otherUserLoc && otherUserLoc[userId]) {
        // Real user
        userData = {
          id: userId,
          name: otherUserLoc[userId].username,
        };
      }
      
      if (userData) {
        onFollowUser(userId, userData);
      }
    }
  };

  // Initialize fake users ONLY when fakeUserCount changes (not on location updates)
  useEffect(() => {
    if (fakeUserCount > 0 && location) {
      // Only create if count changed and we haven't created for this count yet
      if (hasCreatedUsersRef.current !== fakeUserCount) {
        const fakeUsers: UsersResponse = {};

        // Create n fake users around the current location
        for (let i = 1; i <= fakeUserCount; i++) {
          const fakeUuid = `simulated-user-${i}`;
          const offsetLat = (Math.random() - 0.5) * 0.01; // Random offset within ~100 meters
          const offsetLng = (Math.random() - 0.5) * 0.01;

          fakeUsers[fakeUuid] = {
            username: `SimulatedUser${i}`,
            state: {
              latitude: location.latitude + offsetLat,
              longitude: location.longitude + offsetLng,
            },
          };
        }

        setOtherUsers(fakeUsers);
        hasCreatedUsersRef.current = fakeUserCount;
      }
    } else if (fakeUserCount === 0) {
      // Reset fake users when count is 0
      setOtherUsers({});
      hasCreatedUsersRef.current = 0;
    }
  }, [fakeUserCount, location]); // Only depend on fakeUserCount changes, not location updates

  // Update fake users positions every 1 second (MOVEMENT ONLY)
  useEffect(() => {
    if (fakeUserCount === 0) return;

    const interval = setInterval(() => {
      setOtherUsers((prev) => {
        // Only move if we have users
        if (Object.keys(prev).length === 0) return prev;

        const updated = { ...prev };
        for (const uuid in updated) {
          // Move each user randomly by ~10 meter (0.001 degrees)
          updated[uuid].state.latitude +=
            (Math.random() > 0.55 ? 1 : -1) * 0.0001;
          updated[uuid].state.longitude +=
            (Math.random() > 0.44 ? 1 : -1) * 0.0001;
        }
        return updated;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [fakeUserCount]); // Only depend on fakeUserCount, not the users themselves

  return (
    <div className="h-[100vh] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={
          location ? [location.latitude, location.longitude] : defaultCenter
        }
        style={{ height: "100%", width: "100%" }}
        className="leaflet-container"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Update map center when location changes */}
        <MapUpdater location={location} />

        {/* Map Event */}
        <MapEvent
          followedUserId={followedUserId}
          onToggleFollow={handleFollowToggle}
          currentLocation={location}
        />

        {/* Follow manager for continuous following */}
        <FollowManager
          followedUserId={followedUserId}
          otherUsers={otherUsers}
          otherUserLoc={otherUserLoc}
          currentLocation={location}
        />

        {/* Show fake/simulated users */}
        {Object.entries(otherUsers).map(([uuid, userData]) => (
          <UserMarker
            key={uuid}
            uuid={uuid}
            userData={userData}
            icon={defaultPin}
            title={`🤖 ${userData.username}`}
            subtitle="Beep boop beep aku robot..."
            showFollowButton={true}
            followedUserId={followedUserId}
            onToggleFollow={handleFollowToggle}
          />
        ))}

        {/* Show markers for other users */}
        {otherUserLoc &&
          Object.entries(otherUserLoc)
            .filter(([uuid]) => uuid !== userUuid)
            .map(([uuid, userData]) => (
              <UserMarker
                key={uuid}
                uuid={uuid}
                userData={userData}
                icon={realUserPin}
                title="👋 Other User Current Location"
                showFollowButton={true}
                followedUserId={followedUserId}
                onToggleFollow={handleFollowToggle}
              />
            ))}

        {/* Show marker for current location */}
        {location && (
          <UserMarker
            uuid={userUuid}
            userData={{
              username: username,
              state: {
                latitude: location.latitude,
                longitude: location.longitude,
              },
            }}
            icon={mainPin}
            title="📌 Your Current Location"
            showFollowButton={false}
          />
        )}
      </MapContainer>
    </div>
  );
}
