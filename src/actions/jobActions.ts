"use server";

import { connectToDatabase } from "@/lib/db";
import { Job, IJob } from "@/models/Job";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const jobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(1, "Job description is required"),
  requirements: z.array(z.string().min(1)).min(1, "At least one requirement is required"),
  type: z.enum(["Full-Time", "Part-Time", "Contract", "Temporary", "Internship", "Volunteer", "Other"]),
  location: z.enum(["On-Site", "Remote", "Hybrid", "Other"]),
  salary: z.string().min(1, "Salary is required"),
  status: z.enum(["Open", "Closed", "On-Hold", "Other"]),
  closingDate: z.string().or(z.date()).transform((val) => new Date(val)),
  category: z.enum(["IT", "HR", "Marketing", "Sales", "Finance", "Other"]),
  totalOpenings: z.number().min(1, "Total openings must be at least 1"),
  responsibilities: z.array(z.string().min(1)).min(1, "At least one responsibility is required"),
});

const initialJobsSeed = [
  {
    title: "Senior Business Development Manager",
    description: "We are looking for a results-driven professional who understands growth, revenue, and market expansion — not just follow-ups and calls.",
    requirements: [
      "5+ years of experience in high-growth tech or B2B sales.",
      "Proven track record of closing high-value deals.",
      "Strong analytical mindset and communication skills.",
      "Deep understanding of client relationship management."
    ],
    type: "Full-Time" as const,
    location: "On-Site" as const,
    salary: "$80,000 - $120,000 / yr",
    status: "Open" as const,
    closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    category: "Sales" as const,
    totalOpenings: 2,
    responsibilities: [
      "Drive strategic sales growth and expand client portfolios.",
      "Manage end-to-end sales pipelines and negotiate enterprise terms.",
      "Collaborate with executive teams on revenue target strategies."
    ]
  },
  {
    title: "Digital Marketing Specialist",
    description: "Plan and execute SEO, ads, and content campaigns to grow brand visibility and drive measurable results.",
    requirements: [
      "3+ years of digital marketing experience in SEO, PPC, and Meta ads.",
      "Expertise in Google Analytics 4 and conversion optimization.",
      "Strong copywriting and visual asset creation skills."
    ],
    type: "Full-Time" as const,
    location: "Remote" as const,
    salary: "$60,000 - $85,000 / yr",
    status: "Open" as const,
    closingDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    category: "Marketing" as const,
    totalOpenings: 3,
    responsibilities: [
      "Formulate multi-channel acquisition campaigns.",
      "Optimize ROI across paid channels and organic search.",
      "Analyze campaign performance data and produce weekly reports."
    ]
  },
  {
    title: "Business Development Intern",
    description: "We're looking for a Business Development Intern who is motivated to learn how companies grow by building strategic client relationships.",
    requirements: [
      "Currently pursuing or recent graduate in Business or Communications.",
      "Excellent interpersonal and written communication.",
      "Self-starter with strong research skills."
    ],
    type: "Internship" as const,
    location: "Remote" as const,
    salary: "$1,500 - $2,500 / mo",
    status: "Open" as const,
    closingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    category: "Sales" as const,
    totalOpenings: 4,
    responsibilities: [
      "Conduct lead prospect research and outreach.",
      "Assist in preparing sales decks and proposals.",
      "Maintain CRM data hygiene."
    ]
  },
  {
    title: "Full Stack Development Intern",
    description: "Build and maintain scalable web applications by working across the front-end and back-end to deliver robust features.",
    requirements: [
      "Solid knowledge of React, Next.js, Node.js, and MongoDB.",
      "Familiarity with TypeScript and REST/GraphQL APIs.",
      "Good understanding of version control (Git)."
    ],
    type: "Internship" as const,
    location: "Remote" as const,
    salary: "$2,000 - $3,000 / mo",
    status: "Open" as const,
    closingDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    category: "IT" as const,
    totalOpenings: 2,
    responsibilities: [
      "Develop responsive user interfaces using Next.js & React.",
      "Create robust backend server actions and database APIs.",
      "Participate in code reviews and agile sprints."
    ]
  }
];

export async function seedJobsIfNoneExists() {
  try {
    await connectToDatabase();
    const count = await Job.countDocuments();
    if (count === 0) {
      await Job.insertMany(initialJobsSeed);
      console.log("Seeded initial jobs into MongoDB database");
    }
  } catch (error) {
    console.error("Error seeding jobs:", error);
  }
}

export async function getJobsAction() {
  try {
    await connectToDatabase();
    await seedJobsIfNoneExists();

    const jobs = await Job.find({}).sort({ createdAt: -1 }).lean();
    return {
      success: true,
      jobs: JSON.parse(JSON.stringify(jobs)),
    };
  } catch (error: any) {
    console.error("getJobsAction error, returning fallback initial jobs:", error);
    const fallbackJobs = initialJobsSeed.map((j, idx) => ({
      _id: `fallback-${idx + 1}`,
      ...j,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    return { success: true, jobs: fallbackJobs, isFallback: true };
  }
}

export async function getJobByIdAction(id: string) {
  try {
    await connectToDatabase();

    const job = await Job.findById(id).lean();
    if (!job) {
      // Check fallback match
      const fallbackIdx = id.replace("fallback-", "");
      const idx = parseInt(fallbackIdx, 10) - 1;
      if (!isNaN(idx) && initialJobsSeed[idx]) {
        return {
          success: true,
          job: { _id: id, ...initialJobsSeed[idx] },
        };
      }
      return { success: false, error: "Job not found" };
    }

    return {
      success: true,
      job: JSON.parse(JSON.stringify(job)),
    };
  } catch (error: any) {
    console.error("getJobByIdAction error:", error);
    const fallbackIdx = id.replace("fallback-", "");
    const idx = parseInt(fallbackIdx, 10) - 1;
    if (!isNaN(idx) && initialJobsSeed[idx]) {
      return {
        success: true,
        job: { _id: id, ...initialJobsSeed[idx] },
      };
    }
    return { success: false, error: error.message };
  }
}

export async function createJobAction(rawData: any) {
  try {
    await connectToDatabase();

    const parsed = jobSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const newJob = await Job.create(parsed.data);

    revalidatePath("/admin/dashboard");
    revalidatePath("/jobs");
    revalidatePath("/");

    return {
      success: true,
      job: JSON.parse(JSON.stringify(newJob)),
      message: "Job created successfully",
    };
  } catch (error: any) {
    console.error("createJobAction error:", error);
    return { success: false, error: error.message || "Failed to create job" };
  }
}

export async function updateJobAction(id: string, rawData: any) {
  try {
    await connectToDatabase();

    const parsed = jobSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const updatedJob = await Job.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
    if (!updatedJob) {
      return { success: false, error: "Job not found" };
    }

    revalidatePath("/admin/dashboard");
    revalidatePath(`/jobs/${id}`);
    revalidatePath("/jobs");

    return {
      success: true,
      job: JSON.parse(JSON.stringify(updatedJob)),
      message: "Job updated successfully",
    };
  } catch (error: any) {
    console.error("updateJobAction error:", error);
    return { success: false, error: error.message || "Failed to update job" };
  }
}

export async function deleteJobAction(id: string) {
  try {
    await connectToDatabase();

    const deleted = await Job.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, error: "Job not found" };
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/jobs");

    return { success: true, message: "Job deleted successfully" };
  } catch (error: any) {
    console.error("deleteJobAction error:", error);
    return { success: false, error: error.message || "Failed to delete job" };
  }
}
