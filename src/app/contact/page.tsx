import { Navbar } from "@/components/navbar";
import { ContactHero } from "@/components/contact-hero";
import { ContactGrid } from "@/components/contact-grid";
import { ContactMap } from "@/components/contact-map";
import { Inter } from "next/font/google";
import { constructMetadata, contactPageSchema } from "@/config/seo";

export const metadata = constructMetadata({
    title: "Contact Unifiro Labs | Office in Sindhanur, Raichur, Karnataka",
    description: "Visit or contact Unifiro Labs at our headquarters in Sindhanur, Raichur, Karnataka. Connect with our engineering and growth team for software, AI, and digital platforms.",
    canonical: "/contact",
});

const inter = Inter({ subsets: ["latin"] });

export default function ContactPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
            />
            <main className={`min-h-screen bg-[#0A0A0A] text-white ${inter.className} overflow-x-hidden selection:bg-blue-500/30`}>
                {/* Background Image reused from Product Page */}
                <div
                    className="fixed inset-0 z-0 pointer-events-none"
                    style={{
                        backgroundImage: "url('/productpage/herobg.webp')",
                        backgroundSize: "cover",
                        backgroundPosition: "top center",
                        backgroundAttachment: "fixed",
                        opacity: 0.6
                    }}
                />

                {/* Dark Overlay for readability */}
                <div className="fixed inset-0 z-0 bg-[#0A0A0A]/60 pointer-events-none" />

                <div className="relative z-10">
                    <Navbar />

                    <ContactHero />

                    <ContactGrid />

                    <ContactMap />
                </div>
            </main>
        </>
    );
}
