import express from 'express';
import userControllers from "../controllers/userControllers.js";

const router = express.Router();

router.post("/register", userControllers.registerUser);
router.get("/login/:emaili/:password", userControllers.loginUser);
router.post("/getLoggedInUser", userControllers.getLoggedInUser);
router.get("/getById/:id", userControllers.getUserById);
router.put("/update/:id", userControllers.updateUser);
router.delete("/delete/:id", userControllers.deleteUser);
// router.get("/getUsers", userControllers.getUsers);

export default router;