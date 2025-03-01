'use client'

import { useState } from 'react'
import Footer from '@/components/footer'
import GuideLines from '@/components/guideLines'
import Navbar from '@/components/navbar'
import TarotCardSpread from '@/components/tarotCardSpread'
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
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://videos.pexels.com/video-files/3194277/3194277-hd_1920_1080_30fps.mp4" type="video/mp4" />
          </video>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className='z-10 text-6xl font-bold chokokutai-regular text-center'>Welcome to Universe Hidden Tarot </div>
          {/* Interactive Tarot Card & Message */}
          <div className="relative z-10 flex flex-col items-center text-center  p-8">
            {/* Tarot Card with Parallax Effect */}


            <motion.h1
              className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mt-6 px-6 max-w-md mb-5 drop-shadow-lg chokokutai-regular"

            >
              The universe has chosen to guide you
            </motion.h1>

            {/* Enter Button with Hover Effect */}
            <motion.button
              onClick={() => router.push('/reading')}
              className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold rounded-lg shadow-lg transition"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              Unlock the Secrets of Fate
            </motion.button>
          </div>
        </div>
    
    </div>
  )
}
