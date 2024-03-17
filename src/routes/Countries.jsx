import { useEffect, useState } from "react";

import { Form, Spinner } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { useDispatch, useSelector } from "react-redux";
import { initializeCountries } from "../store/countriesSlice";
import { addFavourite, removeFavourite } from "../store/favouritesSlice";
import { auth, getFavouritesFromSource } from "../auth/firebase";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const Countries = () => {
  const dispatch = useDispatch();

  const countriesList = useSelector((state) => state.countries.countries);
  const favourites = useSelector((state) => state.favourites.favourites);
  const loading = useSelector((state) => state.countries.loading);
  // const search = useSelector((state) => state.countries.search);
  const [search, setSearch] = useState("");
  const [user] = useAuthState(auth);

  useEffect(() => {
    dispatch(initializeCountries());
    dispatch(getFavouritesFromSource());
  }, [dispatch]);

  // TODO; Add a useEffect to filter the countriesList based on the search value
  // useEffect(() => {}, [search]);

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

  if (user) {
    return (
      <Container fluid>
        <Row>
          <Form.Control
            style={{ width: "18rem" }}
            type="search"
            className="me-2"
            placeholder="Search..."
            aria-label="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Row>
        <Row xs={2} md={3} lg={4} className="g-3">
          {countriesList
            .filter((country) =>
              country.name.common.toLowerCase().includes(search.toLowerCase())
            )
            .map((country) => (
              <Col key={country.name.common} className="mt-5">
                <Card className="h-100">
                  {favourites.some((fav) => fav === country.name.common) ? (
                    <FavoriteBorderIcon
                      onClick={() =>
                        dispatch(removeFavourite(country.name.common))
                      }
                    />
                  ) : (
                    <FavoriteIcon
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => dispatch(addFavourite(country.name.common))}
                    />
                  )}
                  <Link
                    to={`/countries/${country.name.common}`}
                    state={{ country: country }}
                  >
                    <Card.Img
                      variant="top"
                      className="rounded h-50"
                      src={country.flags.svg}
                      style={{
                        objectFit: "cover",
                        minHeight: "200px",
                        maxHeight: "200px",
                      }}
                    />
                  </Link>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{country.name.common}</Card.Title>
                    <Card.Subtitle className="mb-5 text-muted">
                      {country.name.official}
                    </Card.Subtitle>
                    <ListGroup
                      variant="flush"
                      className="flex-grow-1 justify-content-end"
                    >
                      <ListGroup.Item>
                        <i className="bi bi-translate me-2"></i>
                        {Object.values(country.languages ?? {}).join(", ")}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <i className="bi bi-cash-coin me-2"></i>
                        {Object.values(country.currencies || {})
                          .map((currency) => currency.name)
                          .join(", ")}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        {country.population.toLocaleString()}
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
    );
  }

  return (
    <p>Sign in to view countries</p>
  )
};

export default Countries;
