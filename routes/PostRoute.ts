import { Router } from "express";
import { tagPost, writePost } from "../controllers/Post";

const router = Router();

router.post("/write", writePost);
router.get("/tag/:tag", tagPost);

export default router;
