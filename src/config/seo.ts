import type { Metadata } from "next";

export const siteConfig = {
  name: "Unifiro Labs",
  legalName: "Unifiro Labs",
  description: "Innovative Tech & Brand Growth Systems. We build high-impact digital platforms, AI-powered systems, and technology solutions to scale modern brands.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://unifirolabs.com",
  ogImage: "/unifirolabs.png",
  email: "contact@unifirolabs.com",
  links: {
    linkedin: "https://linkedin.com/company/unifirolabs",
    twitter: "https://twitter.com/unifirolabs",
    github: "https://github.com/unifirolabs",
  },
  keywords: [
    "Unifiro Labs",
    "Brand Growth Systems",
    "Tech Innovation",
    "video editing agency",
    "video editing services",
    "video editing company",
    "video editing agency in Raichur",
    "social media marketing agency in Raichur",
    "Custom Software Engineering",
    "AI Integration",
    "Web Application Development",
    "Unifiro",
    "India Tech Startup",
    "Startups in India",
    "Startups in Karnataka",
    "Startups in Bangalore",
    "Unifirolabs",
    "social media marketing agency",
    "social media marketing agency in India",
    "social media marketing agency in Karnataka",
    "social media marketing agency in Bangalore",
    "social media marketing agency in Raichur",
  ],
};

export function constructMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  canonical,
  keywords = siteConfig.keywords,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  keywords?: string[];
  noIndex?: boolean;
} = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} | Innovative Tech & Brand Growth Systems`;
  const canonicalUrl = canonical ? `${siteConfig.url}${canonical}` : siteConfig.url;

  return {
    title: pageTitle,
    description,
    keywords,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [image],
      creator: "@unifirolabs",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

// JSON-LD Schemas
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  url: siteConfig.url,
  logo: `${siteConfig.url}/unifirolabs.png`,
  email: siteConfig.email,
  sameAs: [siteConfig.links.linkedin, siteConfig.links.twitter, siteConfig.links.github],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    email: siteConfig.email,
    availableLanguage: ["English"],
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
  },
};

export const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `About ${siteConfig.name}`,
  url: `${siteConfig.url}/about`,
  description: "Learn about Unifiro Labs, our story, mission, and how we empower brands through innovative technology and execution.",
  mainEntity: organizationSchema,
};

export const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Digital Transformation & Brand Engineering",
  provider: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  },
  areaServed: "Global",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Tech & Growth Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Brand Strategy & Systems",
          description: "Clear positioning, brand architecture, and unified growth systems.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Custom Platform Engineering",
          description: "High-performance web and mobile application engineering built to scale.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI & Intelligence Integration",
          description: "Thoughtful AI integration to turn customer data into actionable insights.",
        },
      },
    ],
  },
};

export const productsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Unifiro Labs Products & Platforms",
  url: `${siteConfig.url}/products`,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "SoftwareApplication",
        name: "DailyGo",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web / Mobile",
        description: "Verified Gigforce & Student Earning Platform.",
        url: `${siteConfig.url}/products`,
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "SoftwareApplication",
        name: "Unifiro",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: "One Platform for Registrations, Payments and Management.",
        url: `${siteConfig.url}/products`,
      },
    },
  ],
};

export const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contact ${siteConfig.name}`,
  url: `${siteConfig.url}/contact`,
  mainEntity: organizationSchema,
};

export const careerPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `Careers at ${siteConfig.name}`,
  url: `${siteConfig.url}/more`,
  description: "Join passionate professionals dedicated to technology innovation, growth, and community impact at Unifiro Labs.",
  publisher: organizationSchema,
};

export function getJobPostingSchema(job: {
  title: string;
  description: string;
  category?: string;
  type?: string;
  location?: string;
  salary?: string;
  createdAt?: string | Date;
  closingDate?: string | Date;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    identifier: {
      "@type": "PropertyValue",
      name: siteConfig.name,
      value: job.title.toLowerCase().replace(/\s+/g, "-"),
    },
    datePosted: job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString(),
    validThrough: job.closingDate ? new Date(job.closingDate).toISOString() : undefined,
    employmentType: job.type ? job.type.toUpperCase().replace("-", "_") : "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: siteConfig.name,
      sameAs: siteConfig.url,
      logo: `${siteConfig.url}/unifirolabs.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
        addressLocality: job.location || "Remote",
      },
    },
    baseSalary: job.salary
      ? {
          "@type": "MonetaryAmount",
          currency: "INR",
          value: {
            "@type": "QuantitativeValue",
            value: job.salary,
            unitText: "YEAR",
          },
        }
      : undefined,
  };
}
