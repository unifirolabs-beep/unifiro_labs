import { constructMetadata } from "@/config/seo";
import { HomeClient } from "@/components/home-client";

export const metadata = constructMetadata({
  title: "Unifiro Labs | Custom Software, AI Systems & Brand Growth in Sindhanur, Raichur & Karnataka",
  description: "Unifiro Labs is a technology innovation and software company based in Sindhanur, Raichur, Karnataka. We engineer high-impact custom software, AI-powered systems, and strategic brand foundations across Karnataka and nationwide.",
  canonical: "/",
});

export default function Page() {
  return <HomeClient />;
}