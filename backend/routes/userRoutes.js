import express from 'express';
import userControllers from "../controllers/userControllers.js"

const router = express.Router();

// const userControllers = require("../controllers/userControllers");

router.post("/register", userControllers.registerUser);
router.get("/login/:emaili/:password", userControllers.loginUser);
router.post("/getLoggedInUser", userControllers.getLoggedInUser);
router.get("/getUserById/:id", userControllers.getUserById);
router.put("/updateUser/:id", userControllers.updateUser);
router.delete("/deleteUser/:id", userControllers.deleteUser);
router.get("/getUsers", userControllers.getUsers);

export default router;