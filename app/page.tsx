import Navbar from "@/components/navbar";
import ScrollToTop from "@/components/scroll-to-top";
import Profile from "@/components/profile";
import About from "@/components/about";
import Skills from "@/components/skills";
import Projects from "@/components/projects";
import DesignFlow from "@/components/design-flow";
import Designs from "@/components/designs";
import GalleryTeaser from "@/components/gallery-teaser";
import Certifications from "@/components/certifications";
import { Contact } from "@/components/contact";

const faqSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://mylebalidoy.vercel.app/#person",
      "name": "Myle Balidoy",
      "jobTitle": "Digital Designer & UI/UX Designer",
      "description":
        "Digital Designer and UI/UX Designer crafting user-centered, accessible, and inclusive digital experiences.",
      "url": "https://mylebalidoy.vercel.app",
      "image": "https://mylebalidoy.vercel.app/assets/mylepersona.png",
      "sameAs": [
        "https://www.linkedin.com/in/mylebalidoy/",
        "https://www.behance.net/mylebalidoy/",
        "https://github.com/myblduh"
      ],
      "worksFor": {
        "@type": "Organization",
        "name": "Wovlo Studio"
      },
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "National University - Laguna"
      },
      "email": "mailto:mylebalidoy@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Laguna",
        "addressCountry": "PH"
      },
      "award": "1st Runner Up, Enterprise Track - Protothon 2026: The Online UX Hackathon",
      "hasCredential": [
        "User Experience Design Fundamentals (IBM)",
        "Graphic Design Essentials (Canva)",
        "Microsoft UX Design",
        "Microsoft IT Support Specialist",
        "Google Prompting Essentials",
        "Google Agile Essentials"
      ].map((name) => ({
        "@type": "EducationalOccupationalCredential",
        "name": name
      })),
      "knowsAbout": [
        "UI/UX Design",
        "Digital Design",
        "Figma",
        "Design Systems",
        "Wireframing",
        "Prototyping",
        "User Research",
        "Web and Mobile Development",
        "Frontend Development",
        "React",
        "Next.js",
        "Tailwind CSS"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://mylebalidoy.vercel.app/#website",
      "url": "https://mylebalidoy.vercel.app",
      "name": "Myle Balidoy | UI/UX Designer",
      "description":
        "Portfolio of Myle Balidoy, a UI/UX Designer and Digital Designer from Laguna, Philippines.",
      "inLanguage": "en",
      "publisher": { "@id": "https://mylebalidoy.vercel.app/#person" }
    },
    {
      "@type": "ProfilePage",
      "@id": "https://mylebalidoy.vercel.app/#profilepage",
      "url": "https://mylebalidoy.vercel.app",
      "name": "Myle Balidoy | UI/UX Designer",
      "isPartOf": { "@id": "https://mylebalidoy.vercel.app/#website" },
      "mainEntity": { "@id": "https://mylebalidoy.vercel.app/#person" }
    },
    {
      "@type": "FAQPage",
      "@id": "https://mylebalidoy.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who is Myle Balidoy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Myle Balidoy is a Digital Designer and UI/UX Designer based in Laguna, Philippines. Skilled at translating complex requirements into clean, accessible, and user-centered interfaces, she creates responsive digital designs, scalable design systems, and cohesive brand identities."
          }
        },
        {
          "@type": "Question",
          "name": "What is Myle Balidoy's current role?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Myle Balidoy currently works as a Digital Designer at Wovlo Studio (Full-Time, Remote), directing brand identity systems and guidelines, and designing responsive graphics, marketing collateral, and interactive visuals."
          }
        },
        {
          "@type": "Question",
          "name": "What is Myle Balidoy's professional work experience?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Myle's professional experience includes: Digital Designer at Wovlo Studio (Sep. 2026–Present), UI/UX Designer at Blueshift Energy (July 2026–Sep. 2026) creating responsive solar landing pages and Figma design systems, UI/UX Designer Intern at KMC Solutions (Jan. 2026–May 2026) designing responsive web and mobile interfaces, and Data Entry & Design Assistant at Improbable Labs (Sep. 2025–Mar. 2026)."
          }
        },
        {
          "@type": "Question",
          "name": "What is Myle Balidoy's educational background?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Myle holds a Bachelor of Science in Information Technology from National University - Laguna (2022–2026), specializing in Web and Mobile Development."
          }
        },
        {
          "@type": "Question",
          "name": "What design tools and technical skills does Myle Balidoy specialize in?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Myle specializes in UI/UX Design, Wireframing, Interactive Prototyping, Responsive Web Design, Design Systems, and Brand Identity. Her primary tools are Figma, Adobe Creative Cloud, and FigJam. She also has technical frontend development skills in HTML, CSS, JavaScript, TypeScript, React, Next.js, and Tailwind CSS."
          }
        },
        {
          "@type": "Question",
          "name": "What awards and certifications has Myle Balidoy received?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Myle won 1st Runner Up in the Enterprise Track at Protothon 2026: The Online UX Hackathon. She also holds industry certifications including IBM User Experience Design Fundamentals, Canva Graphic Design Essentials, Google Agile Essentials, Google Prompting Essentials, Microsoft UX Design, and Microsoft IT Support Specialist."
          }
        },
        {
          "@type": "Question",
          "name": "What are Myle Balidoy's featured projects?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Her featured projects include Trackify (Fleet Management & Tracking Platform), Payonnect (Digital Wallet and Fintech App), Lakbay Calamba (Tourism & Cultural Heritage Platform), CosMarket (Cosplay Marketplace & Community), Solar Energy Landing Page Redesign (Residential & Commercial), and HealthMate (Healthcare Platform)."
          }
        },
        {
          "@type": "Question",
          "name": "How can I contact or collaborate with Myle Balidoy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can reach Myle via email at mylebalidoy@gmail.com, connect on LinkedIn at https://www.linkedin.com/in/mylebalidoy/, view design projects on Behance at https://www.behance.net/mylebalidoy/, or inspect code repositories on GitHub at https://github.com/myblduh."
          }
        }
      ]
    }
  ]
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <ScrollToTop />
      <div>
        <Profile />
        <DesignFlow />
        <Designs />
        <GalleryTeaser />
        <Projects />
        <About />
        <Skills />
        <Certifications />
        <Contact />
      </div>
    </main>
  );
}
