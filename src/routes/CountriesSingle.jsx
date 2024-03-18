import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const CountriesSingle = () => {
  const [weather, setWeather] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const location = useLocation();
  const country = location.state?.country;

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

        console.log("Data: ", data);
      };

      fetchData();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `${error}`,
        icon: "error",
      })
      setError(true);
    }
  }, [country?.capital]);

  console.log("Weather: ", weather?.weather);

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
    <Container>
      <Row className="m-5">
        <Col>
          {" "}
          <Image
            thumbnail
            src={`${country?.flags?.svg}`}
          />
        </Col>
        <Col>
          <h2 className="display-4">{country?.name?.common}</h2>
          <h3>Capital: {country?.capital}</h3>
          {!error && weather && (
            <div>
              <p>
                It is currently <strong>{weather?.main.temp}</strong> degrees in{" "}
                {country?.capital} and {weather?.weather[0].description}.
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
          <Button variant="light" onClick={() => navigate("/countries")}>
            Back to Countries
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CountriesSingle;
