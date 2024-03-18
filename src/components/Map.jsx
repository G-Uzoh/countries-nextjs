import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Col, Spinner } from "react-bootstrap";

const Map = ({ coordinates }) => {
  const libraries = ["places"];
  const mapContainerStyle = {
    width: "50vw",
    height: "50vh",
  };

  const center = coordinates;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return (
      <Col className="text-center m-5">
        <Spinner
          animation="border"
          role="status"
          className="center"
          variant="info"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Col>
    );
  }

  return (
    <div>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={8} center={center}>
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export default Map;
