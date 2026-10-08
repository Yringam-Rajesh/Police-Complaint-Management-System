import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    citizenId: { type: String, unique: true, sparse: true },
    employeeCode: { type: String, unique: true, sparse: true },
    adminId: { type: String, unique: true, sparse: true },
    fullName: { type: String, required: true, trim: true },
    dateOfBirth: Date,
    mobileNumber: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    address: { type: String, trim: true },
    occupation: { type: String, trim: true },
    rank: { type: String, trim: true },
    department: { type: String, trim: true },
    policeStation: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["CITIZEN", "POLICE_OFFICER", "ADMIN"],
      required: true
    },
    accountStatus: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE"
    },
    verificationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED"],
      default: "PENDING"
    },
    secretVerificationHash: String,
    preferredLanguage: { type: String, enum: ["English", "Telugu", "Hindi"], default: "English" },
    lastLoginAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
