import type { Metadata } from "next";

export const siteConfig = {
  name: "Unifiro Labs",
  legalName: "Unifiro Labs",
  description: "Innovative Tech & Brand Growth Systems. We build high-impact digital platforms, AI-powered systems, and technology solutions to scale modern brands.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://unifirolabs.com",
  ogImage: "/unifirolabs.png",
  email: "info@unifirolabs.com",
  phone: "+91 91588 57575",
  telephone: "+919158857575",
  address: {
    streetAddress: "Block No:03, QQC4+3CM Venkata Rao Colony, KSRTC Bus Stand, Venkateshwara Colony, Sindhnur Rural",
    addressLocality: "Sindhanur",
    addressRegion: "Karnataka",
    postalCode: "584128",
    addressCountry: "IN",
  },
  geo: {
    latitude: 15.7711493,
    longitude: 76.7520923,
  },
  mapsUrl: "https://maps.google.com/?cid=3325881476901863239",
  mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.747805188847!2d76.7520923!3d15.7711493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb7eb80da46896d%3A0x2e27d0b2f764ff47!2sUnifirolabs!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  links: {
    linkedin: "https://linkedin.com/company/unifirolabs",
    twitter: "https://twitter.com/unifirolabs",
    github: "https://github.com/unifirolabs",
    instagram: "https://www.instagram.com/unifirolabs",
  },
  keywords: [
    "Unifiro Labs",
    "Unifiro Labs Sindhanur",
    "Unifiro Labs Raichur",
    "Unifiro",
    "Unifirolabs",
    "Brand Growth Systems",
    "Tech Innovation",
    "Custom Software Engineering",
    "AI Integration",
    "AI-powered systems",
    "Web Application Development",
    "Software company in Sindhanur",
    "Tech company in Sindhanur",
    "Web development company in Sindhanur",
    "IT company in Sindhanur",
    "Tech startup in Sindhanur",
    "Digital marketing agency in Sindhanur",
    "Social media marketing agency in Sindhanur",
    "Video editing agency in Sindhanur",
    "Software company in Raichur",
    "Tech company in Raichur",
    "Web development agency in Raichur",
    "Digital marketing agency in Raichur",
    "Social media marketing agency in Raichur",
    "Video editing agency in Raichur",
    "IT company in Raichur",
    "Tech startup in Raichur",
    "Software companies in Karnataka",
    "Startups in Karnataka",
    "Startups in Bangalore",
    "Startups in India",
    "India Tech Startup",
    "video editing agency",
    "video editing services",
    "video editing company",
    "social media marketing agency",
    "social media marketing agency in India",
    "social media marketing agency in Karnataka",
    "social media marketing agency in Bangalore",
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
    other: {
      "geo.region": "IN-KA",
      "geo.placename": "Sindhanur, Raichur, Karnataka, India",
      "geo.position": `${siteConfig.geo.latitude};${siteConfig.geo.longitude}`,
      "ICBM": `${siteConfig.geo.latitude}, ${siteConfig.geo.longitude}`,
    },
  };
}

// JSON-LD Schemas
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  url: siteConfig.url,
  logo: `${siteConfig.url}/unifirolabs.png`,
  email: siteConfig.email,
  telephone: siteConfig.telephone,
  sameAs: [
    siteConfig.links.linkedin,
    siteConfig.links.twitter,
    siteConfig.links.github,
    siteConfig.links.instagram,
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.streetAddress,
    addressLocality: siteConfig.address.addressLocality,
    addressRegion: siteConfig.address.addressRegion,
    postalCode: siteConfig.address.postalCode,
    addressCountry: siteConfig.address.addressCountry,
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    telephone: siteConfig.telephone,
    email: siteConfig.email,
    availableLanguage: ["English", "Kannada", "Hindi", "Telugu"],
  },
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": `${siteConfig.url}/#localbusiness`,
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  url: siteConfig.url,
  logo: `${siteConfig.url}/unifirolabs.png`,
  image: `${siteConfig.url}/unifirolabs.png`,
  description: siteConfig.description,
  telephone: siteConfig.telephone,
  email: siteConfig.email,
  priceRange: "$$",
  currenciesAccepted: "INR, USD",
  paymentAccepted: "Cash, Credit Card, Bank Transfer, UPI",
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.streetAddress,
    addressLocality: siteConfig.address.addressLocality,
    addressRegion: siteConfig.address.addressRegion,
    postalCode: siteConfig.address.postalCode,
    addressCountry: siteConfig.address.addressCountry,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: siteConfig.geo.latitude,
    longitude: siteConfig.geo.longitude,
  },
  hasMap: siteConfig.mapsUrl,
  sameAs: [
    siteConfig.links.linkedin,
    siteConfig.links.twitter,
    siteConfig.links.github,
    siteConfig.links.instagram,
  ],
  areaServed: [
    {
      "@type": "City",
      name: "Sindhanur",
    },
    {
      "@type": "AdministrativeArea",
      name: "Raichur",
    },
    {
      "@type": "AdministrativeArea",
      name: "Karnataka",
    },
    {
      "@type": "City",
      name: "Bengaluru",
    },
    {
      "@type": "Country",
      name: "India",
    },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "20:00",
    },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    telephone: siteConfig.telephone,
    email: siteConfig.email,
    availableLanguage: ["English", "Kannada", "Hindi", "Telugu"],
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
    "@type": "LocalBusiness",
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: siteConfig.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.addressCountry,
    },
  },
  areaServed: [
    "Sindhanur",
    "Raichur",
    "Karnataka",
    "Bengaluru",
    "India",
    "Global",
  ],
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
  description: `Get in touch with ${siteConfig.name} at our office in Sindhanur, Raichur, Karnataka. Reach out for custom software, AI integration, and digital growth systems.`,
  mainEntity: localBusinessSchema,
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
