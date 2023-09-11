import { refreshToken } from "./../controllers/RefreshToken";
import { verifyToken } from "./../middleware/VerifyToken";
import express from "express";
import {
  createUser,
  getMyProfileAbout,
  getMyProfileMembership,
  getMyProfileNotifications,
  getMyProfilePost,
  getMyProfilePublishing,
  getMyProfileSecurity,
  getMyProfileSettings,
  getUsers,
  loginUser,
  logoutUser,
} from "../controllers/Users";

const router = express.Router();

// AUTH
router.post("/users/register", createUser);
router.post("/users/login", loginUser);
router.get("/logout", logoutUser);
router.get("/token", refreshToken);

// get all users profile
router.get("/users/:username", getUsers);

// ME
// get my profile after successful login
router.get("/@:username", verifyToken, getMyProfilePost);
// get my profile ABOUT after successful login
router.get("/@:username/about", verifyToken, getMyProfileAbout);

// SETTINGS
router.get("/@:username/settings/account", verifyToken, getMyProfileSettings);
// router.get("/me/settings/publishing", verifyToken, getMyProfilePublishing);
// router.get(
//   "/me/settings/notifications",
//   verifyToken,
//   getMyProfileNotifications
// );
// router.get("/me/settings/membership", verifyToken, getMyProfileMembership);
// router.get("/me/settings/security", verifyToken, getMyProfileSecurity);

export default router;
