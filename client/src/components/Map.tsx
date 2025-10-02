"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers with proper TypeScript types
interface LeafletIconDefault extends L.Icon.Default {
  _getIconUrl?: string;
}

delete (L.Icon.Default.prototype as LeafletIconDefault)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapProps {
  location: LocationData | null;
}

// Component to update map center when location changes
function MapUpdater({ location }: { location: LocationData | null }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], 16);
    }
  }, [location, map]);

  return null;
}

// Component to handle map clicks (optional - for testing)
function MapEvents() {
  useMapEvents({
    click: (e) => {
      console.log("Map clicked at:", e.latlng);
    },
  });
  return null;
}

export default function Map({ location }: MapProps) {
  // Default center (will be updated when location is available)
  const defaultCenter: [number, number] = [37.7749, -122.4194]; // San Francisco

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={
          location ? [location.latitude, location.longitude] : defaultCenter
        }
        style={{ height: "100%", width: "100%" }}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Update map center when location changes */}
        <MapUpdater location={location} />

        {/* Map click events */}
        <MapEvents />

        {/* Show marker for current location */}
        {location && (
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>
              <div>
                <strong>Your Current Location</strong>
                <br />
                Lat: {location.latitude.toFixed(6)}
                <br />
                Lng: {location.longitude.toFixed(6)}
                <br />
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
