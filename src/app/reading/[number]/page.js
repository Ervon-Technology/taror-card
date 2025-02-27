'use client'

import { useParams } from 'next/navigation';
import { tarotCards } from '@/app/tarotCards';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Share2, Home, Download, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
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
    const [expandedCards, setExpandedCards] = useState({});
    
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
        if (readingCode) {
            const cards = parseReadingCode(readingCode);
            console.log("Parsed Cards:", cards); // Debug log
            setReadingCards(cards);
            
            // Initialize all cards as collapsed
            const initialExpandState = {};
            cards.forEach((_, idx) => {
                initialExpandState[idx] = false;
            });
            setExpandedCards(initialExpandState);
            
            setLoading(false);
        }
    }, [readingCode]);

    // Toggle card expanded state
    const toggleCardExpanded = (idx) => {
        setExpandedCards(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    // Share the reading via navigator share API or copy link
    const shareReading = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Tarot Reading',
                    text: `Check out my Mystic Tarot Reading with ${readingCards.length} cards!`,
                    url: url
                });
                setShareMessage('Shared successfully!');
                setTimeout(() => setShareMessage(''), 3000);
            } catch (error) {
                console.error('Error sharing:', error);
                copyLinkToClipboard();
            }
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

    // Generate a PDF or image of the reading (basic implementation)
    const downloadReading = () => {
        setShareMessage('Download feature coming soon!');
        setTimeout(() => setShareMessage(''), 3000);
    };

    // Return to home page
    const goToHome = () => {
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[80vh]">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                    <p className="text-lg text-purple-200">Interpreting your mystical reading...</p>
                    <p className="text-sm text-gray-400 mt-2">The cards are revealing their secrets</p>
                </div>
            </div>
        );
    }

    if (error || readingCards.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
                    <div className="w-20 h-20 rounded-full bg-red-800 flex items-center justify-center mb-6">
                        <span className="text-3xl">!</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-red-400">Reading Error</h1>
                    <p className="mb-6 text-center max-w-md">{error || "This reading appears to be invalid or has been corrupted by mystic forces."}</p>
                    <button
                        className="px-5 py-3 bg-purple-700 hover:bg-purple-600 rounded-lg transition flex items-center gap-2 shadow-lg"
                        onClick={goToHome}
                    >
                        <Home size={18} />
                        Return to the Sanctuary
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Share feedback message */}
                {shareMessage && (
                    <div className="fixed top-20 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out">
                        {shareMessage}
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <button 
                        onClick={goToHome}
                        className="text-purple-300 hover:text-purple-100 flex items-center gap-2 mb-4 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span>Back to Card Selection</span>
                    </button>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-purple-200">
                            Your Mystical Reading
                        </h1>

                        <div className="flex gap-2">
                            <button
                                className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg transition flex items-center gap-2 shadow-md"
                                onClick={shareReading}
                            >
                                <Share2 size={16} />
                                <span className="hidden sm:inline">Share Reading</span>
                            </button>

                            <button
                                className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg transition flex items-center gap-2 shadow-md"
                                onClick={downloadReading}
                            >
                                <Download size={16} />
                                <span className="hidden sm:inline">Download</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="h-1 w-32 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mt-4"></div>
                </div>

                {/* Reading Info */}
                <div className="w-full max-w-4xl mx-auto bg-gray-800 bg-opacity-70 p-5 rounded-lg mb-8 border border-gray-700 shadow-lg">
                    <h2 className="text-xl font-semibold text-purple-300 mb-2">Your Personal Reading</h2>
                    <p className="text-gray-300">This reading provides insights about your current situation and potential future developments.</p>
                    <p className="text-gray-400 mt-2 text-sm">Reading ID: <span className="font-mono">{readingCode}</span></p>
                </div>

                {/* Cards Reading */}
                <div className="w-full max-w-4xl mx-auto space-y-6">
                    {readingCards.map((card, idx) => (
                        <div 
                            key={idx} 
                            className={`border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 shadow-lg
                                      ${expandedCards[idx] ? 'bg-gray-800 bg-opacity-90' : 'bg-gray-800 bg-opacity-70 hover:bg-opacity-80'}`}
                        >
                            {/* Card header - Always visible */}
                            <div 
                                className="p-4 flex justify-between items-center cursor-pointer"
                                onClick={() => toggleCardExpanded(idx)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center
                                                   bg-gradient-to-br from-purple-700 to-indigo-900 text-white font-bold text-lg`}>
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">
                                            {card.position}
                                        </h3>
                                        <p className="text-purple-300 font-medium">
                                            {card.name} {card.isReversed ? '(Reversed)' : ''}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    {expandedCards[idx] ? (
                                        <ChevronUp className="text-purple-300" size={20} />
                                    ) : (
                                        <ChevronDown className="text-purple-300" size={20} />
                                    )}
                                </div>
                            </div>
                            
                            {/* Card expanded content */}
                            {expandedCards[idx] && (
                                <div className="px-4 pb-5 border-t border-gray-700 pt-4">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Card Image */}
                                        <div className="md:w-1/3 flex justify-center">
                                            <div className="w-48 h-72 border-2 border-purple-500 rounded-lg overflow-hidden shadow-md relative">
                                                <div 
                                                    className="w-full h-full flex flex-col items-center justify-center"
                                                    style={{
                                                        transform: card.isReversed ? 'rotate(180deg)' : 'rotate(0deg)'
                                                    }}
                                                >
                                                    {/* Card image */}
                                                    <div className="flex-grow w-full overflow-hidden">
                                                        <img 
                                                            src={card.image} 
                                                            alt={card.name}
                                                            className="w-full h-full object-cover" 
                                                            onError={(e) => {
                                                                // If image fails to load, show a gradient background
                                                                e.target.onerror = null;
                                                                e.target.style.display = 'none';
                                                                e.target.parentNode.classList.add('bg-gradient-to-br', 'from-indigo-800', 'to-purple-900');
                                                                // Add a fallback symbol
                                                                const div = document.createElement('div');
                                                                div.className = 'w-full h-full flex items-center justify-center';
                                                                div.innerHTML = `
                                                                    <div class="text-center p-2">
                                                                        <div class="w-12 h-12 border-2 border-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                                                            <div class="w-8 h-8 border-2 border-yellow-500 rounded-full flex items-center justify-center">
                                                                                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                `;
                                                                e.target.parentNode.appendChild(div);
                                                            }}
                                                        />
                                                    </div>
                                                    
                                                    {/* Card title */}
                                                    <div className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 p-2 text-center border-t border-purple-400">
                                                        <span className="text-white text-base font-serif font-bold">{card.name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Card Interpretation */}
                                        <div className="md:w-2/3">
                                            <h4 className="text-xl font-semibold text-purple-200 mb-3">
                                                {card.isReversed ? 'Reversed Meaning' : 'Upright Meaning'}
                                            </h4>
                                            <p className="text-gray-200 mb-4 leading-relaxed">
                                                {card.isReversed ? card.reversedMeaning : card.meaning}
                                            </p>
                                            
                                            <h4 className="text-lg font-medium text-purple-200 mb-2">
                                                Position Significance
                                            </h4>
                                            <p className="text-gray-300 leading-relaxed">
                                                This card represents <span className="text-purple-300 font-medium">{card.position.toLowerCase()}</span>. 
                                                {idx === 0 && " It shows your current emotional state and self-perception."}
                                                {idx === 1 && " It reveals your deepest desires and what you're consciously or unconsciously seeking."}
                                                {idx === 2 && " It highlights anxieties or concerns that may be influencing your decisions."}
                                                {idx === 3 && " It indicates positive factors or strengths that are supporting your journey."}
                                                {idx === 4 && " It points to challenges or obstacles that you're facing or will soon encounter."}
                                                {idx === 5 && " It suggests the likely outcome based on the current energies and choices."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Reading Summary */}
                <div className="w-full max-w-4xl mx-auto mt-8 bg-gray-800 bg-opacity-70 p-6 rounded-lg border border-gray-700 shadow-lg">
                    <h2 className="text-xl font-bold text-purple-300 mb-3">Reading Summary</h2>
                    <p className="text-gray-200 mb-4">
                        This 6-card spread provides a snapshot of your current situation, influences, and possible outcomes.
                        Reflect on how these cards interact with each other to gain deeper insights.
                    </p>
                    
                    <div className="flex flex-wrap gap-4 mt-4 justify-center">
                        <button
                            className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg transition flex items-center gap-2 shadow-md"
                            onClick={shareReading}
                        >
                            <Share2 size={16} />
                            Share Reading
                        </button>
                        
                        <button
                            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition flex items-center gap-2 shadow-md"
                            onClick={goToHome}
                        >
                            <Home size={16} />
                            New Reading
                        </button>
                    </div>
                </div>
                
                <div className="text-center text-gray-400 mt-12 mb-6">
                    <p className="text-sm">✨ The universe speaks through the cards ✨</p>
                </div>
            </div>

            <Footer />
        </div>
    );
}