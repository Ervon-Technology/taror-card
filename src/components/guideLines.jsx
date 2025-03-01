// src/components/guideLines.jsx

"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const guideContent = [
  {
    heading: "How you feel about yourself now",
    subheading: "Self-reflection and awareness",
    text: "This card reveals your current state of mind and emotions about your life situation.",
  },
  {
    heading: "What you most want at this moment",
    subheading: "Your desires and aspirations",
    text: "This represents what you deeply wish for right now, consciously or subconsciously.",
  },
  {
    heading: "Your fears",
    subheading: "Concerns and uncertainties",
    text: "This highlights your biggest fears that may be holding you back from progress.",
  },
  {
    heading: "What is going for you",
    subheading: "Your strengths and advantages",
    text: "This card shows the factors currently working in your favor to help you achieve your goals.",
  },
  {
    heading: "What is going against you",
    subheading: "Challenges and obstacles",
    text: "This highlights the struggles, difficulties, or roadblocks you may be facing.",
  },
  {
    heading: "The outcome",
    subheading: "Future possibilities",
    text: "Based on your current situation, this card reveals the most likely result.",
  },
];

function GuideLines() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(false);

  const nextSlide = () => {
    try {
      if (currentIndex < guideContent.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setError(false);
      } else {
        setCurrentIndex(0);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setError(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 p-6 lg:p-12 bg-gradient-to-b">
      {/* Left Section - Provided Content */}
      <div className="w-full lg:w-1/2 bg-white/90 rounded-xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 font-serif">0X17 World Famous Universal 6 Card Spread</h2>
        <div className="h-1 w-32 bg-gradient-to-r from-gray-500 to-gray-500 rounded-full mt-2"></div>
        
        <p className="text-lg text-gray-800 mt-6 font-medium">
          6 cards from the Major Arcana
        </p>
        
        <p className="text-gray-700 mt-2">
          This is a good reading to simply "get a snapshot" of how things are with you generally, at this moment in time.
        </p>
        
        <p className="text-gray-700 mt-2">
          It can also be used to answer specific questions and has been consulted over 200 million times since Lotus Tarot was launched in 2002.
        </p>
        
        <p className="text-gray-800 font-semibold mt-6">The card positions represent:</p>
        
        <ul className="list-disc list-inside mt-3 space-y-2 text-gray-700 text-lg pl-4">
          <li>How you feel about yourself now</li>
          <li>What you most want at this moment</li>
          <li>Your fears</li>
          <li>What is going for you</li>
          <li>What is going against you</li>
          <li>The outcome according to your current situation or the question you asked</li>
        </ul>
        
        <p className="text-gray-700 mt-6 italic border-l-4 border-gray-300 pl-4">
          Don't be fooled by the brevity and simplicity of the responses or by the fact it is a Major Arcana-only reading.
          This reading has stood the test of time and proven itself again and again to millions of users.
        </p>
      </div>

      {/* Right Section - Card Slider */}
      <div className="w-full lg:w-1/2">
        <div className="bg-white/90 rounded-xl shadow-lg p-6 border border-gray-200 relative">
          <div className="mb-6 pb-2 border-b border-gray-100">
            <span className="text-sm text-gray-600 font-medium">Card {currentIndex + 1} of {guideContent.length}</span>
          </div>
          
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-center font-medium text-lg">{error}</p>
              <button 
                onClick={() => setError(false)}
                className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm"
              >
                Dismiss
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-serif font-bold text-gray-900">{guideContent[currentIndex].heading}</h3>
              <h4 className="text-lg text-gray-600 italic mt-1">{guideContent[currentIndex].subheading}</h4>
              <p className="text-gray-700 mt-2 text-lg">{guideContent[currentIndex].text}</p>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevSlide}
              className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all ${
                currentIndex === 0 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
            
            <button
              onClick={nextSlide}
              className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-600 text-white rounded-lg shadow-md transition hover:from-gray-700 hover:to-gray-700 flex items-center gap-2"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress indicator */}
          <div className="w-full bg-gray-200 h-1 mt-6">
            <div 
              className="h-1 bg-gradient-to-r from-gray-500 to-gray-500 transition-all duration-300 ease-in-out" 
              style={{ width: `${((currentIndex + 1) / guideContent.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuideLines;
