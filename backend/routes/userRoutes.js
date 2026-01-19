import express from 'express';
import userControllers from "../controllers/userController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();
router.use(verifyJWT)

// router.post("/register", userControllers.registerUser);
router.post("/getLoggedInUser", userControllers.getLoggedInUser);
router.get("/getById/:id", userControllers.getUserById);
router.put("/update/:id", userControllers.updateUser);
router.delete("/delete/:id", userControllers.deleteUser);
// router.get("/getUsers", userControllers.getUsers);

export default router;