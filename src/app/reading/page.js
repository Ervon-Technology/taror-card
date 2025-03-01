// src/app/reading/page.js

import Footer from '@/components/footer'
import GuideLines from '@/components/guideLines'
import Navbar from '@/components/navbar'
import TarotCardSpread from '@/components/tarotCardSpread'
import React from 'react'

export default function page() {
  return (
    <div>
        <Navbar />
          <div className='py-14'>
            <div className='text-center'>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-8 md:mb-10 px-4 drop-shadow-lg chokokutai-regular">Unlock the Secrets of the Tarot</h1>
              <p className='text-lg md:text-2xl text-gray-200 md:mt-2'>
              Ask your queston and choose six card from below card deck
              </p>
            </div>
          </div>
          <TarotCardSpread />
          <GuideLines />
          <Footer />
    </div>
  )
}
