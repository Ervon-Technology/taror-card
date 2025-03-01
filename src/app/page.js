'use client'
import { useState } from 'react'
import React from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [entered, setEntered] = useState(false)
  const router = useRouter();
  
  // Mouse position for parallax effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-50, 50], [-10, 10])
  const rotateY = useTransform(x, [-50, 50], [-10, 10])
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    x.set(clientX - centerX)
    y.set(clientY - centerY)
  }
  
  return (
    <div>
      <div
        className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden text-white"
        onMouseMove={handleMouseMove}
      >
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://videos.pexels.com/video-files/3194277/3194277-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        
        {/* Main Content Container */}
        <div className="z-10 flex flex-col items-center justify-center w-full max-w-4xl px-4 sm:px-6 md:px-8">
          {/* Title with responsive font sizing */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold chokokutai-regular text-center mb-6 md:mb-8">
            Welcome to Universe Hidden Tarot
          </h1>
          
          {/* Interactive Tarot Card & Message */}
          <div className="relative flex flex-col items-center text-center w-full">
            {/* Subtitle with gradient text */}
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-8 md:mb-10 px-4 drop-shadow-lg chokokutai-regular"
            >
              The universe has chosen to guide you
            </motion.h2>
            
            {/* Enter Button with Hover Effect */}
            <motion.button
              onClick={() => router.push('/reading')}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-purple-600 hover:bg-purple-700 text-white text-base sm:text-lg md:text-xl font-semibold rounded-lg shadow-lg transition"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Unlock the Secrets of Fate
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}