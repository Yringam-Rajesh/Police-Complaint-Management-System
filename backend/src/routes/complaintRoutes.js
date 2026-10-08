import { Router } from "express";
import { body } from "express-validator";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createComplaint, getMyComplaints, getComplaintById, getAssignedComplaints, getAllComplaints,
  getOfficers, assignComplaint, updateStatus, getAnalytics, createOfficer,
  addAdditionalInformation, uploadEvidence
} from "../controllers/complaintController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();
const uploadDir = path.resolve("uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024, files: 5 },
  fileFilter: (_, file, cb) => cb(null, ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/quicktime"].includes(file.mimetype))
});

router.post("/", protect, authorize("CITIZEN"), [
  body("category").trim().notEmpty(), body("description").trim().isLength({ min: 10 }), body("language").trim().notEmpty(),
  body("incidentDateTime").notEmpty(), body("incidentLocation.city").trim().notEmpty()
], createComplaint);
router.get("/mine", protect, authorize("CITIZEN"), getMyComplaints);
router.get("/assigned", protect, authorize("POLICE_OFFICER"), getAssignedComplaints);
router.get("/all", protect, authorize("ADMIN"), getAllComplaints);
router.get("/officers", protect, authorize("ADMIN"), getOfficers);
router.get("/analytics", protect, authorize("ADMIN"), getAnalytics);
router.post("/officers", protect, authorize("ADMIN"), createOfficer);
router.patch("/:complaintId/assign", protect, authorize("ADMIN"), assignComplaint);
router.patch("/:complaintId/status", protect, authorize("POLICE_OFFICER", "ADMIN"), updateStatus);
router.patch("/:complaintId/additional-information", protect, authorize("CITIZEN"), addAdditionalInformation);
router.post("/:complaintId/evidence", protect, authorize("CITIZEN", "POLICE_OFFICER", "ADMIN"), upload.array("files", 5), uploadEvidence);
router.get("/:complaintId", protect, getComplaintById);

export default router;
