import { validationResult } from "express-validator";
import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import { generateComplaintId } from "../utils/generateId.js";
import { translateToEnglish } from "../utils/translateText.js";

const citizenFields = "fullName citizenId mobileNumber email";
const officerFields = "fullName employeeCode rank policeStation mobileNumber email department";

async function canAccessComplaint(complaint, user) {
  const owner = complaint.citizen?._id?.toString?.() === user._id.toString();
  const assigned = complaint.assignedOfficer?._id?.toString?.() === user._id.toString();
  return user.role === "ADMIN" || owner || assigned;
}

export async function createComplaint(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { category, description, language, translatedDescription, incidentDateTime, incidentLocation } = req.body;
    const englishTranslation = await translateToEnglish(description, language);
    const complaint = await Complaint.create({
      complaintId: generateComplaintId(), citizen: req.user._id, category, description,
      language, translatedDescription: translatedDescription || englishTranslation,
      incidentDateTime, incidentLocation, status: "SUBMITTED",
      statusHistory: [{ status: "SUBMITTED", note: "Complaint submitted by citizen", changedBy: req.user._id, changedByRole: req.user.role }]
    });
    res.status(201).json({ message: "Complaint submitted successfully", complaint });
  } catch (error) { next(error); }
}

export async function getMyComplaints(req, res, next) {
  try {
    const complaints = await Complaint.find({ citizen: req.user._id })
      .populate("assignedOfficer", officerFields).sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (error) { next(error); }
}

export async function getComplaintById(req, res, next) {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId })
      .populate("citizen", citizenFields)
      .populate("assignedOfficer", officerFields)
      .populate("statusHistory.changedBy", "fullName role")
      .populate("investigationNotes.addedBy", "fullName role")
      .populate("additionalInformationHistory.addedBy", "fullName role");
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    if (!(await canAccessComplaint(complaint, req.user))) return res.status(403).json({ message: "Access denied" });
    res.json({ complaint });
  } catch (error) { next(error); }
}

export async function getAssignedComplaints(req, res, next) {
  try {
    const complaints = await Complaint.find({ assignedOfficer: req.user._id })
      .populate("citizen", citizenFields).populate("assignedOfficer", officerFields).sort({ updatedAt: -1 });
    res.json({ complaints });
  } catch (error) { next(error); }
}

export async function getAllComplaints(req, res, next) {
  try {
    const complaints = await Complaint.find()
      .populate("citizen", citizenFields).populate("assignedOfficer", officerFields).sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (error) { next(error); }
}

export async function getOfficers(req, res, next) {
  try {
    const officers = await User.find({ role: "POLICE_OFFICER", accountStatus: "ACTIVE" }).select("-passwordHash -secretVerificationHash");
    const result = await Promise.all(officers.map(async officer => {
      const activeCount = await Complaint.countDocuments({ assignedOfficer: officer._id, status: { $in: ["ASSIGNED", "INVESTIGATION", "NEED_MORE_INFORMATION"] } });
      return { ...officer.toObject(), activeComplaintCount: activeCount };
    }));
    res.json({ officers: result });
  } catch (error) { next(error); }
}

export async function assignComplaint(req, res, next) {
  try {
    const { officerId } = req.body;
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });
    const officer = await User.findOne({ _id: officerId, role: "POLICE_OFFICER", accountStatus: "ACTIVE" });
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    if (!officer) return res.status(404).json({ message: "Officer not found" });
    const activeCount = await Complaint.countDocuments({ assignedOfficer: officer._id, status: { $in: ["ASSIGNED", "INVESTIGATION", "NEED_MORE_INFORMATION"] } });
    if (activeCount >= 5) return res.status(409).json({ message: "Officer has reached the active complaint limit of 5" });
    if (complaint.assignedOfficer) complaint.assignmentHistory.push({ officer: complaint.assignedOfficer, assignedBy: req.user._id, assignedAt: complaint.updatedAt, unassignedAt: new Date() });
    complaint.assignedOfficer = officer._id;
    complaint.assignmentHistory.push({ officer: officer._id, assignedBy: req.user._id, assignedAt: new Date() });
    complaint.status = "ASSIGNED";
    complaint.statusHistory.push({ status: "ASSIGNED", note: `Assigned to ${officer.fullName}`, changedBy: req.user._id, changedByRole: req.user.role });
    await complaint.save();
    res.json({ message: "Complaint assigned successfully", complaint });
  } catch (error) { next(error); }
}

export async function updateStatus(req, res, next) {
  try {
    const { status, note } = req.body;
    const allowed = ["UNDER_REVIEW", "INVESTIGATION", "NEED_MORE_INFORMATION", "RESOLVED", "CLOSED", "REJECTED"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    if (req.user.role === "POLICE_OFFICER" && complaint.assignedOfficer?.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Complaint is not assigned to you" });
    complaint.status = status;
    complaint.statusHistory.push({ status, note: note || "", changedBy: req.user._id, changedByRole: req.user.role });
    if (note && req.user.role === "POLICE_OFFICER") complaint.investigationNotes.push({ note, addedBy: req.user._id });
    await complaint.save();
    res.json({ message: "Complaint status updated", complaint });
  } catch (error) { next(error); }
}

export async function addAdditionalInformation(req, res, next) {
  try {
    const { information } = req.body;
    if (!information?.trim()) return res.status(400).json({ message: "Additional information is required" });
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId, citizen: req.user._id });
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    if (complaint.status !== "NEED_MORE_INFORMATION") return res.status(400).json({ message: "The police have not requested more information" });
    complaint.additionalInformation = information.trim();
    complaint.additionalInformationHistory.push({ information: information.trim(), addedBy: req.user._id });
    complaint.statusHistory.push({ status: "UNDER_REVIEW", note: "Citizen submitted the requested additional information", changedBy: req.user._id, changedByRole: req.user.role });
    complaint.status = "UNDER_REVIEW";
    await complaint.save();
    res.json({ message: "Additional information submitted successfully", complaint });
  } catch (error) { next(error); }
}

export async function uploadEvidence(req, res, next) {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId }).populate("assignedOfficer", officerFields);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    const owner = complaint.citizen.toString() === req.user._id.toString();
    const assigned = complaint.assignedOfficer?._id?.toString() === req.user._id.toString();
    if (req.user.role !== "ADMIN" && !owner && !assigned) return res.status(403).json({ message: "Access denied" });
    if (!req.files?.length) return res.status(400).json({ message: "Please select at least one image or video" });
    const items = req.files.map(file => ({ fileName: file.originalname, fileType: file.mimetype, fileUrl: `/uploads/${file.filename}`, uploadedBy: req.user._id }));
    complaint.evidence.push(...items);
    await complaint.save();
    res.status(201).json({ message: "Evidence uploaded successfully", evidence: complaint.evidence });
  } catch (error) { next(error); }
}

export async function getAnalytics(req, res, next) {
  try {
    const [total, submitted, assigned, investigation, resolved, closed] = await Promise.all([
      Complaint.countDocuments(), Complaint.countDocuments({ status: "SUBMITTED" }), Complaint.countDocuments({ status: "ASSIGNED" }), Complaint.countDocuments({ status: "INVESTIGATION" }), Complaint.countDocuments({ status: "RESOLVED" }), Complaint.countDocuments({ status: "CLOSED" })
    ]);
    res.json({ analytics: { total, submitted, assigned, investigation, resolved, closed } });
  } catch (error) { next(error); }
}

export async function createOfficer(req, res, next) {
  try {
    const { employeeCode, fullName, rank, department, policeStation, mobileNumber, email, password } = req.body;
    if (!employeeCode || !fullName || !password) return res.status(400).json({ message: "Employee code, name and password are required" });
    const exists = await User.findOne({ $or: [{ employeeCode }, ...(email ? [{ email: email.toLowerCase() }] : [])] });
    if (exists) return res.status(409).json({ message: "Officer already exists" });
    const bcrypt = (await import("bcryptjs")).default;
    const passwordHash = await bcrypt.hash(password, 12);
    const officer = await User.create({ employeeCode, fullName, rank, department, policeStation, mobileNumber, email: email?.toLowerCase(), passwordHash, role: "POLICE_OFFICER", accountStatus: "ACTIVE" });
    res.status(201).json({ message: "Police officer created successfully", officer: { id: officer._id, employeeCode: officer.employeeCode, fullName: officer.fullName, role: officer.role, rank: officer.rank, policeStation: officer.policeStation } });
  } catch (error) { next(error); }
}
