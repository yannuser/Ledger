import React from "react";
// import axios from "axios";
import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

import ListGroup from "react-bootstrap/ListGroup";
// { authorId }
export default function Home() {
  // const [learningData, setLearningData] = useState([]);
  // const [effortData, setEffortData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     console.log(authorId);
  //     if (authorId == null) {
  //       navigate("/");
  //       return;
  //     }
  //     try {
  //       await axios
  //         .get("http://localhost:5000/learningGoal/getByUser/", {
  //           params: { authorId },
  //         })
  //         .then((result) => {
  //           console.log("Goal res", result);
  //           if (result.status == 200) {
  //             setLearningData(result.data);
  //           }
  //         });

  //       await axios
  //         .get("http://localhost:5000/effortRecord/getByUser", {
  //           params: { userId: authorId },
  //         })
  //         .then((result) => {
  //           console.log("Effort res", result);
  //           if (result.status == 200) {
  //             setEffortData(result.data);
  //           }
  //         });
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //     setLoading(false);
  //   };

  //   fetchData();
  // }, [authorId, navigate]);
  
  return (
    <>
      {loading && <div>Loading</div>}
      {/* {!loading && (
        <div className="m-5">
          <div className="p-1">
          <div className="h2">Goals</div>
            <ListGroup>
              {learningData.map((item) => (
                <Link to={"/home/" + item._id} className="normal-text my-2">
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
            <div className="h2">Efforts</div>
            {effortData.map((item) => (
              <ListGroup>
                <ListGroup.Item className="d-flex justify-content-between align-items-start my-1 rounded">
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{item.title}</div>
                    {item.description || "No description"}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            ))}
          </div>
        </div>
      )} */}
    </>
  );
}
