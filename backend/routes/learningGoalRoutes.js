import express from "express";
import learningGoalControllers from "../controllers/learningGoalControllers.js";

const router = express.Router();

router.post("/create",learningGoalControllers.createLearningGoal);
router.update("/update/:id",learningGoalControllers.updateLearningGoal);
router.delete("/delete/:id", learningGoalControllers.deleteLearningGoal);
router.get("/getByUser", learningGoalControllers.getLearningGoalsByUser);


export default router;