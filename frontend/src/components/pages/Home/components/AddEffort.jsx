import React from "react";
import axios from "axios";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";

export default function AddEffort({
  auth,
  config,
  handleBack,
  setView,
  learningData,
}) {
  const [effortForm, setEffortForm] = useState({
    title: "",
    description: "",
    goal: "",
    author: auth?.user?.UserInfo?.id,
  });

  const handleEffortChange = (e) => {
    setEffortForm({ ...effortForm, [e.target.name]: e.target.value });
  };

  const handleEffortSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting New Goal:", effortForm);
    console.log(auth.token);

    axios
      .post(
        "http://localhost:5000/effortRecord/create",
        { ...effortForm },
        config,
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));

    setView("list");
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
          <h2 className="h4 mb-0 fw-bold text-dark">Add New Effort</h2>
        </div>

        <div className="card-body p-4 bg-light bg-opacity-10">
          <Form onSubmit={handleEffortSubmit}>
            <div className="row">
              <div className="col-md-8">
                <Form.Group className="mb-4" controlId="formEffortTitle">
                  <Form.Label className="fw-semibold text-secondary small text-uppercase ls-1">
                    Title
                  </Form.Label>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="e.g., Read documentation"
                    name="title"
                    value={effortForm.title}
                    onChange={handleEffortChange}
                    required
                    className="border-0 shadow-sm bg-white"
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formEffortDesc">
                  <Form.Label className="fw-semibold text-secondary small text-uppercase ls-1">
                    Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Describe the specific task..."
                    name="description"
                    value={effortForm.description}
                    onChange={handleEffortChange}
                    className="border-0 shadow-sm bg-white"
                    style={{ resize: "none" }}
                  />
                </Form.Group>
              </div>

              <div className="col-md-4">
                <Form.Group className="mb-4" controlId="formEffortGoal">
                  <Form.Label className="fw-semibold text-secondary small text-uppercase ls-1">
                    Linked Goal
                  </Form.Label>
                  <Form.Select
                    name="goal"
                    value={effortForm.goalId}
                    onChange={handleEffortChange}
                    className="border-0 shadow-sm bg-white"
                  >
                    <option value="">Select a Goal...</option>
                    {learningData.map((goal) => (
                      <option key={goal._id} value={goal._id}>
                        {goal.title}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted small mt-2 d-block">
                    Link this effort to an existing goal to track progress.
                  </Form.Text>
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
                Create Effort
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
