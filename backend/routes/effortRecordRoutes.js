import express from "express";
import learningGoalControllers from "../controllers/effortRecordControllers.js";

const router = express.Router();

router.post("/create",learningGoalControllers.createEffort);
router.put("/update/:id",learningGoalControllers.updateEffort);
router.delete("/delete/:id", learningGoalControllers.deleteEffort);
router.get("/getByUser", learningGoalControllers.getEffortsByUser);


export default router;