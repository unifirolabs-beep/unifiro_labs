"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import { Raleway } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createApplicantAction } from "@/actions/applicantActions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const raleway = Raleway({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const applicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Valid email address is required"),
  phone: z.string().min(1, "Phone number is required"),
  coverLetter: z.string().optional(),
  portfolio: z.string().optional(),
  linkedin: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface JobApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  jobId?: string;
  jobType?: string;
}

export function JobApplicationForm({ isOpen, onClose, jobTitle, jobId, jobType }: JobApplicationFormProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      coverLetter: "",
      portfolio: "",
      linkedin: "",
    },
  });

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setFileError(null);
    if (rejectedFiles && rejectedFiles.length > 0) {
      const err = rejectedFiles[0].errors[0];
      if (err.code === "file-too-large") {
        setFileError("File size exceeds 1 MB limit.");
      } else if (err.code === "file-invalid-type") {
        setFileError("Only PDF files are allowed.");
      } else {
        setFileError(err.message);
      }
      return;
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 1024 * 1024) {
        setFileError("File size exceeds 1 MB limit.");
        return;
      }
      setResumeFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 1024 * 1024, // 1 MB limit
  });

  const onSubmit = async (data: ApplicationFormData) => {
    if (!resumeFile) {
      setFileError("Please upload your PDF resume.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      if (jobId) formData.append("jobId", jobId);
      formData.append("appliedPositionTitle", jobTitle);
      if (data.coverLetter) formData.append("coverLetter", data.coverLetter);
      if (data.portfolio) formData.append("portfolio", data.portfolio);
      if (data.linkedin) formData.append("linkedin", data.linkedin);
      formData.append("resume", resumeFile);

      const res = await createApplicantAction(formData);

      if (res.success) {
        toast.success("Application submitted successfully!");
        reset();
        setResumeFile(null);
        setFileError(null);
        onClose();
      } else {
        toast.error(res.error || "Submission failed");
      }
    } catch (err: any) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#0B0C12] border-white/10 text-white p-6 sm:p-8 rounded-3xl max-h-[90vh] overflow-y-auto selection:bg-blue-500/30">
        
        {/* Header */}
        <DialogHeader className="space-y-2 text-center sm:text-left">
          <div className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wider w-fit">
            Applying for {jobType || "Position"}
          </div>
          <DialogTitle className={cn("text-2xl sm:text-3xl font-extrabold text-white", raleway.className)}>
            {jobTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            Complete the details below to submit your job application.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">
                First Name <span className="text-red-400">*</span>
              </label>
              <Input
                {...register("firstName")}
                placeholder="John"
                className="bg-white/5 border-white/10 text-white placeholder-gray-500 text-sm h-11 rounded-xl focus:border-blue-500"
              />
              {errors.firstName && <p className="text-[11px] text-red-400">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">
                Last Name <span className="text-red-400">*</span>
              </label>
              <Input
                {...register("lastName")}
                placeholder="Doe"
                className="bg-white/5 border-white/10 text-white placeholder-gray-500 text-sm h-11 rounded-xl focus:border-blue-500"
              />
              {errors.lastName && <p className="text-[11px] text-red-400">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">
                Email Address <span className="text-red-400">*</span>
              </label>
              <Input
                {...register("email")}
                type="email"
                placeholder="john@example.com"
                className="bg-white/5 border-white/10 text-white placeholder-gray-500 text-sm h-11 rounded-xl focus:border-blue-500"
              />
              {errors.email && <p className="text-[11px] text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <Input
                {...register("phone")}
                placeholder="+1 (555) 000-0000"
                className="bg-white/5 border-white/10 text-white placeholder-gray-500 text-sm h-11 rounded-xl focus:border-blue-500"
              />
              {errors.phone && <p className="text-[11px] text-red-400">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Resume Upload Dropzone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
              <span>Resume (PDF Only, &lt; 1MB) <span className="text-red-400">*</span></span>
              <span className="text-[10px] text-gray-400">PDF document only</span>
            </label>

            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-2",
                isDragActive
                  ? "border-blue-500 bg-blue-500/10"
                  : resumeFile
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-white/10 hover:border-white/20 bg-white/5"
              )}
            >
              <input {...getInputProps()} />

              {resumeFile ? (
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">{resumeFile.name}</p>
                    <p className="text-[11px] text-gray-400">
                      {(resumeFile.size / 1024).toFixed(1)} KB — Click or drag to replace
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-300 font-medium">
                    Drag & drop your PDF resume here, or <span className="text-blue-400 underline">browse</span>
                  </p>
                  <p className="text-[10px] text-gray-500">Maximum file size: 1 MB</p>
                </>
              )}
            </div>

            {fileError && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 pt-1">
                <AlertCircle className="w-4 h-4" />
                <span>{fileError}</span>
              </div>
            )}
          </div>

          {/* Social Links (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">LinkedIn Profile (Optional)</label>
              <Input
                {...register("linkedin")}
                placeholder="https://linkedin.com/in/username"
                className="bg-white/5 border-white/10 text-white placeholder-gray-500 text-sm h-11 rounded-xl focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Portfolio URL (Optional)</label>
              <Input
                {...register("portfolio")}
                placeholder="https://myportfolio.com"
                className="bg-white/5 border-white/10 text-white placeholder-gray-500 text-sm h-11 rounded-xl focus:border-blue-500"
              />
            </div>
          </div>

          {/* Cover Letter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Cover Letter (Optional)</label>
            <Textarea
              {...register("coverLetter")}
              rows={3}
              placeholder="Tell us why you are a great fit for this position..."
              className="bg-white/5 border-white/10 text-white placeholder-gray-500 text-sm rounded-xl focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-sky-500 hover:opacity-95 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 text-sm"
            >
              {isSubmitting ? "Submitting Application..." : "Submit Application"}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}
