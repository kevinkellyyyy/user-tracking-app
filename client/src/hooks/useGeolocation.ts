import { useEffect, useState } from "react";

export function useGeolocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    // built-in browser API for accessing the user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const data: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(data);
        setError(null);
      },
      (err) => {
        const messages: Record<number, string> = {
          1: "Location access denied by user.",
          2: "Location information is unavailable.",
          3: "Location request timed out.",
        };
        setError(messages[err.code] || "Unknown error occurred");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle tracking interval every second
  useEffect(() => {
    if (!isTracking) return;

    getLocation();
    const interval = setInterval(getLocation, 1000);
    return () => clearInterval(interval);
  }, [isTracking]);

  const toggleTracking = () => setIsTracking(!isTracking);

  return {
    location,
    error,
    isTracking,
    getLocation,
    toggleTracking,
  };
}
