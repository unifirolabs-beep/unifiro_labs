import { constructMetadata } from "@/config/seo";
import { HomeClient } from "@/components/home-client";

export const metadata = constructMetadata({
  title: "Unifiro Labs | Custom Software, AI Systems & Brand Growth in Karnataka & India",
  description: "Unifiro Labs builds innovative technology solutions, custom software, AI-powered systems, and strategic brand foundations across Bengaluru, Mysore, Mangalore, Hubli-Dharwad, and nationwide.",
  canonical: "/",
});

export default function Page() {
  return <HomeClient />;
}