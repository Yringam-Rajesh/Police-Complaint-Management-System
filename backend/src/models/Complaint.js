import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "SUBMITTED",
        "UNDER_REVIEW",
        "ASSIGNED",
        "INVESTIGATION",
        "NEED_MORE_INFORMATION",
        "RESOLVED",
        "CLOSED",
        "REJECTED"
      ],
      required: true
    },
    note: { type: String, trim: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    changedByRole: { type: String, required: true },
    changedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const assignmentSchema = new mongoose.Schema(
  {
    officer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedAt: { type: Date, default: Date.now },
    unassignedAt: Date
  },
  { _id: false }
);

const evidenceSchema = new mongoose.Schema(
  {
    fileName: String,
    fileType: String,
    fileUrl: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, unique: true, index: true },
    citizen: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    language: { type: String, required: true, trim: true },
    translatedDescription: { type: String, trim: true },
    incidentDateTime: { type: Date, required: true },
    incidentLocation: {
      city: { type: String, required: true, trim: true },
      area: { type: String, trim: true },
      address: { type: String, trim: true }
    },
    status: {
      type: String,
      enum: [
        "SUBMITTED",
        "UNDER_REVIEW",
        "ASSIGNED",
        "INVESTIGATION",
        "NEED_MORE_INFORMATION",
        "RESOLVED",
        "CLOSED",
        "REJECTED"
      ],
      default: "SUBMITTED",
      index: true
    },
    assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    assignmentHistory: [assignmentSchema],
    investigationNotes: [
      {
        note: String,
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        addedAt: { type: Date, default: Date.now }
      }
    ],
    evidence: [evidenceSchema],
    additionalInformation: { type: String, trim: true },
    additionalInformationHistory: [
      {
        information: String,
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        addedAt: { type: Date, default: Date.now }
      }
    ],
    statusHistory: [historySchema]
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
