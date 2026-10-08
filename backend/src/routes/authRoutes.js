import { Router } from "express";
import { body } from "express-validator";
import { login, me, registerCitizen, updatePreferredLanguage } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post(
  "/register",
  [
    body("fullName").trim().isLength({ min: 2 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("mobileNumber").trim().isLength({ min: 10 })
  ],
  registerCitizen
);

router.post("/login", login);
router.get("/me", protect, me);
router.patch("/language", protect, updatePreferredLanguage);

export default router;
