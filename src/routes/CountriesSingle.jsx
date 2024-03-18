import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Map from "../components/Map";

const CountriesSingle = () => {
  const [weather, setWeather] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [coordinates, setCoordinates] = useState("");

  const location = useLocation();

  const country = location.state?.country;
  const capital = location?.state?.country?.capital[0];

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${
            country?.capital
          }&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
        );
        const data = response.data;

        if (data.weather.length > 0) {
          setWeather(data);
          setLoading(false);
        } else {
          Swal.fire({
            text: "No weather data available",
            icon: "info",
          });
        }
      };

      fetchData();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `${error}`,
        icon: "error",
      });
      setError(true);
    }
  }, [country?.capital]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
            capital
          )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
        );
        const data = res.data;

        const coordinates = data.results[0]?.geometry?.location;
        setCoordinates(coordinates);
      };

      fetchData();
    } catch (error) {
      console.log("Error: ", error);
    }
  }, [capital]);

  if (loading) {
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
    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
      <Container>
        <Row className="m-3">
          <Col>
            {" "}
            <Image thumbnail src={`${country?.flags?.svg}`} />
          </Col>
          <Col>
            <h2 className="display-4">{country?.name?.common}</h2>
            <h3>Capital: {country?.capital}</h3>
            {!error && weather && (
              <div style={{display: "flex", alignItems: "center"}}>
                <p>
                  It is currently <strong>{weather?.main.temp}</strong> degrees
                  in {country?.capital} and {weather?.weather[0].description}.
                </p>
                <img
                  src={`http://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
                  alt={weather?.weather[0].description}
                />
              </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="secondary" onClick={() => navigate("/countries")}>
              Back to Countries
            </Button>
          </Col>
        </Row>
      </Container>
      <div>
        <Map coordinates={coordinates} />
      </div>
    </div>
  );
};

export default CountriesSingle;
