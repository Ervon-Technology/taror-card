import React from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";

function Footer() {
    return (
        <footer className="bg-[#484848] text-white py-6">
            <div className="container mx-auto px-4">
                {/* Main Footer Content */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                    {/* Left Section */}
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <h2 className="text-lg font-semibold">Mystic Tarot Insights 0(17times).com</h2>
                        <p className="text-sm text-gray-400">© {new Date().getFullYear()} All Rights Reserved.</p>
                    </div>

                    {/* Social Media */}
                    <div className="flex items-center space-x-4">
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

                {/* Disclaimer */}
                <div className="border-t border-gray-700 pt-4 mt-4 text-center">
                    <p className="text-xs text-gray-400 max-w-2xl mx-auto">
                        Disclaimer: Tarot readings are for entertainment purposes only. 
                        They are not a substitute for professional advice, 
                        medical diagnosis, or legal counsel. 
                        The insights provided are interpretative and should be 
                        approached with personal discretion and critical thinking.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;