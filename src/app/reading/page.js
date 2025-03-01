// src/app/reading/page.js

import Footer from '@/components/footer'
import GuideLines from '@/components/guideLines'
import Navbar from '@/components/Navbar'
import TarotCardSpread from '@/components/tarotCardSpread'
import React from 'react'

export default function page() {
  return (
    <div>
        <Navbar />
          <div className='py-14'>
            <div className='text-center'>
              <h1 className='text-4xl font-bold chokokutai-regular'>Unlock the Secrets of the Tarot</h1>
              <p className='text-2xl text-gray-200 mt-2'>
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
