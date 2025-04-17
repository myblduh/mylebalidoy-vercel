"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Imagebox from "./ui/imagebox"

export default function Projects() {
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

  const projects = [
    {
      title: "SpendSmart: A Budget and Expenses Management System",
      image: "/assets/spendsmart.png",
      description:
        "SpendSmart is a web application designed to help college students manage their finances effectively. It offers features like budget creation, expense tracking, expense reports, and easy-to-use management.",
      // links: [{ text: "GitHub", url: "https://github.com/" }],
        skills: ["AWS", "Apache", "PHP", "JavaScript", "MySQL", "HTML", "CSS"]
    },
    {
      title: "HotelOps: Operational Excellence for Accommodations",
      image: "/assets/hoteru.png",
      description:
        "HotelOps is a web application that aims to streamline hotel operations. Features include user management, room and facility information, an event calendar, booking and cancellation management, and secure payment processing.",
      // links: [{ text: "GitHub", url: "https://github.com/" }],
      skills: ["PHP", "Workbench", "MySQL", "HTML", "CSS"]
    },
    {
      title: "Journal Whispers: A Digital Memoir",
      image: "/assets/journal.png",
      description:
        "This is a mobile application designed to help users capture and document their life's moments. It features a built-in database for easy management of journal entries and multimedia support for personalization.",
      // links: [{ text: "GitHub", url: "https://github.com/" }],
      skills: ["Kotlin", "SQL", "Android Studio"]
    },
    {
      title: "The Recipe Room: A Recipe Repository",
      image: "/assets/recipe.png",
      description:
        "The Recipe Room is a web application designed to be a central repository for storing, organizing, and sharing recipes. Users can browse through a collection of recipes and search for specific ones based on keywords, categories, and ingredients.",
      // links: [{ text: "GitHub", url: "https://github.com/" }],
      skills: ["Next.js", "JavaScript", "SCSS", "Figma"]
    },
    {
      title: "NoteMate: Notes and Class Sharing",
      image: "/assets/notemate.png",
      description:
        "NoteMate is a flexible web application meant to make students and instructors have easier learning experiences. This feature-rich tool allows users to upload and study materials, create, and collaborate on shared material.",
      // links: [{ text: "GitHub", url: "https://github.com/" }],
      skills: ["JavaScript", "HTML", "CSS"]
    },
    {
      title: "S&V Manager: Supply and Vendor Management System",
      image: "/assets/sv.png",
      description:
        "S&V Manager is a web application designed to streamline and optimize supply chain and vendor management processes. This system aims to provide a centralized platform for businesses to efficiently manage their suppliers, inventory, and purchase orders.",
      skills: ["PHP", "HTML", "MySQL", "Workbench"]
    },
    {
      title: "NU-L Building Using Python Turtle",
      image: "/assets/building.png",
      description:
        "This is a Python program that utilizes the Turtle graphics library to create a digital visualization of the NU-L Building. The program draws lines, shapes, and colors to depict the building's structure, features, and overall appearance.",
      skills: ["Python"]
    },
    {
      title: "PayDay: Employee Payroll Management System",
      image: "/assets/payday.png",
      description:
        "PayDay is a Java-based application designed to streamline and automate payroll processes for business companies. It efficiently stores and manages employee information, including personal details and salary structures.",
      skills: ["Java"]
    },
  ]

  const displayedProjects = showAll ? projects : projects.slice(0, 3)

  return (
    <section id="projects" className="py-16 px-4 md:px-10 lg:px-40">
      <p className="text-center font-semibold">Explore My</p>
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">Projects</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {displayedProjects.map((project, index) => (
          <div
            key={index}
            className="project-card bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg flex flex-col h-full"
          >
            <div
              className="relative w-full h-48 mb-4 cursor-pointer overflow-hidden rounded-lg"
              onClick={() => openLightbox(project.image, project.title)}
            >
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="text-transparent hover:text-white font-medium transition-colors">View Image</span>
              </div>
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                fill
                className="rounded-lg object-cover transition-transform hover:scale-105"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{project.title}</h3>
            <p className="text-sm text-gray-600 mb-4 flex-grow">{project.description}</p>

            {/* <div className="project-links flex gap-2 mb-3">
              {project.links.map((link, linkIndex) => (
                <Link
                  key={linkIndex}
                  href={link.url}
                  target="_blank"
                  className="px-3 py-2 bg-[#0E6CF3] text-white rounded-md text-sm transition-colors hover:bg-[#05439e] no-underline"
                >
                  {link.text}
                </Link>
              ))}
            </div> */}

            <div className="skill_list flex flex-wrap gap-1.5 mt-auto">
              {project.skills.map((skill, skillIndex) => (
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

      {projects.length > 3 && (
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
