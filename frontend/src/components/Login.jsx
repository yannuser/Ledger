import React from "react";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function Login({ handleUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      console.log("Login attempted with:", { email, password });
      // axios.get(URL, CONFIG_OBJECT)
      const response = axios
        .post("http://localhost:5000/auth/", {
          email: email,
          password: password,
        })
        .then((result) => {
          navigate("/home");
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
      const {accessToken} = response.data
      login(accessToken.token);
      handleUser(email, accessToken);
    }
  };

  return (
    <>
      <div className="form__wrapper">
        <Form onSubmit={handleSubmit} className="shadow p-4 bg-white rounded">
          <div className="h4 mb-2 text-center">Log In</div>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3X" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <Button className="w-100 mt-4" variant="primary" type="submit">
            Login
          </Button>
          <div className="d-grid justify-content-end">
            <Button className="text-muted px-0" variant="link">
              Forgot password?
            </Button>
          </div>
          <div className="d-grid justify-content-start">
            <Button className="text-muted px-0 py-3" variant="link">
              Already have an account? <Link to="/signup"> Sign up </Link>
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}
