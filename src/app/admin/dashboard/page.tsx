"use client";

import { useEffect, useState } from "react";
import { Raleway } from "next/font/google";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  User,
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  ExternalLink,
  Filter,
  Search,
  Plus,
  Trash2,
  Edit,
  LogOut,
  Mail,
  Building,
  Phone,
  Calendar,
  X,
  Eye,
  Download,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { logoutAdminAction } from "@/actions/authActions";
import { getJobsAction, createJobAction, updateJobAction, deleteJobAction } from "@/actions/jobActions";
import { getApplicantsAction, deleteApplicantAction, updateApplicantStatusAction } from "@/actions/applicantActions";
import { getContactsAction, deleteContactAction } from "@/actions/contactActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const raleway = Raleway({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

// Zod schema for job form
const jobFormSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(1, "Job description is required"),
  requirements: z.string().min(1, "Job requirements are required"), // text input split by newline
  type: z.enum(["Full-Time", "Part-Time", "Contract", "Temporary", "Internship", "Volunteer", "Other"]),
  location: z.enum(["On-Site", "Remote", "Hybrid", "Other"]),
  salary: z.string().min(1, "Salary is required"),
  status: z.enum(["Open", "Closed", "On-Hold", "Other"]),
  closingDate: z.string().min(1, "Closing date is required"),
  category: z.enum(["IT", "HR", "Marketing", "Sales", "Finance", "Other"]),
  totalOpenings: z.number().min(1, "Total openings must be at least 1"),
  responsibilities: z.string().min(1, "Job responsibilities are required"), // text input split by newline
});

type JobFormData = z.infer<typeof jobFormSchema>;

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"jobs" | "applicants" | "contacts">("jobs");

  // State data
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Job Modal State
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);

  // Applicant Modal State
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
  const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      type: "Full-Time",
      location: "Remote",
      salary: "",
      status: "Open",
      closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      category: "IT",
      totalOpenings: 1,
      responsibilities: "",
    },
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes, contactsRes] = await Promise.all([
        getJobsAction(),
        getApplicantsAction(),
        getContactsAction(),
      ]);

      if (jobsRes.success) setJobs(jobsRes.jobs || []);
      if (appsRes.success) setApplicants(appsRes.applicants || []);
      if (contactsRes.success) setContacts(contactsRes.contacts || []);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdminAction();
    toast.success("Logged out successfully");
    router.push("/admin/login");
    router.refresh();
  };

  const handleOpenAddJob = () => {
    setEditingJob(null);
    reset({
      title: "",
      description: "",
      requirements: "",
      type: "Full-Time",
      location: "Remote",
      salary: "$60,000 - $90,000 / yr",
      status: "Open",
      closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      category: "IT",
      totalOpenings: 1,
      responsibilities: "",
    });
    setIsJobModalOpen(true);
  };

  const handleOpenEditJob = (job: any) => {
    setEditingJob(job);
    reset({
      title: job.title,
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join("\n") : job.requirements,
      type: job.type,
      location: job.location,
      salary: job.salary,
      status: job.status,
      closingDate: new Date(job.closingDate).toISOString().split("T")[0],
      category: job.category,
      totalOpenings: Number(job.totalOpenings),
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join("\n") : job.responsibilities,
    });
    setIsJobModalOpen(true);
  };

  const onSubmitJob = async (data: JobFormData) => {
    const payload = {
      ...data,
      requirements: data.requirements.split("\n").filter((line) => line.trim() !== ""),
      responsibilities: data.responsibilities.split("\n").filter((line) => line.trim() !== ""),
      totalOpenings: Number(data.totalOpenings),
    };

    if (editingJob) {
      const res = await updateJobAction(editingJob._id, payload);
      if (res.success) {
        toast.success("Job updated successfully!");
        setIsJobModalOpen(false);
        loadAllData();
      } else {
        toast.error(res.error || "Failed to update job");
      }
    } else {
      const res = await createJobAction(payload);
      if (res.success) {
        toast.success("Job created successfully!");
        setIsJobModalOpen(false);
        loadAllData();
      } else {
        toast.error(res.error || "Failed to create job");
      }
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job position?")) return;
    const res = await deleteJobAction(id);
    if (res.success) {
      toast.success("Job deleted successfully");
      loadAllData();
    } else {
      toast.error(res.error || "Failed to delete job");
    }
  };

  const handleDeleteApplicant = async (id: string) => {
    if (!confirm("Are you sure you want to delete this applicant record?")) return;
    const res = await deleteApplicantAction(id);
    if (res.success) {
      toast.success("Applicant deleted");
      if (selectedApplicant?._id === id) setIsApplicantModalOpen(false);
      loadAllData();
    } else {
      toast.error(res.error || "Failed to delete applicant");
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact submission?")) return;
    const res = await deleteContactAction(id);
    if (res.success) {
      toast.success("Contact message deleted");
      loadAllData();
    } else {
      toast.error(res.error || "Failed to delete contact");
    }
  };

  const handleDownloadResume = (applicant: any) => {
    if (!applicant.resume?.fileData) {
      toast.error("No resume file available");
      return;
    }
    const link = document.createElement("a");
    link.href = `data:${applicant.resume.mimeType || "application/pdf"};base64,${applicant.resume.fileData}`;
    link.download = applicant.resume.fileName || `${applicant.firstName}_${applicant.lastName}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Lists
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "All" || job.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredApplicants = applicants.filter((app) => {
    const fullName = `${app.firstName} ${app.lastName}`.toLowerCase();
    const posTitle = (app.jobId?.title || app.appliedPositionTitle || "").toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || app.email.toLowerCase().includes(searchQuery.toLowerCase()) || posTitle.includes(searchQuery.toLowerCase());
  });

  const filteredContacts = contacts.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()) || c.company.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-gray-400 animate-pulse text-sm">Loading Unifiro Labs Admin Dashboard...</div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-[#050508] text-white p-4 sm:p-8 lg:p-12", raleway.className)}>
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold tracking-widest uppercase">
              <span className="w-6 h-[2px] bg-blue-400"></span>
              Admin Portal
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Unifiro Labs <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300 font-light">Dashboard</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-md px-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center font-bold text-black text-sm">
                UL
              </div>
              <div>
                <div className="text-xs font-bold text-white">Administrator</div>
                <div className="text-[10px] text-gray-400">admin@unifirolabs.com</div>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 bg-transparent rounded-2xl h-11 px-4 gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </header>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10 text-white backdrop-blur-xl hover:border-white/20 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Active Jobs</CardTitle>
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Briefcase className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">{jobs.length}</div>
              <p className="text-xs text-gray-400 mt-1">Managed careers positions</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white backdrop-blur-xl hover:border-white/20 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Applicants</CardTitle>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">{applicants.length}</div>
              <p className="text-xs text-gray-400 mt-1">Submitted job applications</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white backdrop-blur-xl hover:border-white/20 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-wider">Contact Messages</CardTitle>
              <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <Mail className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">{contacts.length}</div>
              <p className="text-xs text-gray-400 mt-1">Inquiries from contact page</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("jobs")}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
                activeTab === "jobs"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Briefcase className="w-4 h-4" />
              <span>Jobs ({jobs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("applicants")}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
                activeTab === "applicants"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Users className="w-4 h-4" />
              <span>Applicants ({applicants.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("contacts")}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
                activeTab === "contacts"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Mail className="w-4 h-4" />
              <span>Contact Inquiries ({contacts.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-9 bg-black/40 border-white/10 text-white text-xs h-10 w-48 sm:w-64 rounded-xl focus:border-blue-500"
              />
            </div>

            {activeTab === "jobs" && (
              <Button
                onClick={handleOpenAddJob}
                className="bg-gradient-to-r from-blue-600 to-sky-500 text-white text-xs font-semibold rounded-xl h-10 px-4 gap-2 shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Job</span>
              </Button>
            )}
          </div>
        </div>

        {/* TAB 1: JOBS MANAGEMENT */}
        {activeTab === "jobs" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white/5 rounded-3xl border border-white/10 text-gray-400">
                  No jobs found matching criteria.
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <motion.div
                    key={job._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#0D0E15] border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                          {job.category}
                        </span>
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                            job.status === "Open"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          )}
                        >
                          {job.status}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {job.title}
                      </h3>

                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2 text-xs text-gray-300">
                        <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">{job.type}</span>
                        <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">{job.location}</span>
                        <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">{job.salary}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2 text-xs">
                      <span className="text-gray-400">Openings: <strong className="text-white">{job.totalOpenings}</strong></span>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => router.push(`/jobs/${job._id}`)}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
                          title="View Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleOpenEditJob(job)}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg"
                          title="Edit Job"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteJob(job._id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: APPLICANTS PAGE */}
        {activeTab === "applicants" && (
          <div className="bg-[#0D0E15] border border-white/10 rounded-3xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Submitted Job Applications
            </h2>

            {filteredApplicants.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No applicant records found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-white/5 text-xs uppercase font-semibold text-gray-400 border-b border-white/10">
                    <tr>
                      <th className="p-4">Applicant Name</th>
                      <th className="p-4">Email / Phone</th>
                      <th className="p-4">Position Applied</th>
                      <th className="p-4">Date Applied</th>
                      <th className="p-4">Resume</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredApplicants.map((app) => (
                      <tr key={app._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-bold text-white">
                          {app.firstName} {app.lastName}
                        </td>
                        <td className="p-4 text-xs space-y-1">
                          <div className="text-gray-200">{app.email}</div>
                          <div className="text-gray-400">{app.phone}</div>
                        </td>
                        <td className="p-4 font-medium text-blue-400">
                          {app.jobId?.title || app.appliedPositionTitle}
                        </td>
                        <td className="p-4 text-xs text-gray-400">
                          {app.createdAt ? format(new Date(app.createdAt), "MMM dd, yyyy") : "N/A"}
                        </td>
                        <td className="p-4">
                          {app.resume?.fileData ? (
                            <Button
                              onClick={() => handleDownloadResume(app)}
                              size="sm"
                              className="bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white text-xs h-8 px-3 rounded-lg gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>PDF Resume</span>
                            </Button>
                          ) : (
                            <span className="text-xs text-gray-500 italic">No File</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <Button
                            onClick={() => {
                              setSelectedApplicant(app);
                              setIsApplicantModalOpen(true);
                            }}
                            size="sm"
                            variant="outline"
                            className="border-white/10 text-gray-300 hover:bg-white/10 text-xs h-8 px-3 rounded-lg"
                          >
                            Details
                          </Button>
                          <Button
                            onClick={() => handleDeleteApplicant(app._id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:bg-red-500/10 text-xs h-8 px-2 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONTACT FORM SUBMISSIONS */}
        {activeTab === "contacts" && (
          <div className="bg-[#0D0E15] border border-white/10 rounded-3xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-sky-400" />
              Contact Page Submissions
            </h2>

            {filteredContacts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No contact messages received yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredContacts.map((c) => (
                  <div key={c._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{c.firstName} {c.lastName}</h3>
                        <p className="text-xs text-blue-400 font-medium">{c.company}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-1 rounded-md">
                        {c.createdAt ? format(new Date(c.createdAt), "MMM dd, yyyy") : ""}
                      </span>
                    </div>

                    <div className="text-xs text-gray-300 space-y-1">
                      <div><strong className="text-gray-400">Email:</strong> {c.email}</div>
                      {c.phone && <div><strong className="text-gray-400">Phone:</strong> {c.phone}</div>}
                    </div>

                    <div className="bg-black/40 p-3 rounded-xl text-xs text-gray-300 border border-white/5 leading-relaxed">
                      "{c.message}"
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleDeleteContact(c._id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:bg-red-500/10 text-xs h-8 px-3 rounded-lg gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* JOB ADD / EDIT MODAL */}
      <Dialog open={isJobModalOpen} onOpenChange={setIsJobModalOpen}>
        <DialogContent className="max-w-2xl bg-[#0D0E15] border-white/10 text-white p-6 rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingJob ? "Edit Job Position" : "Create New Job Position"}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400">
              Fill out all required details for the job listing.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmitJob)} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Job Title *</label>
                <Input {...register("title")} placeholder="e.g. Senior Full Stack Engineer" className="bg-white/5 border-white/10 text-xs h-10" />
                {errors.title && <p className="text-[10px] text-red-400">{errors.title.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Category *</label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-xs h-10 text-white">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#12131C] border-white/10 text-white">
                        {["IT", "HR", "Marketing", "Sales", "Finance", "Other"].map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Job Type *</label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-xs h-10 text-white">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#12131C] border-white/10 text-white">
                        {["Full-Time", "Part-Time", "Contract", "Temporary", "Internship", "Volunteer", "Other"].map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Location *</label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-xs h-10 text-white">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#12131C] border-white/10 text-white">
                        {["On-Site", "Remote", "Hybrid", "Other"].map((loc) => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Status *</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-xs h-10 text-white">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#12131C] border-white/10 text-white">
                        {["Open", "Closed", "On-Hold", "Other"].map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Salary Range *</label>
                <Input {...register("salary")} placeholder="e.g. $70,000 - $90,000 / yr" className="bg-white/5 border-white/10 text-xs h-10" />
                {errors.salary && <p className="text-[10px] text-red-400">{errors.salary.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Closing Date *</label>
                <Input {...register("closingDate")} type="date" className="bg-white/5 border-white/10 text-xs h-10 text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Total Openings *</label>
                <Input {...register("totalOpenings", { valueAsNumber: true })} type="number" min={1} className="bg-white/5 border-white/10 text-xs h-10" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Job Description *</label>
              <Textarea {...register("description")} rows={3} placeholder="Comprehensive description..." className="bg-white/5 border-white/10 text-xs" />
              {errors.description && <p className="text-[10px] text-red-400">{errors.description.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Requirements (One per line) *</label>
              <Textarea {...register("requirements")} rows={3} placeholder="3+ years experience with Next.js&#10;Strong TypeScript skills" className="bg-white/5 border-white/10 text-xs" />
              {errors.requirements && <p className="text-[10px] text-red-400">{errors.requirements.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Responsibilities (One per line) *</label>
              <Textarea {...register("responsibilities")} rows={3} placeholder="Develop web application features&#10;Collaborate with UI/UX team" className="bg-white/5 border-white/10 text-xs" />
              {errors.responsibilities && <p className="text-[10px] text-red-400">{errors.responsibilities.message}</p>}
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsJobModalOpen(false)} className="text-xs">Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-6 font-semibold rounded-xl">
                {editingJob ? "Update Job" : "Save Job"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* APPLICANT DETAIL MODAL */}
      {selectedApplicant && (
        <Dialog open={isApplicantModalOpen} onOpenChange={setIsApplicantModalOpen}>
          <DialogContent className="max-w-xl bg-[#0D0E15] border-white/10 text-white p-6 rounded-3xl space-y-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {selectedApplicant.firstName} {selectedApplicant.lastName}
              </DialogTitle>
              <DialogDescription className="text-xs text-blue-400">
                Applied for: {selectedApplicant.jobId?.title || selectedApplicant.appliedPositionTitle}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="grid grid-cols-2 gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                <div><strong className="text-gray-400">Email:</strong> {selectedApplicant.email}</div>
                <div><strong className="text-gray-400">Phone:</strong> {selectedApplicant.phone}</div>
                {selectedApplicant.linkedin && (
                  <div className="col-span-2">
                    <strong className="text-gray-400">LinkedIn:</strong>{" "}
                    <a href={selectedApplicant.linkedin} target="_blank" rel="noreferrer" className="text-blue-400 underline">
                      {selectedApplicant.linkedin}
                    </a>
                  </div>
                )}
                {selectedApplicant.portfolio && (
                  <div className="col-span-2">
                    <strong className="text-gray-400">Portfolio:</strong>{" "}
                    <a href={selectedApplicant.portfolio} target="_blank" rel="noreferrer" className="text-blue-400 underline">
                      {selectedApplicant.portfolio}
                    </a>
                  </div>
                )}
              </div>

              {selectedApplicant.coverLetter && (
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-xs">Cover Letter</h4>
                  <div className="bg-black/50 p-3 rounded-xl border border-white/5 leading-relaxed text-gray-300">
                    {selectedApplicant.coverLetter}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-between items-center">
                {selectedApplicant.resume?.fileData && (
                  <Button
                    onClick={() => handleDownloadResume(selectedApplicant)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-xl gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Resume</span>
                  </Button>
                )}

                <Button
                  onClick={() => handleDeleteApplicant(selectedApplicant._id)}
                  variant="destructive"
                  className="text-xs rounded-xl"
                >
                  Delete Record
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
