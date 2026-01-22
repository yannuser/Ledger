import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

import { ListGroup, Button, Form } from "react-bootstrap";
import { PlusCircle, ArrowLeft } from "react-bootstrap-icons";

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
    const config = {
      headers: {
        Authorization: `Bearer ${auth.token}`, 
      },
    };

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
      <div className="m-5">
        <Button
          variant="outline-secondary"
          onClick={handleBack}
          className="mb-3"
        >
          <ArrowLeft className="me-2" /> Back to Dashboard
        </Button>

        <div className="p-4 border rounded shadow-sm bg-white">
          <h2 className="mb-4">Add New Goal</h2>

          <Form onSubmit={handleGoalSubmit}>
            <Form.Group className="mb-3" controlId="formGoalTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Learn React Native"
                name="title"
                value={goalForm.title}
                onChange={handleGoalChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGoalDesc">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="What do you want to achieve?"
                name="description"
                value={goalForm.description}
                onChange={handleGoalChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGoalStatus">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={goalForm.status}
                onChange={handleGoalChange}
              >
                <option value="ongoing">Ongoing</option>
                <option value="paused">Paused</option>
                <option value="finished">Finished</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formGoalEfforts">
              <Form.Label>Attach Efforts</Form.Label>
              <div
                className="border rounded p-2"
                style={{ maxHeight: "200px", overflowY: "auto" }}
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
                  <div className="text-muted small">
                    No efforts available to link.
                  </div>
                )}
              </div>
              <Form.Text className="text-muted">
                Select existing efforts to link to this goal.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleBack} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Goal
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }

  if (view === "add-effort") {
    return (
      <div className="m-5">
        <Button
          variant="outline-secondary"
          onClick={handleBack}
          className="mb-3"
        >
          <ArrowLeft className="me-2" /> Back to Dashboard
        </Button>
        <div className="p-3 border rounded">
          <h2>Add New Effort</h2>
          {/* INSERT YOUR EFFORT FORM COMPONENT HERE */}
          <p>Form inputs for a new effort go here...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      {loading && <div>Loading</div>}
      {!loading && (
        <div className="m-5">
          <div className="p-1">
            <div className="d-flex align-items-center mb-2">
              <div className="h2 me-3 mb-0">Goals</div>
              <PlusCircle
                size={24}
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => setView("add-goal")}
                title="Add new Goal"
              />
            </div>

            <ListGroup>
              {learningData.map((item) => (
                <Link
                  to={"/home/" + item._id}
                  className="normal-text my-2"
                  key={item._id}
                >
                  <ListGroup.Item className="d-flex justify-content-between align-items-start my-1 rounded">
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{item.title}</div>
                      {item.description || "No description"}
                    </div>
                  </ListGroup.Item>
                </Link>
              ))}
            </ListGroup>
          </div>

          <div className="mt-5 p-1">
            <div className="d-flex align-items-center mb-2">
              <div className="h2 me-3 mb-0">Efforts</div>
              <PlusCircle
                size={24}
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => setView("add-effort")}
                title="Add new Effort"
              />
            </div>

            <ListGroup>
              {effortData.map((item) => (
                <ListGroup.Item
                  key={item._id || item.title}
                  className="d-flex justify-content-between align-items-start my-1 rounded"
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{item.title}</div>
                    {item.description || "No description"}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      )}
    </>
  );
}
