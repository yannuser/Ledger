import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home({ authorId }) {
  const [learningData, setLearningData] = useState([]);
  const [effortData, setEffortData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log(authorId);
      if (authorId == null) {
        navigate("/");
        return;
      }
      try {
        await axios
          .get("http://localhost:5000/LearningGoal/getByUser/", {
            params: { authorId },
          })
          .then((result) => {
            console.log("Goal res", result);
            if (result.status == 200) {
              setLearningData(result.data);
            }
          });

        await axios
          .get("http://localhost:5000/EffortRecord/getByUser", {
            params: { userId: authorId },
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
  }, [authorId]);

  return (
    <>
      {loading && <div>Loading</div>}
      {!loading && (
        <div>
          <div>
            <h2>Learning goals</h2>
            {learningData.map((item) => (
              <p>
                {item.title} : <span>{item.description}</span>
              </p>
            ))}
          </div>
          <div>
            <h2>Effort record</h2>
            {effortData.map((item) => (
              <p>
                {item.title} : <span>{item.description}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
