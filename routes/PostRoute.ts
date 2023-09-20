import { Router } from "express";
import { getPost, getPosts, tagPost, writePost } from "../controllers/Post";

const router = Router();

router.post("/write", writePost);
router.get("/tag/:tag", tagPost);
router.get("/post/:postId", getPost);
router.get("/posts", getPosts);

export default router;
