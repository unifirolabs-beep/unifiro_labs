"use server";

import { connectToDatabase } from "@/lib/db";
import { Admin } from "@/models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "unifirolabs-super-secret-jwt-key-2026";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function seedAdminIfNoneExists() {
  try {
    await connectToDatabase();
    const count = await Admin.countDocuments();
    if (count === 0) {
      const defaultEmail = process.env.ADMIN_EMAIL;
      const defaultPass = process.env.ADMIN_PASSWORD;
      if (!defaultEmail || !defaultPass) {
        throw new Error("Default admin credentials not found in environment variables");
      }
      const hashedPassword = await bcrypt.hash(defaultPass, 10);
      await Admin.create({
        email: defaultEmail,
        password: hashedPassword,
      });
      console.log(`Default admin created: ${defaultEmail} / ${defaultPass}`);
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
}

export async function loginAdminAction(formData: unknown) {
  try {
    await connectToDatabase();
    await seedAdminIfNoneExists();

    const parsed = loginSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const { email, password } = parsed.data;

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return { success: false, error: "Invalid email or password" };
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return { success: false, error: "Invalid email or password" };
    }

    const token = jwt.sign(
      { adminId: admin._id, email: admin.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });

    return { success: true, message: "Logged in successfully" };
  } catch (error: any) {
    console.error("loginAdminAction error:", error);
    return { success: false, error: error.message || "Failed to log in" };
  }
}

export async function logoutAdminAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_token");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Logout failed" };
  }
}

export async function checkAdminAuthAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return { isAuthenticated: false };

    const decoded = jwt.verify(token, JWT_SECRET) as { adminId: string; email: string };
    return { isAuthenticated: true, admin: decoded };
  } catch {
    return { isAuthenticated: false };
  }
}
