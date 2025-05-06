import express from "express";
import {register, isVerified, login} from "../controllers/user.controller.js"
const router = express.Router();

router.post('/register',register);
router.get('/isVerified', isVerified);
router.post('/login', login);


export default router;