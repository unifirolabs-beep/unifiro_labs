import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "sonner";
import { constructMetadata, organizationSchema, websiteSchema, localBusinessSchema } from "@/config/seo";

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema, localBusinessSchema]),
          }}
        />
      </head>
      <body className="p-0 m-0 bg-black">
        {children}
        <SiteFooter />
        <Toaster position="top-right" theme="dark" richColors />
      </body>
    </html>
  );
}
