import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

import { ListGroup, Button, Form, Dropdown } from "react-bootstrap";
import { PlusCircle, ArrowLeft, Trash, ThreeDotsVertical } from "react-bootstrap-icons";

export default function Home() {
  const [learningData, setLearningData] = useState([]);
  const [effortData, setEffortData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [view, setView] = useState("list");
  const handleBack = () => setView("list");
  const [goalForm, setGoalForm] = useState({
    title: "",
    description: "",
    status: "ongoing",
    author: auth?.user?.UserInfo?.id,
    efforts: [],
  });
  const config = {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log(auth);
      if (!auth?.token) {
        navigate("/");
        return;
      }
      const id = auth?.user?.UserInfo?.id;
      try {
        await axios
          .get("http://localhost:5000/learningGoal/getByUser/", {
            params: { id },
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          })
          .then((result) => {
            console.log("Goal res", result);
            if (result.status == 200) {
              setLearningData(result.data);
            }
          });

        await axios
          .get("http://localhost:5000/effortRecord/getByUser", {
            params: { userId: id },
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          })
          .then((result) => {
            console.log("Effort res", result);
            if (result.status == 200) {
              setEffortData(result.data);
            }
          });
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, [auth.token]);

  const handleGoalChange = (e) => {
    setGoalForm({ ...goalForm, [e.target.name]: e.target.value });
  };

  const handleEffortToggle = (effortId) => {
    const isSelected = goalForm.efforts.includes(effortId);
    if (isSelected) {
      setGoalForm({
        ...goalForm,
        efforts: goalForm.efforts.filter((id) => id !== effortId),
      });
    } else {
      setGoalForm({
        ...goalForm,
        efforts: [...goalForm.efforts, effortId],
      });
    }
  };

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting New Goal:", goalForm);
    console.log(auth.token);

    axios
      .post(
        "http://localhost:5000/learningGoal",
        {
          ...goalForm,
        },
        config,
      )
      .then((result) => {
        console.log(result);
        const newGoalFromDB = result.data.learningGoal;

        // Add new goals to my existing list immediately
        setLearningData((prevGoals) => [...prevGoals, newGoalFromDB]);
      })
      .catch((err) => console.log(err));

    setView("list");
  };

  if (view === "add-goal") {
    return (
      <div className="container py-5">
        <Button
          variant="link"
          onClick={handleBack}
          className="mb-4 text-decoration-none text-secondary p-0 fw-bold"
        >
          <ArrowLeft className="me-2" size={20} /> Back to Dashboard
        </Button>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="card-header bg-white border-bottom p-4">
            <h2 className="h4 mb-0 fw-bold text-dark">Add New Goal</h2>
          </div>
          <div className="card-body p-4 bg-light bg-opacity-10">
            <Form onSubmit={handleGoalSubmit}>
              <div className="row">
                <div className="col-md-8">
                  <Form.Group className="mb-4" controlId="formGoalTitle">
                    <Form.Label className="fw-semibold text-secondary small text-uppercase ls-1">
                      Title
                    </Form.Label>
                    <Form.Control
                      size="lg"
                      type="text"
                      placeholder="e.g., Learn React Native"
                      name="title"
                      value={goalForm.title}
                      onChange={handleGoalChange}
                      required
                      className="border-0 shadow-sm bg-white"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formGoalDesc">
                    <Form.Label className="fw-semibold text-secondary small text-uppercase ls-1">
                      Description
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="What do you want to achieve?"
                      name="description"
                      value={goalForm.description}
                      onChange={handleGoalChange}
                      className="border-0 shadow-sm bg-white"
                      style={{ resize: "none" }}
                    />
                  </Form.Group>
                </div>

                <div className="col-md-4">
                  <Form.Group className="mb-4" controlId="formGoalStatus">
                    <Form.Label className="fw-semibold text-secondary small text-uppercase ls-1">
                      Status
                    </Form.Label>
                    <Form.Select
                      name="status"
                      value={goalForm.status}
                      onChange={handleGoalChange}
                      className="border-0 shadow-sm bg-white mb-3"
                    >
                      <option value="ongoing">Ongoing</option>
                      <option value="paused">Paused</option>
                      <option value="finished">Finished</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formGoalEfforts">
                    <Form.Label className="fw-semibold text-secondary small text-uppercase ls-1">
                      Attach Efforts
                    </Form.Label>
                    <div
                      className="border-0 shadow-sm rounded bg-white p-3"
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      {effortData.length > 0 ? (
                        effortData.map((effort) => (
                          <Form.Check
                            key={effort._id || effort.title}
                            type="checkbox"
                            id={`check-${effort.title}`}
                            label={effort.title}
                            checked={goalForm.efforts.includes(effort._id)}
                            onChange={() => handleEffortToggle(effort._id)}
                            className="mb-2"
                          />
                        ))
                      ) : (
                        <div className="text-muted small text-center py-3">
                          No efforts available to link.
                        </div>
                      )}
                    </div>
                  </Form.Group>
                </div>
              </div>

              <div className="d-flex justify-content-end pt-3 border-top">
                <Button
                  variant="light"
                  onClick={handleBack}
                  className="me-3 px-4 fw-semibold text-secondary"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="px-4 fw-semibold shadow-sm"
                >
                  Create Goal
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }

  if (view === "add-effort") {
    return (
      <div className="container py-5">
        <Button
          variant="link"
          onClick={handleBack}
          className="mb-4 text-decoration-none text-secondary p-0 fw-bold"
        >
          <ArrowLeft className="me-2" size={20} /> Back to Dashboard
        </Button>
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <h2 className="h4 mb-3 fw-bold">Add New Effort</h2>
            {/* INSERT YOUR EFFORT FORM COMPONENT HERE */}
            <p className="text-muted">
              Form inputs for a new effort go here...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:5000/learningGoal/delete", {
        ...config,
        data: { id },
      })
      .then((res) => {
        console.log(res);
        const updated = learningData.filter((item) => item._id != id);
        setLearningData(updated);
      })
      .catch((err) => {
        // alert("An error occurred")
        console.log(err);
      });
  };

  return (
    <>
      {loading && (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!loading && (
        <div className="container py-5">
          <div className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h2 className="h3 fw-bold text-dark mb-0">Goals</h2>
              <Button
                variant="primary"
                size="sm"
                className="rounded-pill px-3 shadow-sm d-flex align-items-center gap-2"
                onClick={() => setView("add-goal")}
              >
                <PlusCircle size={18} />
                <span>Add Goal</span>
              </Button>
            </div>

            <div className="row g-3">
              {learningData.map((item) => (
                <div className="col-12" key={item._id}>
                  <div className="card border-0 shadow-sm rounded-3 hover-shadow transition-all">
                    <div className="card-body d-flex align-items-center justify-content-between p-4">
                      <div className="d-flex flex-column">
                        <h5 className="fw-bold text-dark mb-1">{item.title}</h5>
                        <p className="text-muted mb-0 small">
                          {item.description || "No description provided."}
                        </p>
                      </div>

                      <Dropdown align="end">
                        <Dropdown.Toggle
                          variant="light"
                          className="btn-icon rounded-circle p-2 border-0 bg-transparent text-secondary"
                          id={`dropdown-${item._id}`}
                        >
                          <ThreeDotsVertical size={20} />
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="border-0 shadow rounded-3 p-2">
                          <Dropdown.Item
                            as={Link}
                            to={"/home/" + item._id}
                            className="rounded-2 py-2 mb-1"
                          >
                            See details
                          </Dropdown.Item>
                          <Dropdown.Item className="rounded-2 py-2 mb-1">
                            Modify
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item
                            onClick={() => handleDelete(item._id)}
                            className="text-danger rounded-2 py-2 fw-semibold"
                          >
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h2 className="h3 fw-bold text-dark mb-0">Efforts</h2>
              <Button
                variant="outline-primary"
                size="sm"
                className="rounded-pill px-3 d-flex align-items-center gap-2"
                onClick={() => setView("add-effort")}
              >
                <PlusCircle size={18} />
                <span>Add Effort</span>
              </Button>
            </div>

            <div className="row g-3">
              {effortData.map((item) => (
                <div className="col-md-6 col-lg-4" key={item._id || item.title}>
                  <div className="card h-100 border-0 shadow-sm rounded-3">
                    <div className="card-body p-4">
                      <h6 className="fw-bold mb-2">{item.title}</h6>
                      <p className="text-muted small mb-0 line-clamp-2">
                        {item.description || "No description provided."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
