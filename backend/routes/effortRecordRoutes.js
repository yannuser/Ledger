import express from "express";
import effortRecordControllers from "../controllers/effortRecordController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();
router.use(verifyJWT)

router.post("/create",effortRecordControllers.createEffort);
router.put("/update/:id",effortRecordControllers.updateEffort);
router.delete("/delete/", effortRecordControllers.deleteEffort);
router.get("/getByUser", effortRecordControllers.getEffortsByUser);


export default router;