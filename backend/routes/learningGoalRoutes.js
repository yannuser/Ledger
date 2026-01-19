import express from "express";
import learningGoalControllers from "../controllers/learningGoalController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();
router.use(verifyJWT)

router.post("/create",learningGoalControllers.createLearningGoal);
router.put("/update/:id",learningGoalControllers.updateLearningGoal);
router.delete("/delete/:id", learningGoalControllers.deleteLearningGoal);
router.get("/getByUser", learningGoalControllers.getLearningGoalsByUser);
router.get("/getGoal", learningGoalControllers.getLearningGoal);


export default router;