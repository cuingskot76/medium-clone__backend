import { refreshToken } from "./../controllers/RefreshToken";
import { verifyToken } from "./../middleware/VerifyToken";
import express from "express";
import {
  createUser,
  getUsers,
  loginUser,
  logoutUser,
} from "../controllers/Users";

const router = express.Router();

router.post("/users/register", createUser);
router.post("/users/login", loginUser);

router.get("/users", verifyToken, getUsers);
router.get("/token", refreshToken);
router.get("/logout", logoutUser);

export default router;
