import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";

export default function GoalDetails() {
  const { goalId } = useParams();
  const [goal, setGoal] = useState({});
  const [efforts, setEfforts] = useState([]);
  const { auth } = useAuth();
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
            console.log(result.data.efforts);
            setEfforts(result.data.efforts);
            setGoal(result.data);
          });
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, [auth.token, goalId]);

  return (
    <>
      <h2>TITLE: {goal.title}</h2>
      <h3>DESCRIPTION: {goal.description || "No description"}</h3>
      <h4>EFFORTS</h4>
      <ol>
        {efforts.length > 0 && efforts.map((effort) => <li>{effort}</li>)}
      </ol>
    </>
  );
}
