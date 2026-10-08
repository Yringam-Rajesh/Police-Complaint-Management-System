import bcrypt from "bcryptjs";
import User from "./models/User.js";

export async function seedAdmin() {
  if (!process.env.ADMIN_ID || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_SECRET_CODE) {
    return;
  }

  const existing = await User.findOne({ adminId: process.env.ADMIN_ID });
  if (existing) return;

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
  const secretVerificationHash = await bcrypt.hash(process.env.ADMIN_SECRET_CODE, 12);

  await User.create({
    adminId: process.env.ADMIN_ID,
    fullName: "System Administrator",
    department: "Police Department",
    passwordHash,
    secretVerificationHash,
    role: "ADMIN",
    accountStatus: "ACTIVE",
    verificationStatus: "VERIFIED"
  });

  console.log(`Demo admin created: ${process.env.ADMIN_ID}`);
}
