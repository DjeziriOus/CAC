import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import styles from "./Map.module.css";
function Map() {
  const mapPosition = [35.524715048676505, 6.197151652673275];
  return (
    // <MapContainer
    //   center={mapPosition}
    //   zoom={16}
    //   style={{ height: "100%", width: "100%", borderRadius: "1rem" }} // Set the map size
    // >
    //   <TileLayer
    //     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //   />
    //   <Marker position={mapPosition}>
    //     <Popup>
    //       A pretty popup. <br /> Easily customizable.
    //     </Popup>
    //   </Marker>
    //   <ChangeCenter position={mapPosition} />
    // </MapContainer>
    <div className="overflow-hidden rounded-xl shadow-lg">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d51148.489922814944!2d3.095252079311984!3d36.75183655377344!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sdz!4v1737284400736!5m2!1sen!2sdz"
        width="100%"
        height="250"
        allowfullscreen=""
        loading="lazy"
        // referrerpolicy="no-referrer-when-downgrade"
        title="location of the seller"
      ></iframe>
    </div>
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
