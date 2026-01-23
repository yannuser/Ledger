import express from "express";
import learningGoalControllers from "../controllers/learningGoalController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();
router.use(verifyJWT)

router.route("/").post(learningGoalControllers.createLearningGoal);
router.route("/update/:id").put(learningGoalControllers.updateLearningGoal);
router.route("/delete").delete(learningGoalControllers.deleteLearningGoal);
router.route("/getByUser").get(learningGoalControllers.getLearningGoalsByUser);
router.route("/getGoal").get(learningGoalControllers.getLearningGoal);


export default router;