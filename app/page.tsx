import Navbar from "@/components/navbar"
import Profile from "@/components/profile"
import About from "@/components/about"
import Skills from "@/components/skills"
import Projects from "@/components/projects"
import Designs from "@/components/designs"
import Certifications from "@/components/certifications"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import MobileNav from "@/components/mobile-nav"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <MobileNav />
      <div className="pt-20">
        <Profile />
        <About />
        <Skills />
        <Certifications />
        <Projects />
        <Designs />
        <Contact />
        <Footer />
      </div>
    </main>
  )
}
