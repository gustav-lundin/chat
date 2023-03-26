import {
  Stack,
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
} from "react-bootstrap";

import { useContext, useState, useRef } from "react";
import { UserContext } from "../App.jsx";
import { useNavigate } from "react-router-dom";
import { fetchJson } from "../fetch.js";

function Login() {
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    const user = await fetchJson("login", "POST", {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
    if (!user.error) {
      setError(null);
      setUser(user);
    } else {
      setError(user.error);
    }
  }

  return (
    <Row className="justify-content-center">
      <Col xs={9} md={6}>
        <Form onSubmit={onSubmit}>
          <Stack gap={3}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                ref={emailRef}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                ref={passwordRef}
              />
            </Form.Group>
            <Row className="justify-content-evenly">
              <Col xs="auto">
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Col>
              <Col xs="auto">
                <Button variant="primary" onClick={() => navigate("/register")}>
                  Register
                </Button>
              </Col>
            </Row>
            {error ? (
              <Alert key="danger" variant="danger">
                {error}
              </Alert>
            ) : (
              ""
            )}
          </Stack>
        </Form>
      </Col>
    </Row>
  );
}

export default Login;
