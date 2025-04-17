import Image from "next/image"

export default function About() {
  return (
    <section id="about" className="py-20 px-4 md:px-10 lg:px-40 relative bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <p className="text-center font-semibold text-[#0E6CF3]">Get To Know More</p>
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">About Me</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2 border-gray-100">My Journey</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Hello World! My name is Myle. I'm a 22-year-old web UI/UX designer based in Laguna, Philippines, with a passion for crafting inclusive and easy-to-use digital experiences.
              Currently, I'm a third-year college student pursuing a Bachelor's degree in Information Technology, where I've honed my expertise in front-end development and designing tools.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              I've built projects with clean aesthetics. I'm actively exploring multiple career paths in cybersecurity, data science, and UI/UX design.
              My certifications in Python, CSS, and Cybersecurity (from Cisco and ISC2) reflects on those curiosities.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether it's designing interfaces or securing networks, I thrive on turning ideas into reality. I also enjoy learning more about new technologies. Nice to meet you!
            </p>
          </div>

          {/* Right column - Stats */}
          <div className="flex flex-col gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-md transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-[#0E6CF3]/10 p-3 rounded-full">
                  <Image
                    src="/assets/education.png"
                    alt="education icon"
                    width={24}
                    height={24}
                    className="opacity-80"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Education</h3>
                  <p className="text-gray-600 text-sm">National University - Laguna</p>
                </div>
              </div>
              <p className="text-gray-600">
                B.S. Information Technology <br />
                2022 - Present
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-[#0E6CF3]/10 p-3 rounded-full">
                  <Image
                    src="/assets/experience.png"
                    alt="experience icon"
                    width={24}
                    height={24}
                    className="opacity-80"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
                  <p className="text-gray-600 text-sm">Looking for opportunities.</p>
                </div>
              </div>
              <p className="text-gray-600">
                Open to internships!
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-[#0E6CF3]/10 p-3 rounded-full">
                  <Image
                    src="/assets/experience.png"
                    alt="projects icon"
                    width={24}
                    height={24}
                    className="opacity-80"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
                  <p className="text-gray-600 text-sm">10+ completed projects</p>
                </div>
              </div>
              <p className="text-gray-600">
                Web applications, systems, and design prototypes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
