import JobDetailsClient from "@/components/job-details-client";
import { getJobByIdAction, getJobsAction } from "@/actions/jobActions";
import { constructMetadata, getJobPostingSchema } from "@/config/seo";
import type { Metadata } from "next";

export async function generateStaticParams() {
  try {
    const res = await getJobsAction();
    if (res.success && res.jobs) {
      return res.jobs.map((job: any) => ({ id: job._id.toString() }));
    }
  } catch (e) {
    console.error("generateStaticParams error:", e);
  }
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const res = await getJobByIdAction(resolvedParams.id);
    if (res.success && res.job) {
      const job = res.job;
      return constructMetadata({
        title: `${job.title} | Career`,
        description: job.description ? job.description.slice(0, 160) : `Apply for the ${job.title} position at Unifiro Labs.`,
        canonical: `/jobs/${resolvedParams.id}`,
      });
    }
  } catch (error) {
    console.error("Error generating metadata for job:", error);
  }

  return constructMetadata({
    title: "Job Opening",
    description: "Career opportunity at Unifiro Labs",
    canonical: `/jobs/${resolvedParams.id}`,
  });
}

export default async function JobDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let job = null;

  try {
    const res = await getJobByIdAction(resolvedParams.id);
    if (res.success && res.job) {
      job = res.job;
    }
  } catch (error) {
    console.error("Error fetching job details:", error);
  }

  const jobSchema = job ? getJobPostingSchema(job) : null;

  return (
    <>
      {jobSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
        />
      )}
      <JobDetailsClient job={job} />
    </>
  );
}
