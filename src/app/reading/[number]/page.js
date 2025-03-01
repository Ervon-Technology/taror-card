'use client'

import { useParams } from 'next/navigation';
import { tarotCards } from '@/app/tarotCards';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Share2, Home, Info, ArrowLeft } from 'lucide-react';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';

export default function ReadingPage() {
    
    const params = useParams();
    const router = useRouter();
    const readingCode = params?.number || '';

    const [readingCards, setReadingCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shareMessage, setShareMessage] = useState('');

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
                    <div className="w-24 h-24 bg-purple-600/50 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <svg className="w-12 h-12 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-purple-200 mb-4">
                    Unveiling Your Mystical Reading
                </h2>
                <p className="text-gray-300 max-w-md">
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
                <div className="w-24 h-24 bg-red-600/30 rounded-full flex items-center justify-center mb-6">
                    <Info className="w-12 h-12 text-red-400" />
                </div>
                <h1 className="text-3xl font-extrabold text-red-300 mb-4">
                    Reading Disrupted
                </h1>
                <p className="text-gray-200 max-w-md mb-8">
                    {error || "The mystical connection has been interrupted. Please return to the sanctuary and try again."}
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-3 bg-purple-700 hover:bg-purple-600 rounded-full transition-colors flex items-center gap-2 shadow-lg"
                >
                    <Home className="w-5 h-5" />
                    Return to Sanctuary
                </button>
            </div>
            <Footer />
        </div>
    );

    // Main Reading Content Component
    const ReadingContent = () => (
        <div className="min-h-screen bg-gradient-to-br text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <header className="mb-12">
                    <button 
                        onClick={() => router.push('/reading')}
                        className="text-purple-300 hover:text-purple-100 flex items-center gap-2 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Card Selection
                    </button>
                    
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-extrabold text-purple-200 mb-2 chokokutai-regular">
                                Your Mystical Journey
                            </h1>
                            <p className="text-gray-300 text-lg">
                                A personalized tarot insight awaits
                            </p>
                        </div>

                        <button
                            onClick={shareReading}
                            className="px-5 py-2.5 bg-purple-700 hover:bg-purple-600 rounded-full transition-colors flex items-center gap-2 shadow-md"
                        >
                            <Share2 className="w-5 h-5" />
                            Share Reading
                        </button>
                    </div>
                    
                    {shareMessage && (
                        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                            {shareMessage}
                        </div>
                    )}
                </header>

                {/* Cards Reading */}
                <div className="space-y-8">
                    {readingCards.map((card, idx) => (
                        <div 
                            key={idx} 
                            className="bg-[#484848] rounded-xl overflow-hidden shadow-xl border border-purple-800/50 hover:bg-[#484848]/80 transition-all"
                        >
                            <div className="md:flex p-6 gap-8 items-center">
                                <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                                    <img 
                                        src={card.image} 
                                        alt={card.name}
                                        className="w-[15rem] h-96 object-contain rounded-xl shadow-2xl"
                                    />
                                </div>
                                <div className="md:w-2/3">
                                    <h3 className="text-xl font-bold text-purple-300 mb-2 ">
                                        Card {idx + 1}: {card.position}
                                    </h3>
                                    <h4 className="text-2xl font-extrabold text-white mb-4">
                                        {card.name}
                                    </h4>
                                    <p className={`text-lg leading-relaxed ${card.isReversed ? 'text-purple-200 italic' : 'text-gray-200'}`}>
                                        {card.isReversed ? card.reversedMeaning : card.meaning}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );

    // Render appropriate state based on loading and error conditions
    if (loading) return <LoadingState />;
    if (error || readingCards.length === 0) return <ErrorState />;
    return <ReadingContent />;
}