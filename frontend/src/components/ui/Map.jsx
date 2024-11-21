import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import styles from "./Map.module.css";
function Map() {
  const mapPosition = [35.524715048676505, 6.197151652673275];
  return (
    <MapContainer
      center={mapPosition}
      zoom={16}
      style={{ height: "100%", width: "100%", borderRadius: "1rem" }} // Set the map size
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={mapPosition}>
        <Popup>
          A pretty popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <ChangeCenter position={mapPosition} />
    </MapContainer>
  );
}
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

// function DetectClick() {
//   const navigate = useNavigate();

//   useMapEvents({
//     click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
//   });
// }
export default Map;
