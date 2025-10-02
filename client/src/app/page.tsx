"use client";

import dynamic from "next/dynamic";
import { useGeolocation } from "../hooks/useGeolocation";

// Dynamically import both Map and LocationControls to avoid SSR issues
const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
  loading: () => (
    <div className="mb-4 p-4 bg-gray-100 rounded-lg animate-pulse">
      Loading map...
    </div>
  ),
});

const LocationControls = dynamic(
  () => import("../components/LocationControls"),
  {
    ssr: false,
    loading: () => (
      <div className="mb-4 p-4 bg-gray-100 rounded-lg animate-pulse">
        Loading location controls...
      </div>
    ),
  }
);

export default function Home() {
  const geolocation = useGeolocation();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">
        TAKE-HOME TEST: REAL-TIME USER TRACKING APP
      </h1>

      {/* Location info and controls */}
      <LocationControls geolocation={geolocation} />

      {/* Map */}
      <Map location={geolocation.location} />
    </div>
  );
}
