import React from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";

function Footer() {
    return (
        <footer className="bg-[#484848] text-white py-6">
            <div className="container mx-auto px-4">
                {/* Main Footer Content */}
                <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-4 md:space-y-0">
                    {/* Left Section */}
                    <div>
                        <h2 className="text-lg font-semibold">Mystic Tarot Insights</h2>
                        <p className="text-sm text-gray-400">© {new Date().getFullYear()} All Rights Reserved.</p>
                    </div>

                    {/* Disclaimer Link */}
                    <div>
                        <Link href="/disclamer" className="text-gray-300 hover:text-white underline">
                            Disclaimer
                        </Link>
                    </div>

                    {/* Social Media */}
                    <div className="flex justify-center md:justify-end">
                        <a 
                            href="https://www.instagram.com/universehiddentarot?igsh=bHhsNWljbDU4NGpt&utm_source=website" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            <Instagram size={24} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
