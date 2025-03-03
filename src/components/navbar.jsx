import Link from 'next/link';
import { Instagram, Mail } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="bg-[#484848] p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Clickable Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <h1 className="text-white text-xl font-bold cursor-pointer hover:text-purple-300 transition-colors">
                        0(17times).com
                    </h1>
                </Link>

                {/* Social Media Icons */}
                <div className="flex items-center space-x-4">
                    {/* Instagram Link */}
                    {/* <a 
                        href="https://www.instagram.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white hover:text-purple-300 transition-colors"
                    >
                        <Instagram size={24} />
                    </a> */}

                    {/* Gmail Link */}
                    <a 
                        href="mailto:Spearheadinnovations@gmail.com" 
                        className="text-white hover:text-purple-300 transition-colors"
                    >
                        <Mail size={24} />
                    </a>
                </div>
            </div>
        </nav>
    );
}