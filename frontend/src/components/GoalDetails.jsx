import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Card, ListGroup, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";

export default function GoalDetails() {
  const { goalId } = useParams();
  const [goal, setGoal] = useState({});
  const { auth } = useAuth();
  const navigate = useNavigate();
  console.log("Goal id", goalId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get("http://localhost:5000/learningGoal/getGoal", {
            params: { id: goalId },
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          })
          .then((result) => {
            console.log(result.data);
            setGoal(result.data);
          });
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [auth.token, goalId]);

  return (
    <div className="container py-5">
      <Button
        variant="link"
        onClick={() => navigate("/home")}
        className="mb-4 text-decoration-none text-secondary p-0 fw-bold"
      >
        <ArrowLeft className="me-2" size={20} /> Back to Dashboard
      </Button>
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-5">
          <div className="mb-4 pb-3 border-bottom">
            <h6 className="fw-bold text-uppercase text-primary small ls-1 mb-2">
              Goal Title
            </h6>
            <Card.Title as="h2" className="display-6 fw-bold text-dark mb-0">
              {goal.title}
            </Card.Title>
          </div>

          <div className="mb-5">
            <h6 className="fw-bold text-uppercase text-secondary small ls-1 mb-2">
              Description
            </h6>
            <Card.Text className="fs-5 text-muted lh-base">
              {goal.description || "No description"}
            </Card.Text>
          </div>

          <div>
            <h6 className="fw-bold text-uppercase text-secondary small ls-1 mb-3">
              Efforts
            </h6>
            <ListGroup as="ol" numbered variant="flush">
              {goal?.efforts > 0 ? (
                goal.efforts.map((effort, index) => (
                  <ListGroup.Item
                    as="li"
                    key={index}
                    className="bg-light border-0 mb-2 rounded-3 px-4 py-3 text-dark fw-medium d-flex align-items-center"
                  >
                    <div className="ms-2">{effort.title}</div>
                  </ListGroup.Item>
                ))
              ) : (
                <h6 className="fw-bold text-uppercase text-secondary small ls-1 mb-2 ps-4 ">
                  No effort linked to this one
                </h6>
              )}
            </ListGroup>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
