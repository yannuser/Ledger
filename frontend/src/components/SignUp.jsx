import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function SignUp() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    return newErrors;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    validateForm();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      console.log("Sign up attempted with:", {
        firstname,
        lastname,
        dateOfBirth,
        email,
        password,
      });
      // Here you would typically send a request to your server
    }

    axios
      .post("http://localhost:5000/User/register", {
        firstname,
        lastname,
        dateOfBirth,
        email,
        password,
      })
      .then((result) => {
        console.log(result);
        if (result.status == 201) {
          navigate("/");
        } else {
          alert("An error occurred!!!");
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <div className="form__wrapper">
        <div className="form__wrapper">
          <Form onSubmit={handleSubmit} className="shadow p-4 bg-white rounded">
            <div className="h4 mb-2 text-center">Sign up</div>
            <div className="row">
              <Form.Group className="mb-3 col" controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  // isInvalid={!!errors.email}
                />
                {/* <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback> */}
              </Form.Group>

              <Form.Group className="mb-3 col" controlId="formBasicLastName">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  // isInvalid={!!errors.email}
                />
                {/* <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback> */}
              </Form.Group>
            </div>

            <div className="row">
              <Form.Group className="mb-3 col" controlId="formBasicEmail">
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

              <Form.Group className="mb-3 col" controlId="formBasicDate">
                <Form.Label>Birthdate</Form.Label>
                <Form.Control
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  // isInvalid={!!errors.email}
                />
                {/* <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback> */}
              </Form.Group>
            </div>

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
              Sign up
            </Button>

            <div className="d-grid justify-content-start">
              <Button className="text-muted px-0 py-3" variant="link">
                Don't have an account? <Link to="/"> Log in </Link>
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
