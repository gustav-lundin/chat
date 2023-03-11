import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Button, Stack, Alert } from "react-bootstrap";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../util/validations.js";
import { fetchJson } from "../fetch";

function Register(props) {
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState("");
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const passwordConfirm = passwordConfirmRef.current.value;
    const error = validateRegistration(
      firstName,
      lastName,
      email,
      password,
      passwordConfirm
    );
    if (error !== "") {
      setError(error);
      return;
    }
    try {
      const user = await fetchJson("users", "POST", {
        firstName,
        lastName,
        email,
        password,
      });
      console.log(user);
      if (user.error) {
        setError(user.error);
        return;
      }
      setUser(user);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Row className="justify-content-center">
      <Col xs={9} md={6}>
        <Form onSubmit={onSubmit}>
          <Stack gap={3}>
            <Form.Group controlId="formFirstName">
              <Form.Label>First name</Form.Label>
              <Form.Control
                placeholder="Enter first name"
                ref={firstNameRef}
                required
                type="text"
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                placeholder="Enter last name"
                ref={lastNameRef}
                required
                type="text"
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                placeholder="Enter email"
                type="email"
                ref={emailRef}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                placeholder="Enter password"
                type="password"
                ref={passwordRef}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPasswordConfirm">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                placeholder="Confirm password"
                type="password"
                ref={passwordConfirmRef}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Register
            </Button>
            {error !== "" ? (
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

function validateRegistration(
  firstName,
  lastName,
  email,
  password,
  passwordConfirm
) {
  const passwordErr = validatePassword(password, passwordConfirm);
  if (passwordErr !== "") {
    return passwordErr;
  }
  const firstNameErr = validateName(firstName, "First name");
  if (firstNameErr !== "") {
    return firstNameErr;
  }
  const lastNameErr = validateName(lastName, "Last name");
  if (lastNameErr !== "") {
    return lastNameErr;
  }
  const emailErr = validateEmail(email);
  if (emailErr !== "") {
    return emailErr;
  }
  return "";
}

export default Register;
