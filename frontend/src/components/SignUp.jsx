import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import { Form, Button, Container, Row, Card, Col } from "react-bootstrap";

export default function SignUp() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  function validate() {
    const newErrors = {};

    if (!firstname.trim()) {
      newErrors.firstname = "First name is required.";
    } else if (!/^[a-zA-Z]{2,}$/.test(firstname)) {
      newErrors.firstname =
        "First name must contain at least 2 letters and no symbols.";
    }

    if (!lastname.trim()) {
      newErrors.lastname = "Last name is required.";
    } else if (!/^[a-zA-Z]{2,}$/.test(lastname)) {
      newErrors.lastname =
        "Last name must contain at least 2 letters and no symbols.";
    }

    if (!email) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Birthdate is required.";
    } else {
      const today = new Date();
      const dob = new Date(dateOfBirth);
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      if (age < 10) {
        newErrors.dateOfBirth = "You must be at least 10 years old.";
      }
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
    ) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, and a number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    try {
      const result = await axios.post("http://localhost:5000/auth/register", {
        firstname,
        lastname,
        dateOfBirth,
        email,
        password,
      });

      if (result.status === 201) {
        navigate("/");
      } else {
        alert("An error occurred!!!");
        console.log(result);
      }
    } catch (err) {
      alert("Registration failed. Please try again.");
      console.log(err);
      
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={6}>
            <Card className="border-0 shadow-lg rounded-4">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="h3 fw-bold text-dark mb-1">Sign up</h2>
                  <p className="text-muted small">
                    Create your account to get started
                  </p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4" controlId="formBasicName">
                        <Form.Label className="fw-semibold small text-uppercase text-secondary">
                          Name
                        </Form.Label>
                        <Form.Control
                          size="lg"
                          type="text"
                          placeholder="John"
                          value={firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                          isInvalid={!!errors.firstname}
                          className="bg-light border-0"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.firstname}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-4" controlId="formBasicLastName">
                        <Form.Label className="fw-semibold small text-uppercase text-secondary">
                          Last name
                        </Form.Label>
                        <Form.Control
                          size="lg"
                          type="text"
                          placeholder="Doe"
                          value={lastname}
                          onChange={(e) => setLastname(e.target.value)}
                          isInvalid={!!errors.lastname}
                          className="bg-light border-0"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.lastname}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4" controlId="formBasicEmail">
                        <Form.Label className="fw-semibold small text-uppercase text-secondary">
                          Email address
                        </Form.Label>
                        <Form.Control
                          size="lg"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          isInvalid={!!errors.email}
                          className="bg-light border-0"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-4" controlId="formBasicDate">
                        <Form.Label className="fw-semibold small text-uppercase text-secondary">
                          Birthdate
                        </Form.Label>
                        <Form.Control
                          size="lg"
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          isInvalid={!!errors.dateOfBirth}
                          className="bg-light border-0"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.dateOfBirth}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label className="fw-semibold small text-uppercase text-secondary">
                      Password
                    </Form.Label>
                    <Form.Control
                      size="lg"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      isInvalid={!!errors.password}
                      className="bg-light border-0"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    className="w-100 mb-4 fw-bold py-2 shadow-sm"
                    variant="primary"
                    size="lg"
                    type="submit"
                  >
                    Sign up
                  </Button>

                  <div className="text-center">
                    <Button
                      className="text-muted px-0 text-decoration-none"
                      variant="link"
                    >
                      Already have an account?
                      <Link
                        to="/"
                        className="text-primary fw-bold text-decoration-none ms-1"
                      >
                        Log in
                      </Link>
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
