import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function GoalDetails() {
  const { goalId } = useParams();
  const [goal, setGoal] = useState({});
  console.log("Goal id", goalId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get("http://localhost:5000/LearningGoal/getGoal", {
            params: { id: goalId },
          })
          .then((result) => {
            console.log(result);
            setGoal(result.data);
          });
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <h2>Show me what you got: {goal.title}</h2>
      <h3>Show me what you got: {goal.description}</h3>
    </>
  );
}
