"use client"

import type React from "react"

import { useState } from "react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const sendMail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // @ts-ignore - EmailJS is loaded from CDN
      const emailjs = window.emailjs

      const params = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      }

      const serviceID = ""
      const templateID = ""

      // Initialize EmailJS if not already initialized
      if (!emailjs.init) {
        emailjs.init({
          publicKey: "",
        })
      }

      await emailjs.send(serviceID, templateID, params)

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })

      alert("Your message sent successfully!!")
    } catch (err) {
      console.error(err)
      alert("Error sending message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-16 px-4 md:px-10 lg:px-40">
      <p className="text-center font-semibold">Get in Touch</p>
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">Contact Me</h1>

      <div className="contact-container max-w-2xl mx-auto">
        <form className="contact-form flex flex-col gap-4" onSubmit={sendMail}>
          <input
            type="text"
            id="name"
            placeholder="Your Name"
            required
            className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E6CF3]"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            id="email"
            placeholder="Your Email"
            required
            className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E6CF3]"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            id="subject"
            placeholder="Subject"
            required
            className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E6CF3]"
            value={formData.subject}
            onChange={handleChange}
          />
          <textarea
            id="message"
            placeholder="Your Message"
            required
            className="p-4 border border-gray-300 rounded-lg h-40 resize-y focus:outline-none focus:ring-2 focus:ring-[#0E6CF3]"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          <button
            type="submit"
            className="submit-btn w-full md:w-1/4 mx-auto py-4 px-6 bg-[#0E6CF3] text-white rounded-full font-semibold transition-colors hover:bg-[#05439e] disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  )
}
