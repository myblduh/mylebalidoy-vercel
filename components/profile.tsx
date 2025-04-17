"use client"

import Image from "next/image"

export default function Profile() {
  return (
    <section id="profile" className="py-12 px-4">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">
        <div className="flex flex-col md:flex-row items-center justify-center w-full gap-4 md:gap-2">
          <div className="w-full max-w-[400px] flex justify-center">
            <div className="relative w-[400px] h-[400px]">
              <Image src="/assets/Profile.png" alt="Profile Picture" fill className="object-contain" />
            </div>
          </div>

          <div className="w-full max-w-[500px] text-center md:text-center">
            <p className="font-semibold">Hello, I'm</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Myle Balidoy</h1>
            <p className="text-base mb-4">Aspiring UI/UX Designer</p>
            <div className="flex justify-center md:justify-center gap-4 flex-wrap">
              <button
                className="btn font-semibold py-4 px-6 w-40 rounded-full border border-[rgb(53,53,53)] bg-[rgb(53,53,53)] text-white hover:bg-black transition-all duration-300"
                onClick={() => window.open("/assets/Tandang_CV.pdf")}
              >
                Download CV
              </button>
              <button
                className="btn font-semibold py-4 px-6 w-40 rounded-full border border-[rgb(53,53,53)] bg-transparent hover:bg-[rgb(53,53,53)] hover:text-white hover:border-white transition-all duration-300"
                onClick={() => {
                  const contactSection = document.getElementById("contact")
                  contactSection?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Contact Me
              </button>
            </div>
            <div className="flex justify-center md:justify-center mt-4 gap-4">
              <Image
                src="/assets/linkedin.png"
                alt="LinkedIn Profile"
                width={32}
                height={32}
                className="cursor-pointer"
                onClick={() => window.open("https://www.linkedin.com/in/mylebalidoy/", "_blank")}
              />
              <Image
                src="/assets/github.png"
                alt="GitHub Profile"
                width={32}
                height={32}
                className="cursor-pointer"
                onClick={() => window.open("https://github.com/myblduh", "_blank")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
