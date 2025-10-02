"use client";

import { useEffect, useState } from "react";

interface LocationControlsProps {
  geolocation: {
    location: LocationData | null;
    error: string | null;
    isTracking: boolean;
    getLocation: () => void;
    toggleTracking: () => void;
  };
}

export default function LocationControls({
  geolocation,
}: LocationControlsProps) {
  const [mounted, setMounted] = useState(false);
  const { location, error, isTracking, getLocation, toggleTracking } =
    geolocation;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get initial location when mounted
  useEffect(() => {
    if (mounted) getLocation();
  }, [mounted, getLocation]);

  // Don't render anything until mounted on client
  if (!mounted) {
    return (
      <div className="mb-4 p-4 bg-gray-100 rounded-lg animate-pulse">
        Loading location controls...
      </div>
    );
  }

  return (
    <div className="mb-4 p-4 bg-gray-100 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Current Location</h2>
        <button
          onClick={toggleTracking}
          className={`px-4 py-2 rounded ${
            isTracking
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {isTracking ? "Stop Tracking" : "Start Live Tracking"}
        </button>
      </div>

      {error && (
        <div className="text-red-600 mb-2">
          <strong>Error:</strong> {error}
        </div>
      )}

      {location ? (
        <div className="space-y-1">
          <p>
            <strong>Latitude:</strong> {location.latitude.toFixed(6)}
          </p>
          <p>
            <strong>Longitude:</strong> {location.longitude.toFixed(6)}
          </p>
          {isTracking && (
            <p className="text-green-600 font-semibold">
              🔴 Live tracking active (updates every second)
            </p>
          )}
        </div>
      ) : (
        <p>Getting your location...</p>
      )}

      <button
        onClick={getLocation}
        className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        disabled={isTracking}
      >
        Refresh Location
      </button>
    </div>
  );
}
