import Navbar from "@/components/navbar";
import Profile from "@/components/profile";
import About from "@/components/about";
import Skills from "@/components/skills";
import Projects from "@/components/projects";
import Designs from "@/components/designs";
import Certifications from "@/components/certifications";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div>
        <Profile />
        <Designs />
        <Projects />
        <About />
        <Skills />
        <Certifications />
        <Contact />
      </div>
    </main>
  );
}
