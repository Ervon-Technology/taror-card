// src/components/footer.jsx

import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-[#484848] text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Left Section */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold">Company</h2>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} All Rights Reserved.</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center md:justify-end mt-4 md:mt-0">
          {/* <Link href="/aboutPage1" className="px-4 py-2 text-gray-300 hover:text-white">About</Link>
          <Link href="/contact" className="px-4 py-2 text-gray-300 hover:text-white">Contact</Link>
          <Link href="/privacy-policy" className="px-4 py-2 text-gray-300 hover:text-white">Privacy Policy</Link> */}
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
