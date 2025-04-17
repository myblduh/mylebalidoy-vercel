"use client"

import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-8 px-4 text-center mt-16">
      <div className="footer-container max-w-6xl mx-auto px-4">
        <div className="social-icons flex justify-center gap-6 mb-4">
          <Image
            src="/assets/linkedin.png"
            alt="LinkedIn"
            width={32}
            height={32}
            className="cursor-pointer transition-transform duration-300 hover:scale-110"
            onClick={() => window.open("https://www.linkedin.com/in/mylebalidoy/", "_blank")}
          />
          <Image
            src="/assets/email.png"
            alt="Email"
            width={32}
            height={32}
            className="cursor-pointer transition-transform duration-300 hover:scale-110"
            onClick={() => (window.location.href = "mailto:mylebalidoy@gmail.com")}
          />
          <Image
            src="/assets/github.png"
            alt="GitHub"
            width={32}
            height={32}
            className="cursor-pointer transition-transform duration-300 hover:scale-110"
            onClick={() => window.open("https://github.com/myblduh", "_blank")}
          />
        </div>
        <p className="copyright text-gray-600 text-sm">© 2025 Myle Balidoy. All rights reserved.</p>
      </div>
    </footer>
  )
}
