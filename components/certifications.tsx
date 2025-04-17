"use client"

import { useState } from "react"
import Image from "next/image"
import Imagebox from "./ui/imagebox"

export default function Certifications() {
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    imageSrc: "",
    imageAlt: "",
  })

  const [showAll, setShowAll] = useState(false)

  const openLightbox = (src: string, alt: string) => {
    setLightbox({
      isOpen: true,
      imageSrc: src,
      imageAlt: alt,
    })
  }

  const closeLightbox = () => {
    setLightbox({
      ...lightbox,
      isOpen: false,
    })
  }

  const toggleShowAll = () => {
    setShowAll(!showAll)
  }

  const certifications = [
    {
      title: "ISC2 Candidate",
      image: "/assets/certs/1.png",
      description:
        "ISC2 Candidates are individuals pursuing or considering a cybersecurity certification. They have agreed to adhere to the ISC2 Code of Ethics and are committed to the highest standards of professional conduct.",
      issuer: "ISC2",
      date: "September 2024",
      links: [{ text: "View", url: "https://www.credly.com/badges/da3bb058-feeb-4ede-83fd-68aa50493f96/linked_in_profile" }],
      skills: ["Cybersecurity"],
    },
    {
      title: "IT Specialist - Network Security",
      image: "/assets/certs/2.png",
      description:
        "Demonstrated foundational security knowledge and skills, including an understanding of core security principles operating system security, network and device security, and secure computing practices.",
      issuer: "Certiport",
      date: "February 2025",
      links: [{ text: "View", url: "https://www.credly.com/badges/dc7617b6-0224-4801-8568-c44eefff77f3/linked_in_profile" }],
      skills: ["Network Security", "Operating System"],
    },
    {
      title: "Cyber Threat Management",
      image: "/assets/certs/7.jpg",
      description:
        "Completed the course with an understanding of the fundamentals of cyber threat management, including threat intelligence, incident response, and risk assessment.",
      issuer: "Cisco Networking Academy",
      date: "April 2025",
      links: [{ text: "View", url: "https://www.credly.com/badges/e5252d39-a224-473a-86d0-4ff5d17cef96/linked_in_profile" }],
      skills: ["JavaScript", "CSS", "HTML"],
    },
    {
      title: "Python Basics",
      image: "/assets/certs/6.jpg",
      description:
        "Passed the certification test on Python foundations, including data types, control structures, functions, and modules.",
      issuer: "HackerRank",
      date: "April 2025",
      links: [{ text: "View", url: "https://www.hackerrank.com/certificates/784ac6df023f" }],
      skills: ["Python"]
    },
    {
      title: "CSS Basics",
      image: "/assets/certs/5.jpg",
      description:
        "Passed the certification test which includes topics on Cascading and Inheritance, styling fundamentals, use of layouts, and boxing of elements.",
      issuer: "HackerRank",
      date: "April 2025",
      links: [{ text: "View", url: "https://www.hackerrank.com/certificates/7dca93b72123" }],
      skills: ["CSS", "HTML"],
    },
    {
      title: "Introduction to Cybersecurity",
      image: "/assets/certs/4.jpg",
      description:
        "Completed the course with an introductory knowledge of cybersecurity, including the global implications of cyber threats on industries, and why cybersecurity is a growing profession.",
      issuer: "Cisco Networking Academy",
      date: "April 2025",
      links: [{ text: "View", url: "https://www.credly.com/badges/969c36ef-f7c6-4430-b232-bc7d6c57279b/linked_in_profile" }],
      skills: ["Cybersecurity", "Networking"],
    },
    {
      title: "IT Customer Support Basics",
      image: "/assets/certs/3.png",
      description:
        "Demonstrated fundamentals of IT customer support, including the importance of customer service, communication skills, and problem-solving techniques.",
      issuer: "Google via Coursera",
      date: "April 2025",
      links: [{ text: "View", url: "https://www.credly.com/badges/f59861a2-85ee-460c-b868-86538868df3d/public_url" }],
      skills: ["Customer Service", "Problem Solving"],
    }
  ]

  const displayedCertifications = showAll ? certifications : certifications.slice(0, 3)

  return (
    <section id="certifications" className="py-16 px-4 md:px-10 lg:px-40">
      <p className="text-center font-semibold">Explore My</p>
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">Certifications</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {displayedCertifications.map((cert, index) => (
          <div
            key={index}
            className="project-card bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg flex flex-col h-full"
          >
            <div
              className="relative w-full h-48 mb-4 cursor-pointer overflow-hidden rounded-lg"
              onClick={() => openLightbox(cert.image, cert.title)}
            >
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="text-transparent hover:text-white font-medium transition-colors">View Image</span>
              </div>
              <Image
                src={cert.image || "/placeholder.svg"}
                alt={cert.title}
                fill
                className="rounded-lg object-cover transition-transform hover:scale-105"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{cert.title}</h3>
            <p className="text-sm text-gray-600 mb-1">{cert.description}</p>
            <p className="text-sm font-medium text-gray-700 mb-1">Issuer: {cert.issuer}</p>
            <p className="text-sm text-gray-500 mb-4">Date: {cert.date}</p>

            <div className="project-links flex gap-2 mb-3">
              {cert.links?.map((link, linkIndex) => (
                <a
                  key={linkIndex}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-[#0E6CF3] text-white rounded-md text-sm transition-colors hover:bg-[#05439e] no-underline"
                >
                  {link.text}
                </a>
              ))}
            </div>

            <div className="skill_list flex flex-wrap gap-1.5 mt-auto">
              {cert.skills.map((skill, skillIndex) => (
                <div
                  key={skillIndex}
                  className="skill_item bg-gray-50 px-2 py-1 rounded-full text-xs text-gray-700 border border-gray-100"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less button */}
      {certifications.length > 3 && (
        <div className="text-center mt-8">
          <button
            onClick={toggleShowAll}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors duration-300 font-medium"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}

      {/* Image Lightbox */}
      <Imagebox
        src={lightbox.imageSrc || "/placeholder.svg"}
        alt={lightbox.imageAlt}
        isOpen={lightbox.isOpen}
        onClose={closeLightbox}
      />
    </section>
  )
}
