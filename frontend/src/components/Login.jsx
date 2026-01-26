import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosPrivate from "../api/axios";
import { AuthContext } from "../AuthContext";
import { Form, Button, Container, Row, Card, Col } from "react-bootstrap";

const LOGIN_URL = "/auth"; 

export default function Login() {
  const axios = axiosPrivate;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  function validate() {
    const newErrors = {};
    if (!email) newErrors.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email.";

    if (!password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // 'withCredentials: true' so the browser accepts the cookie.
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      const accessToken = response.data.accessToken;

      login(accessToken);
      navigate("/home");
    } catch (err) {
      console.error("Login Error:", err);

      if (!err?.response) {
        setErrors({ form: "No Server Response" });
      } else if (err.response?.status === 400) {
        setErrors({ form: "Missing Username or Password" });
      } else if (err.response?.status === 401) {
        setErrors({ form: "Unauthorized: Invalid email or password" });
      } else {
        setErrors({ form: "Login failed" });
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="border-0 shadow-lg rounded-4">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="h3 fw-bold text-dark mb-1">Log In</h2>
                  <p className="text-muted small">
                    Enter your credentials to access your account
                  </p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="formBasicEmail">
                    <Form.Label className="fw-semibold small text-uppercase text-secondary ls-1">
                      Email address
                    </Form.Label>
                    <Form.Control
                      size="lg"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      isInvalid={!!errors.email}
                      className="bg-light border-0"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label className="fw-semibold small text-uppercase text-secondary ls-1">
                      Password
                    </Form.Label>
                    <Form.Control
                      size="lg"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      isInvalid={!!errors.password}
                      className="bg-light border-0"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {errors.form && (
                    <div className="text-danger small mb-3 text-center">
                      {errors.form}
                    </div>
                  )}

                  <Button
                    className="w-100 mb-4 fw-bold py-2 shadow-sm"
                    variant="primary"
                    size="lg"
                    type="submit"
                  >
                    Log In
                  </Button>

                  <div className="text-center">
                    <span className="text-muted">
                      Already have an account?{" "}
                    </span>
                    <Link
                      to="/signup"
                      className="text-primary fw-bold text-decoration-none"
                    >
                      Sign up
                    </Link>
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
