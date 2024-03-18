import { collection, getDocs } from "firebase/firestore";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout } from "../auth/firebase";
import { useEffect, useState } from "react";

const Header = () => {
  const [name, setName] = useState("");

  const [user] = useAuthState(auth);

  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const res = await getDocs(collection(db, "users"));
      
      const userData = res.docs
        .map((doc) => doc.data())
        .filter((doc) => doc.uid === user?.uid);

      setName(userData[0]?.name);
    };

    if (user) getUserData();
  }, [user]);

  return (
    <Container fluid>
      <Row>
        <Navbar bg="light" variant="light">
          <Container className="justify-content-end">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                <Link to="/">
                  <Button variant="contained">Home</Button>
                </Link>
                <Link to="/countries">
                  <Button variant="contained">Countries</Button>
                </Link>
                <Link to="/favourites">
                  <Button variant="contained">Favourites</Button>
                </Link>
                {!user && (
                  <Link to="/register">
                    <Button variant="contained">Register</Button>
                  </Link>
                )}
                {!user && (
                  <Link to="/login">
                    <Button variant="contained">Login</Button>
                  </Link>
                )}
                {user && (
                  <Button
                    onClick={() => {
                      logout();
                      setName("");
                      navigate("/");
                    }}
                  >
                    Logout
                  </Button>
                )}
              </Nav>
              <Navbar.Text>
                {name ? `Welcome, ${name}` : "Welcome, Guest"}
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Row>
    </Container>
  );
};

export default Header;
