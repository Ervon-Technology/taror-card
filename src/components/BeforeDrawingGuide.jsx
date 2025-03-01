"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function BeforeDrawingGuide({ onProceed }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleProceed = () => {
    setIsVisible(false);
    if (onProceed) onProceed();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex justify-center items-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white max-w-lg p-6 rounded-2xl shadow-xl text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-900">🔮 Get Ready to Draw Your Cards</h2>
            <p className="text-gray-700 mt-2">Follow these steps for a focused and meaningful reading.</p>
            
            <ul className="text-left mt-4 space-y-3 text-gray-800">
              <li>✨ Find a quiet, comfortable space.</li>
              <li>🎯 Set a clear intention or question.</li>
              <li>🌿 Take deep breaths to relax.</li>
              <li>🔄 Visualize yourself shuffling the deck.</li>
              <li>✨ Trust your intuition when selecting cards.</li>
            </ul>

            <motion.button
              onClick={handleProceed}
              className="mt-6 bg-gray-800 text-white px-6 py-2 rounded-full text-lg font-medium hover:bg-gray-900 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              I'm Ready ✨
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BeforeDrawingGuide;
