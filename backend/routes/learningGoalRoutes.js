import express from "express";
import learningGoalControllers from "../controllers/learningGoalControllers.js";

const router = express.Router();

router.post("/createLearningGoal",learningGoalControllers.createLearningGoal);
router.update("/updateLearningGoal/:id",learningGoalControllers.updateLearningGoal);
router.delete("/deleteLearningGoal/:id", learningGoalControllers.deleteLearningGoal);
router.get("/getAllLearningGoal", learningGoalControllers.getAllLearningGoal);


export default router;