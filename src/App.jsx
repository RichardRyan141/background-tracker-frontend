import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ✅ No public URL needed, fetch from internal backend via proxy
// For dev, Vite proxy handles /api; in prod, you can still set VITE_BACKEND_URL if needed
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "/api";

export default function App() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/locations`)
      .then((res) => res.json())
      .then((data) =>
        // ✅ Minimal fix: use `longtitude` if `longitude` is missing
        setLocations(
          data.map((loc) => ({
            ...loc,
            longitude: loc.longitude ?? loc.longtitude,
          }))
        )
      )
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    console.log("Fetched locations:", locations);
  }, [locations]);

  if (locations.length === 0) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading map...</p>;
  }

  const last = locations[0];
  const center = [last.latitude, last.longitude];

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapContainer center={center} zoom={14} style={{ width: "100%", height: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc, i) => (
          <Marker
            key={i}
            position={[loc.latitude, loc.longitude]}
            icon={markerIcon}
          >
            <Popup>
              <b>Latitude:</b> {loc.latitude.toFixed(5)} <br />
              <b>Longitude:</b> {loc.longitude.toFixed(5)} <br />
              <b>Time:</b> {new Date(loc.timestamp).toLocaleString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
