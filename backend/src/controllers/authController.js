import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import { generateCitizenId } from "../utils/generateId.js";

function tokenFor(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

export async function registerCitizen(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { fullName, dateOfBirth, mobileNumber, email, address, occupation, password, preferredLanguage } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email is already registered" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      citizenId: generateCitizenId(),
      fullName,
      dateOfBirth,
      mobileNumber,
      email: email.toLowerCase(),
      address,
      occupation,
      passwordHash,
      role: "CITIZEN",
      verificationStatus: "PENDING",
      preferredLanguage: ["English", "Telugu", "Hindi"].includes(preferredLanguage) ? preferredLanguage : "English"
    });

    res.status(201).json({
      message: "Citizen registered successfully",
      user: {
        id: user._id,
        citizenId: user.citizenId,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { identifier, password, secretCode } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password are required" });
    }

    const query = identifier.includes("@")
      ? { email: identifier.toLowerCase() }
      : {
          $or: [
            { citizenId: identifier },
            { employeeCode: identifier },
            { adminId: identifier }
          ]
        };

    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    if (user.role === "ADMIN") {
      if (!secretCode) return res.status(401).json({ message: "Admin secret code is required" });
      const secretValid = await bcrypt.compare(secretCode, user.secretVerificationHash);
      if (!secretValid) return res.status(401).json({ message: "Invalid admin verification code" });
    }

    user.lastLoginAt = new Date();
    await user.save();

    res.json({
      token: tokenFor(user),
      user: {
        id: user._id,
        citizenId: user.citizenId,
        employeeCode: user.employeeCode,
        adminId: user.adminId,
        fullName: user.fullName,
        role: user.role,
        department: user.department,
        preferredLanguage: user.preferredLanguage || "English"
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.json({ user: req.user });
}

export async function updatePreferredLanguage(req, res, next) {
  try {
    const { language } = req.body;
    if (!["English", "Telugu", "Hindi"].includes(language)) {
      return res.status(400).json({ message: "Unsupported language" });
    }
    await User.updateOne({ _id: req.user._id }, { $set: { preferredLanguage: language } });
    res.json({ message: "Language preference updated", user: { id: req.user._id, preferredLanguage: language } });
  } catch (error) { next(error); }
}
