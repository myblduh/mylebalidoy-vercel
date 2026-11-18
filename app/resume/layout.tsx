import type React from "react";
import type { Metadata } from "next";

const SITE_URL = "https://mylebalidoy.vercel.app";
const DESCRIPTION =
  "Resume of Myle Balidoy, UI/UX Designer and Digital Designer. Work experience at Wovlo Studio, Blueshift Energy, and KMC Solutions; B.S. Information Technology (National University - Laguna); Protothon 2026 1st Runner Up; and certifications from Google, Microsoft, IBM, and Cisco.";

export const metadata: Metadata = {
  title: "Resume",
  description: DESCRIPTION,
  alternates: { canonical: "/resume" },
  openGraph: {
    type: "profile",
    url: `${SITE_URL}/resume`,
    title: "Resume | Myle Balidoy",
    description: DESCRIPTION,
    images: [
      {
        url: "/assets/mylepersona.png",
        alt: "Myle Balidoy, UI/UX Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume | Myle Balidoy",
    description: DESCRIPTION,
    images: ["/assets/mylepersona.png"],
  },
};

const resumeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/resume#profilepage`,
      url: `${SITE_URL}/resume`,
      name: "Resume | Myle Balidoy",
      description: DESCRIPTION,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Resume",
          item: `${SITE_URL}/resume`,
        },
      ],
    },
  ],
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resumeSchema) }}
      />
      {children}
    </>
  );
}
