import express from "express";
import { createUser } from "../controllers/Users";

const router = express.Router();

router.post("/users/register", createUser);

export default router;
