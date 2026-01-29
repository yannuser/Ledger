import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../AuthContext";

import { Button, Dropdown } from "react-bootstrap";
import { PlusCircle, ThreeDotsVertical } from "react-bootstrap-icons";
import LogNavbar from "../../LogNavbar";
import AddGoal from "./components/AddGoal";
import AddEffort from "./components/AddEffort";

export default function Home() {
  const [learningData, setLearningData] = useState([]);
  const [effortData, setEffortData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [view, setView] = useState("list");

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
  }, [auth, navigate]);

  const handleBack = () => setView("list");

  const handleDelete = (id, action) => {
    const goalDelete = "http://localhost:5000/learningGoal/delete";
    const effortDelete = "http://localhost:5000/effortRecord/delete";
    const link = action == "goal" ? goalDelete : effortDelete;

    axios
      .delete(link, {
        ...config,
        data: { id },
      })
      .then((res) => {
        console.log(res);
        if (action == "goal") {
          const updated = learningData.filter((item) => item._id != id);
          setLearningData(updated);
        } else {
          const updated = effortData.filter((item) => item._id != id);
          setEffortData(updated);
        }
      })
      .catch((err) => {
        // alert("An error occurred")
        console.log(err);
      });
  };

  if (view == "add-goal") {
    return (
      <AddGoal
        auth={auth}
        handleBack={handleBack}
        effortData={effortData}
        config={config}
        setView={setView}
        setLearningData={setLearningData}
      />
    );
  } else if (view === "add-effort") {
    return (
      <AddEffort
        auth={auth}
        handleBack={handleBack}
        config={config}
        setView={setView}
        learningData={learningData}
      />
    );
  }

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
        <>
          <LogNavbar />
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
                          <h5 className="fw-bold text-dark mb-1">
                            {item.title}
                          </h5>
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
                              onClick={() => handleDelete(item._id, "goal")}
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
                  <div
                    className="col-md-6 col-lg-4"
                    key={item._id || item.title}
                  >
                    <div className="card h-100 border-0 shadow-sm rounded-3">
                      <div className="card-body p-4">
                        <h6 className="fw-bold mb-2">{item.title}</h6>
                        <p className="text-muted small mb-0 line-clamp-2">
                          {item.description || "No description provided."}
                        </p>
                        <Dropdown align="end">
                          <Dropdown.Toggle
                            variant="light"
                            className="btn-icon rounded-circle p-2 border-0 bg-transparent text-secondary"
                            id={`dropdown-${item._id}`}
                          >
                            <ThreeDotsVertical size={20} />
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="border-0 shadow rounded-3 p-2">
                            <Dropdown.Item className="rounded-2 py-2 mb-1">
                              Modify
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() => handleDelete(item._id, "effort")}
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
          </div>
        </>
      )}
    </>
  );
}
