import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  requirements: string[];
  type: "Full-Time" | "Part-Time" | "Contract" | "Temporary" | "Internship" | "Volunteer" | "Other";
  location: "On-Site" | "Remote" | "Hybrid" | "Other";
  salary: string;
  status: "Open" | "Closed" | "On-Hold" | "Other";
  closingDate: Date;
  category: "IT" | "HR" | "Marketing" | "Sales" | "Finance" | "Other";
  totalOpenings: number;
  responsibilities: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requirements: { type: [String], required: true },
    type: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract", "Temporary", "Internship", "Volunteer", "Other"],
      required: true,
      default: "Full-Time",
    },
    location: {
      type: String,
      enum: ["On-Site", "Remote", "Hybrid", "Other"],
      required: true,
      default: "Remote",
    },
    salary: { type: String, required: true },
    status: {
      type: String,
      enum: ["Open", "Closed", "On-Hold", "Other"],
      required: true,
      default: "Open",
    },
    closingDate: { type: Date, required: true },
    category: {
      type: String,
      enum: ["IT", "HR", "Marketing", "Sales", "Finance", "Other"],
      required: true,
      default: "IT",
    },
    totalOpenings: { type: Number, required: true, default: 1 },
    responsibilities: { type: [String], required: true },
  },
  { timestamps: true }
);

export const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
