'use client'

import { useParams } from 'next/navigation';
import { tarotCards } from '@/app/tarotCards';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Share2, Home, Info, ArrowLeft, Mail, Star, Sparkles } from 'lucide-react';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import FormPopup from '@/components/FormPopup'; // Import the new FormPopup component

export default function ReadingPage() {
    
    const params = useParams();
    const router = useRouter();
    const readingCode = params?.number || '';

    const [readingCards, setReadingCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shareMessage, setShareMessage] = useState('');
    const [showForm, setShowForm] = useState(false); // New state for controlling form visibility

    // Card positions and meanings
    const cardPositions = [
        "How you feel about yourself now",
        "What you most want at this moment",
        "Your fears",
        "What is going for you",
        "What is going against you",
        "The outcome"
    ];

    useEffect(() => {
        // Set a timeout to prevent indefinite loading
        const loadingTimeout = setTimeout(() => {
            if (loading) {
                setError("Loading took too long. Please try again.");
                setLoading(false);
            }
        }, 10000); // 10 seconds timeout

        // Parse the reading code to extract card information
        const parseReadingCode = (code) => {
            try {
                // Check if the code is valid (should be groups of 3 digits)
                if (code.length % 3 !== 0) {
                    throw new Error("Invalid reading code format");
                }

                // Break the code into groups of 3 and parse each
                const cards = [];
                for (let i = 0; i < code.length; i += 3) {
                    // Extract the card index (2 digits) and reversed flag (1 digit)
                    const cardIndex = parseInt(code.substring(i, i + 2), 10);
                    const isReversed = code[i + 2] === '1';

                    // Validate card index
                    if (cardIndex < 0 || cardIndex >= tarotCards.length || isNaN(cardIndex)) {
                        throw new Error(`Invalid card index: ${cardIndex}`);
                    }

                    // Add card to the reading
                    cards.push({
                        ...tarotCards[cardIndex],
                        isReversed: isReversed,
                        position: i / 3 < cardPositions.length ? cardPositions[i / 3] : `Position ${i / 3 + 1}`
                    });
                }

                // Ensure we have at least some cards
                if (cards.length === 0) {
                    throw new Error("No cards found in reading code");
                }

                return cards;
            } catch (error) {
                console.error("Error parsing reading code:", error);
                setError("Unable to decode this reading. The link may be invalid.");
                return [];
            }
        };

        // Try to parse the reading code from the URL
        const loadReading = async () => {
            if (readingCode) {
                try {
                    const cards = parseReadingCode(readingCode);
                    
                    // Simulate a minimum loading time to show loading screen
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    console.log("Parsed Cards:", cards); // Debug log
                    setReadingCards(cards);
                    
                    setLoading(false);
                    clearTimeout(loadingTimeout);
                } catch (err) {
                    console.error("Error in loading reading:", err);
                    setError("An unexpected error occurred while loading your reading.");
                    setLoading(false);
                    clearTimeout(loadingTimeout);
                }
            }
        };

        loadReading();

        // Cleanup function
        return () => {
            clearTimeout(loadingTimeout);
        };
    }, [readingCode]);

    // Handle Ask Another Question button click
    const handleAskAnotherQuestion = () => {
        setShowForm(true); // Show the form popup instead of directly navigating
    };

    // Handle form close
    const handleFormClose = () => {
        setShowForm(false);
        router.push('/reading'); // Redirect to reading page on cancel
    };

    // Handle Get Personalized Reading button click
    const handleGetPersonalizedReading = () => {
        setShowForm(true); // Open the form popup
    };

    // Share the reading via navigator share API or copy link
    const shareReading = () => {
        const url = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: 'My Tarot Reading',
                text: `Check out my Mystic Tarot Reading with ${readingCards.length} cards!`,
                url: url
            })
            .then(() => {
                setShareMessage('Shared successfully!');
                setTimeout(() => setShareMessage(''), 3000);
            })
            .catch((error) => {
                console.error('Error sharing:', error);
                copyLinkToClipboard();
            });
        } else {
            copyLinkToClipboard();
        }
    };

    // Copy the reading link to clipboard
    const copyLinkToClipboard = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url)
            .then(() => {
                setShareMessage('Link copied to clipboard!');
                setTimeout(() => setShareMessage(''), 3000);
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
                setShareMessage('Failed to copy link');
                setTimeout(() => setShareMessage(''), 3000);
            });
    };

    // Loading State Component
    const LoadingState = () => (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
                <div className="animate-pulse">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-purple-600/50 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-purple-200 mb-4">
                    Unveiling Your Mystical Reading
                </h2>
                <p className="text-sm sm:text-base text-gray-300 max-w-md">
                    The cosmic energies are aligning to reveal your personalized tarot insights...
                </p>
            </div>
        </div>
    );

    // Error State Component
    const ErrorState = () => (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-600/30 rounded-full flex items-center justify-center mb-6">
                    <Info className="w-10 h-10 sm:w-12 sm:h-12 text-red-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-red-300 mb-4">
                    Reading Disrupted
                </h1>
                <p className="text-sm sm:text-base text-gray-200 max-w-md mb-6 sm:mb-8">
                    {error || "The mystical connection has been interrupted. Please return to the sanctuary and try again."}
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="px-5 py-2.5 sm:px-6 sm:py-3 bg-purple-700 hover:bg-purple-600 rounded-full transition-colors flex items-center gap-2 shadow-lg"
                >
                    <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                    Return to Sanctuary
                </button>
            </div>
            <Footer />
        </div>
    );

    // Personalized Reading Card Component
    const PersonalizedReadingCard = () => (
        <div className="max-w-4xl mx-auto mt-16 mb-16">
            <div className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 rounded-2xl overflow-hidden shadow-2xl border border-purple-500/30 relative">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-20 overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>
                <div className="absolute top-0 right-0 w-full h-20 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
                </div>
                
                {/* Card content */}
                <div className="p-6 sm:p-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                        {/* Left side with icon */}
                        <div className="w-full md:w-1/4 flex justify-center">
                            <div className="relative">
                                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-purple-600/20 rounded-full flex items-center justify-center">
                                    <Mail className="w-12 h-12 sm:w-14 sm:h-14 text-purple-300" />
                                </div>
                                <Star className="w-6 h-6 text-yellow-400 absolute top-0 right-0 animate-pulse" style={{animationDuration: '3s'}} />
                                <Star className="w-4 h-4 text-purple-300 absolute bottom-4 right-2 animate-pulse" style={{animationDuration: '2.5s'}} />
                                <Star className="w-3 h-3 text-indigo-400 absolute top-4 left-2 animate-pulse" style={{animationDuration: '4s'}} />
                            </div>
                        </div>
                        
                        {/* Right side with text and button */}
                        <div className="w-full md:w-3/4 text-center md:text-left">
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
                                Unlock Deeper Mystical Insights
                            </h3>
                            <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6">
                                Receive a personalized in-depth tarot reading directly to your email, 
                                where cosmic wisdom will guide you through your life's challenges and opportunities.
                            </p>
                            <button
                                onClick={handleGetPersonalizedReading}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full 
                                        transition-all shadow-lg shadow-purple-900/30 hover:shadow-purple-600/30 
                                        text-white font-bold flex items-center gap-2 mx-auto md:mx-0"
                            >
                                <Sparkles className="w-5 h-5" />
                                <span>Get Your Personalized Reading</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Decorative sparkling dots */}
                <div className="absolute inset-0 pointer-events-none">
                    <span className="absolute top-1/4 right-1/4 w-1 h-1 bg-purple-300 rounded-full animate-ping" style={{animationDuration: '3s', animationDelay: '0.2s'}}></span>
                    <span className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-indigo-300 rounded-full animate-ping" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}></span>
                    <span className="absolute top-1/2 left-1/5 w-1 h-1 bg-purple-300 rounded-full animate-ping" style={{animationDuration: '4s', animationDelay: '1s'}}></span>
                </div>
            </div>
        </div>
    );

    // Main Reading Content Component
    const ReadingContent = () => (
        <div className="min-h-screen text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
                {/* Header */}
                <header className="mb-8 sm:mb-12">
                    <button 
                        onClick={() => router.push('/reading')}
                        className="text-purple-300 hover:text-purple-100 flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        Back to Card Selection
                    </button>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-200 mb-1 sm:mb-2 chokokutai-regular">
                                Your Mystical Journey
                            </h1>
                            <p className="text-gray-300 text-sm sm:text-base md:text-lg">
                                A personalized tarot insight awaits
                            </p>
                        </div>

                        <button
                            onClick={shareReading}
                            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-purple-700 hover:bg-purple-600 rounded-full transition-colors flex items-center gap-1.5 sm:gap-2 shadow-md text-sm sm:text-base"
                        >
                            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            Share Reading
                        </button>
                    </div>
                    
                    {shareMessage && (
                        <div className="fixed top-4 right-4 bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg z-50 text-sm sm:text-base">
                            {shareMessage}
                        </div>
                    )}
                </header>

                {/* Cards Reading */}
                <div className="space-y-6 sm:space-y-8">
                    {readingCards.map((card, idx) => (
                        <div 
                            key={idx} 
                            className="bg-[#484848] rounded-lg sm:rounded-xl overflow-hidden shadow-xl border border-purple-800/50 hover:bg-[#484848]/80 transition-all"
                        >
                            <div className="flex flex-col md:flex-row p-4 sm:p-6 gap-4 md:gap-6 lg:gap-8 items-center">
                                <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
                                    <img 
                                        src={card.image} 
                                        alt={card.name}
                                        className="w-40 sm:w-48 md:w-56 lg:w-64 h-64 sm:h-72 md:h-80 lg:h-96 object-contain rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl"
                                    />
                                </div>
                                <div className="w-full md:w-2/3">
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-purple-300 mb-1 sm:mb-2">
                                        Card {idx + 1}: {card.position}
                                    </h3>
                                    <h4 className="text-xl sm:text-2xl font-extrabold text-white mb-2 sm:mb-4">
                                        {card.name} {card.isReversed && "(Reversed)"}
                                    </h4>
                                    <p className={`text-sm sm:text-base md:text-lg leading-relaxed ${card.isReversed ? 'text-purple-200 italic' : 'text-gray-200'}`}>
                                        {card.isReversed ? card.reversedMeaning : card.meaning}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add the personalized reading card */}
                <PersonalizedReadingCard />

                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => router.push('/reading')}
                        className="px-6 py-3 bg-purple-700 hover:bg-purple-600 rounded-full transition-colors shadow-md text-white text-lg font-bold"
                    >
                        {/* Decorative sparkles */}
                        <span className="absolute inset-0 w-full h-full">
                            <span className="absolute top-0 left-1/4 w-1 h-1 bg-purple-300 rounded-full opacity-70 animate-ping" style={{animationDuration: '3s', animationDelay: '0.2s'}}></span>
                            <span className="absolute bottom-0 right-1/4 w-1 h-1 bg-purple-300 rounded-full opacity-70 animate-ping" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}></span>
                        </span>
                        {/* Button text with subtle glow effect */}
                        <span className="relative z-10 flex items-center gap-2">
                            <span className="text-shadow-sm shadow-purple-400/50">Ask Another Question</span>
                        </span>
                    </button>
                </div>
            </div>

            <Footer />
            
            {/* Render form popup conditionally */}
            {showForm && <FormPopup onClose={handleFormClose} />}
        </div>
    );

    // Render appropriate state based on loading and error conditions
    if (loading) return <LoadingState />;
    if (error || readingCards.length === 0) return <ErrorState />;
    return <ReadingContent />;
}