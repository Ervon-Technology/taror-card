// FormPopup.jsx
'use client'
import axios from 'axios';

import { useState, useEffect } from 'react';
import { X, Sparkles, Mail, User, Calendar, HelpCircle } from 'lucide-react';

export default function FormPopup({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    question: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Add an effect to handle escape key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleOverlayClick = (e) => {
    // Close only if clicking on the overlay itself, not the form
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use axios to call the API directly
      const response = await axios.post('https://send-mail.sahil-ervon.workers.dev/', formData);

      console.log("API Response:", response);

      // Set success and redirect
      setSuccess(true);

      // Redirect after successful submission (with a small delay for feedback)
      // setTimeout(() => {
      //   window.location.href = '/reading';
      // }, 1500);

    } catch (err) {
      console.error('Error submitting form:', err);

      // Extract error message from axios error object
      let errorMessage = 'Failed to submit your information. Please try again.';

      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error data:', err.response.data);
        console.error('Error status:', err.response.status);

        if (err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.status === 429) {
          errorMessage = 'You have made too many requests. Please try again later.';
        } else if (err.response.status === 400) {
          errorMessage = 'Invalid information provided. Please check your details.';
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Error request:', err.request);
        errorMessage = 'No response from server. Please check your connection and try again.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      {/* Center content vertically and make it scrollable */}
      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="bg-gradient-to-br from-purple-900 to-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-purple-500/30 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-20 overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>
          </div>
          <div className="absolute bottom-0 right-0 w-full h-20 overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl"></div>
          </div>

          {/* Close button - fixed to ensure it's clickable */}
          <button
            onClick={handleCloseClick}
            className="absolute top-4 right-4 z-20 text-gray-300 hover:text-white transition-colors p-2 hover:bg-purple-800/30 rounded-full"
            aria-label="Close form"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Form content */}
          <div className="p-6 sm:p-8 relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="p-2 bg-purple-600/30 rounded-full">
                <Sparkles className="w-6 h-6 text-purple-300" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Continue Your Mystical Journey</h2>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-green-300" />
                </div>
                <h3 className="text-xl font-bold text-purple-200 mb-2">Your Path Awaits!</h3>
                <p className="text-gray-300">Redirecting you to the cosmic realm...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <p className="text-gray-300 mb-6">
                  Share your essence with the cosmic forces to receive personalized mystical insights on your journey.
                </p>

                <div className="space-y-1">
                  <label htmlFor="name" className="text-sm text-purple-200 block">Your Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-purple-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-purple-900/30 border border-purple-600/30 text-white rounded-lg block w-full pl-10 p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm text-purple-200 block">Your Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-purple-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-purple-900/30 border border-purple-600/30 text-white rounded-lg block w-full pl-10 p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="dob" className="text-sm text-purple-200 block">Date of Birth</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-purple-400" />
                    </div>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      required
                      value={formData.dob}
                      onChange={handleChange}
                      className="bg-purple-900/30 border border-purple-600/30 text-white rounded-lg block w-full pl-10 p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="question" className="text-sm text-purple-200 block">Your Question</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <HelpCircle className="h-5 w-5 text-purple-400" />
                    </div>
                    <textarea
                      id="question"
                      name="question"
                      rows="4"
                      required
                      value={formData.question}
                      onChange={handleChange}
                      className="bg-purple-900/30 border border-purple-600/30 text-white rounded-lg block w-full pl-10 p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 resize-none"
                      placeholder="What would you like to ask the cosmos?"
                    ></textarea>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-900/40 border border-red-800 rounded-lg text-red-200 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseClick}
                    className="flex-1 px-4 py-2.5 border border-purple-500/50 text-purple-300 rounded-lg hover:bg-purple-800/30 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-purple-700/30"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending
                      </span>
                    ) : (
                      "Continue Journey"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}