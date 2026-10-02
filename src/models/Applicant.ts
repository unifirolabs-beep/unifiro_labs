import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApplicant extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobId?: mongoose.Types.ObjectId;
  appliedPositionTitle: string;
  resume: {
    fileName: string;
    fileData: string; // Base64 representation of PDF
    mimeType: string;
  };
  coverLetter?: string;
  portfolio?: string;
  linkedin?: string;
  status: "Pending" | "Reviewed" | "Shortlisted" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const ApplicantSchema: Schema = new Schema<IApplicant>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    appliedPositionTitle: { type: String, required: true },
    resume: {
      fileName: { type: String, required: true },
      fileData: { type: String, required: true },
      mimeType: { type: String, required: true, default: "application/pdf" },
    },
    coverLetter: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Shortlisted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Applicant: Model<IApplicant> = mongoose.models.Applicant || mongoose.model<IApplicant>("Applicant", ApplicantSchema);
