import React from "react";
import axios from "axios";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";

export default function AddGoal({
  auth,
  handleBack,
  effortData,
  config,
  setView,
  setLearningData,
}) {
  const [goalForm, setGoalForm] = useState({
    title: "",
    description: "",
    status: "ongoing",
    author: auth?.user?.UserInfo?.id,
    efforts: [],
  });

  const handleGoalChange = (e) => {
    setGoalForm({ ...goalForm, [e.target.name]: e.target.value });
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
                      effortData
                        .filter((effort) => !effort.goal)
                        .map((effort) => (
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
