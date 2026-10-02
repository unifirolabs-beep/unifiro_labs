import { constructMetadata, careerPageSchema } from "@/config/seo";
import { CareerClient } from "@/components/career-client";

export const metadata = constructMetadata({
    title: "Careers",
    description: "Explore career opportunities at Unifiro Labs. Join passionate professionals dedicated to technology innovation, growth, and community impact.",
    canonical: "/more",
});

export default function More() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(careerPageSchema) }}
            />
            <CareerClient />
        </>
    );
}
