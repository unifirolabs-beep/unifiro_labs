"use server";

import { connectToDatabase } from "@/lib/db";
import { Applicant } from "@/models/Applicant";
import { Job } from "@/models/Job";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const applicantSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  jobId: z.string().optional(),
  appliedPositionTitle: z.string().min(1, "Applied position is required"),
  coverLetter: z.string().optional(),
  portfolio: z.string().optional(),
  linkedin: z.string().optional(),
});

export async function createApplicantAction(formData: FormData) {
  try {
    await connectToDatabase();

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const jobId = formData.get("jobId") as string;
    const appliedPositionTitle = formData.get("appliedPositionTitle") as string || formData.get("appliedPosition") as string;
    const coverLetter = formData.get("coverLetter") as string || "";
    const portfolio = formData.get("portfolio") as string || "";
    const linkedin = formData.get("linkedin") as string || formData.get("linkedinUrl") as string || "";

    const parsed = applicantSchema.safeParse({
      firstName,
      lastName,
      email,
      phone,
      jobId,
      appliedPositionTitle,
      coverLetter,
      portfolio,
      linkedin,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const resumeFile = formData.get("resume") as File | null;
    if (!resumeFile) {
      return { success: false, error: "Resume file is required" };
    }

    // Check size limit: Must be below 1 MB (1,048,576 bytes)
    if (resumeFile.size > 1024 * 1024) {
      return { success: false, error: "Resume file size must be less than 1 MB" };
    }

    // Check file type: Must be PDF
    if (resumeFile.type !== "application/pdf" && !resumeFile.name.toLowerCase().endsWith(".pdf")) {
      return { success: false, error: "Resume file must be a PDF document" };
    }

    // Convert PDF file to Base64 for storing in DB
    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");

    const newApplicant = await Applicant.create({
      firstName,
      lastName,
      email,
      phone,
      jobId: jobId && jobId !== "undefined" && jobId !== "" ? jobId : undefined,
      appliedPositionTitle,
      resume: {
        fileName: resumeFile.name,
        fileData: base64Data,
        mimeType: "application/pdf",
      },
      coverLetter,
      portfolio,
      linkedin,
      status: "Pending",
    });

    revalidatePath("/admin/dashboard");

    return {
      success: true,
      applicantId: newApplicant._id.toString(),
      message: "Application submitted successfully!",
    };
  } catch (error: any) {
    console.error("createApplicantAction error:", error);
    return { success: false, error: error.message || "Failed to submit application" };
  }
}

export async function getApplicantsAction() {
  try {
    await connectToDatabase();

    // Populate jobId from Job schema to display linked job details
    const applicants = await Applicant.find({})
      .populate({ path: "jobId", select: "title category location type" })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      applicants: JSON.parse(JSON.stringify(applicants)),
    };
  } catch (error: any) {
    console.error("getApplicantsAction error:", error);
    return { success: false, applicants: [], error: error.message };
  }
}

export async function updateApplicantStatusAction(id: string, status: string) {
  try {
    await connectToDatabase();
    await Applicant.findByIdAndUpdate(id, { status });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteApplicantAction(id: string) {
  try {
    await connectToDatabase();
    await Applicant.findByIdAndDelete(id);
    revalidatePath("/admin/dashboard");
    return { success: true, message: "Applicant deleted successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
