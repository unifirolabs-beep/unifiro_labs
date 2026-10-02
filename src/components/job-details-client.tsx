"use client";

import { Raleway } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Building2, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { JobApplicationForm } from "@/components/job-application-form";
import { checkAdminAuthAction } from "@/actions/authActions";
import { deleteJobAction } from "@/actions/jobActions";
import { toast } from "sonner";

const raleway = Raleway({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export default function JobDetailsClient({ job }: { job: any }) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    checkAdminAuthAction().then((res) => {
      if (res.isAuthenticated) {
        setIsAdminLoggedIn(true);
      }
    });
  }, []);

  if (!job) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Job Position Not Found</h2>
        <Button onClick={() => router.push("/")} variant="outline" className="text-white border-white/20">
          Back to Home
        </Button>
      </div>
    );
  }

  const requirements = job.requirements || job.lookingFor || [];
  const responsibilities = job.responsibilities || [];

  const handleDeleteJob = async () => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    const res = await deleteJobAction(job._id);
    if (res.success) {
      toast.success("Job deleted successfully");
      router.push("/admin/dashboard");
    } else {
      toast.error(res.error || "Failed to delete job");
    }
  };

  return (
    <div className={`min-h-screen relative text-white ${raleway.className} overflow-x-hidden`}>
      {/* Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/morepage/job-details-bg.webp"
          alt="Background"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/90" />
      </div>

      {/* Back & Admin Controls Bar */}
      <div className="absolute top-8 left-4 sm:left-8 right-4 sm:right-8 z-50 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
          title="Back"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>

        {isAdminLoggedIn && (
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push("/admin/dashboard")}
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-xl gap-2 shadow-lg shadow-blue-500/20"
            >
              <Edit className="w-4 h-4" />
              <span>Edit in Dashboard</span>
            </Button>
            <Button
              onClick={handleDeleteJob}
              size="sm"
              variant="destructive"
              className="text-xs rounded-xl gap-2 shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Job</span>
            </Button>
          </div>
        )}
      </div>

      <main className="relative z-10 pt-28 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
              {job.category || "Careers"}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-gray-300 text-base sm:text-lg pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-sky-400" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span>{job.salary}</span>
              </div>
            </div>
          </motion.div>

          {/* Job Description Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <span className="inline-block bg-white text-black px-6 py-2 rounded-full text-sm font-semibold tracking-wide">
              Job Description
            </span>
            <p className="text-lg text-blue-100/90 leading-relaxed font-light">
              {job.description}
            </p>
          </motion.div>

          {/* Requirements Section */}
          {requirements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <span className="inline-block bg-white text-black px-6 py-2 rounded-full text-sm font-semibold tracking-wide">
                Requirements & Qualifications
              </span>
              <ul className="space-y-3 text-lg text-gray-200 font-light list-disc pl-5 marker:text-blue-400">
                {requirements.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Responsibilities Section */}
          {responsibilities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <span className="inline-block bg-white text-black px-6 py-2 rounded-full text-sm font-semibold tracking-wide">
                Key Responsibilities
              </span>
              <ul className="space-y-3 text-lg text-gray-200 font-light list-disc pl-5 marker:text-sky-400">
                {responsibilities.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Apply Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-8"
          >
            <Button
              onClick={() => setIsFormOpen(true)}
              className="w-full sm:w-auto min-w-[220px] bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 text-white rounded-full py-6 text-lg font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Apply Now
            </Button>
          </motion.div>
        </div>
      </main>

      <JobApplicationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        jobTitle={job.title}
        jobId={job._id}
        jobType={job.type}
      />
    </div>
  );
}
