import express from "express";
import authController from "../controllers/authController.js";
import loginLimiter from '../middleware/loginLimiter.js'

const router = express.Router();

router.route('/').post(loginLimiter, authController.login)

router.route('/refresh').get(authController.refresh)

router.route('/logout').post(authController.logout)

router.route('/register').post(authController.register)

export default router