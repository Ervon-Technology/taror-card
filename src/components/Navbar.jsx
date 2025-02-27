// /src/components/Navbar.jsx

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#484848] p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">0(17times).com</h1>
        <ul className="flex space-x-4">
          {/* <li><Link href="/" className="text-white hover:underline">Home</Link></li>
          <li><Link href="/about" className="text-white hover:underline">About</Link></li>
          <li><Link href="/contact" className="text-white hover:underline">Contact</Link></li> */}
        </ul>
      </div>
    </nav>
  );
}


