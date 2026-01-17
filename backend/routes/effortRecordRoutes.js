import express from "express";
import effortRecordControllers from "../controllers/effortRecordController.js";

const router = express.Router();

router.post("/create",effortRecordControllers.createEffort);
router.put("/update/:id",effortRecordControllers.updateEffort);
router.delete("/delete/:id", effortRecordControllers.deleteEffort);
router.get("/getByUser", effortRecordControllers.getEffortsByUser);


export default router;