// src/components/tarotCardSpread.jsx

'use client'

import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Fan, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { tarotCards } from '@/app/tarotCards';

const TarotCardSpread = () => {
    const router = useRouter();
    const containerRef = useRef(null);

    // State management
    const [cards, setCards] = useState(tarotCards);
    const [spread, setSpread] = useState(false);
    const [selectedCards, setSelectedCards] = useState([]);
    const [isReversed, setIsReversed] = useState(Array(tarotCards.length).fill(false));
    const [isShuffling, setIsShuffling] = useState(false);
    const [cardsRevealed, setCardsRevealed] = useState(Array(tarotCards.length).fill(false));
    const [showInstructions, setShowInstructions] = useState(true);
    const [showMaxCardsModal, setShowMaxCardsModal] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);

    // Card dimensions (60% larger than original)
    const cardWidth = 157; // 80px * 1.6
    const cardHeight = 275; // 128px * 1.6

    // Update container width on window resize
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);


    useEffect(() => {
        setTimeout(() => {
            shuffleDeck();
        }, 1000);

    }, []);

    // Function to shuffle array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Card states initialization
    const [cardStates, setCardStates] = useState(
        cards.map((_, i) => ({
            x: 0,
            y: 0,
            rotate: 0,
            zIndex: i,
            scale: 1
        }))
    );

    // Enhanced shuffle with multiple visual effects
    const shuffleDeck = () => {
        if (isShuffling) return;

        setIsShuffling(true);
        setSpread(false);
        setSelectedCards([]);
        setCardsRevealed(Array(cards.length).fill(false));
        setShowInstructions(false);

        // Create a shuffled order of the cards
        let shuffledOrder = [...cards];

        // Perform actual array shuffle
        shuffleArray(shuffledOrder);
        shuffleArray(shuffledOrder);
        shuffleArray(shuffledOrder);
        shuffleArray(shuffledOrder);
        shuffleArray(shuffledOrder);

        setTimeout(() => {

            const bridgeStates = cards.map((_, index) => {
                // Create an arc shape
                const normalizedIndex = index / (cards.length - 1) * 2 - 1; // -1 to 1
                const arcHeight = -40; // Negative for upward curve

                return {
                    x: normalizedIndex * 70,
                    y: arcHeight * (1 - normalizedIndex * normalizedIndex), // Parabola
                    rotate: normalizedIndex * 5,
                    zIndex: index,
                    scale: 1
                };
            });

            setCardStates(bridgeStates);

            // Step 4: Quick cut in the middle
            setTimeout(() => {
                const cutIndex = Math.floor(cards.length / 2);
                const cutStates = [...cardStates];

                // Move top half to the left
                for (let i = 0; i < cutIndex; i++) {
                    cutStates[i] = { ...cutStates[i], x: -80 };
                }

                // Move bottom half to the right
                for (let i = cutIndex; i < cards.length; i++) {
                    cutStates[i] = { ...cutStates[i], x: 80 };
                }

                setCardStates(cutStates);

                // Step 5: Riffle shuffle animation
                setTimeout(() => {
                    const riffleStates = cards.map((_, index) => {
                        const isTopHalf = index < cutIndex;
                        const halfIndex = isTopHalf ? index : index - cutIndex;
                        const delay = halfIndex * 0.05;

                        setTimeout(() => {
                            setCardStates(prev => {
                                const newStates = [...prev];
                                newStates[index] = {
                                    ...newStates[index],
                                    x: 0,
                                    y: 0,
                                    zIndex: index
                                };
                                return newStates;
                            });
                        }, delay * 1000);

                        return {
                            x: isTopHalf ? -80 : 80,
                            y: 0,
                            rotate: 0,
                            zIndex: index,
                            scale: 1
                        };
                    });

                    // Final step: align cards back into a stacked deck
                    setTimeout(() => {
                        const alignedStates = shuffledOrder.map((_, index) => {
                            return {
                                x: 0,
                                y: 0,
                                rotate: 0,
                                zIndex: index,
                                scale: 1
                            };
                        });

                        setCardStates(alignedStates);

                        // Update card order and set reversed states
                        const newReversed = Array(cards.length).fill(false).map(() => Math.random() > 0.7);
                        setIsReversed(newReversed);
                        setCards(shuffledOrder);

                        // Finish shuffling and show tap to spread message
                        setTimeout(() => {
                            setIsShuffling(false);
                            setShowInstructions(true);
                        }, 500);
                    }, 1000);
                }, 300);
            }, 400);

        }, 500);

    };

    // Spread cards in a line
    const spreadCards = () => {
        if (isShuffling) return;

        setSpread(true);
        setShowInstructions(true); // Keep instructions visible to show "Select 6 cards" message

        // Define the spacing between cards
        const spacing = Math.min(cardWidth * 0.6, (containerWidth - cardWidth) / (cards.length - 1));

        // Calculate new positions where cards move only to the right
        const spreadStates = cards.map((_, i) => ({
            x: i * spacing, // Moves each card further to the right
            y: 0, // No vertical movement
            rotate: 0, // Handle reversed cards
            zIndex: i,
            scale: 0.9
        }));

        setCardStates(spreadStates);
    };

    // Handle deck click - modified to make it work more consistently
    const handleDeckClick = (e) => {
        if (!spread && !isShuffling) {
            spreadCards();
        }
    };

    // Toggle card selection - modified to handle initial card click spreading
    const toggleSelectCard = (card, index) => {
        // If cards are not spread yet, spread them first
        if (!spread && !isShuffling) {
            spreadCards();
            return;
        }
        
        // Don't proceed if shuffling
        if (isShuffling) return;

        const isSelected = selectedCards.includes(card);
        let newCardStates = [...cardStates];
        let newCardsRevealed = [...cardsRevealed];

        // If card is already selected, don't allow deselection
        if (isSelected) {
            return; // Prevent deselection
        } else if (selectedCards.length < 6) {
            // Select card and reveal it
            setSelectedCards([...selectedCards, card]);
            newCardStates[index] = {
                ...newCardStates[index],
                y: newCardStates[index].y - 10,
                zIndex: index,
                scale: newCardStates[index].scale
            };
            newCardsRevealed[index] = true;
        } else {
            // Show max cards modal
            setShowMaxCardsModal(true);
            setTimeout(() => setShowMaxCardsModal(false), 3000);
            return;
        }

        setCardStates(newCardStates);
        setCardsRevealed(newCardsRevealed);
    };

    // Function to generate a code for the card selection
    const generateReadingCode = () => {
        if (selectedCards.length < 3 || isShuffling) return '';

        // Create an encoding of the selected cards
        const codeArray = selectedCards.map(card => {
            const cardIndex = cards.findIndex(c => c.name === card.name);
            if (cardIndex === -1) return ''; // Skip invalid cards

            const isCardReversed = isReversed[cardIndex];
            return `${cardIndex.toString().padStart(2, '0')}${isCardReversed ? 1 : 0}`;
        });

        // Join all codes to make a single string
        return codeArray.join('');
    };

    // Function to redirect to the reading page
    const goToReading = () => {
        if (selectedCards.length < 3 || isShuffling) return;

        // Generate the code that encodes the card selection
        const readingCode = generateReadingCode();

        // Redirect to reading page with the encoded card selection
        router.push(`/reading/${readingCode}`);
    };

    // Get instruction message based on spread state
    const getInstructionMessage = () => {
        if (!spread) {
            return (
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 bg-opacity-70 text-black px-6 py-4 rounded-lg  max-w-xs z-50 text-lg"
                    onClick={(e) => {
                        // Don't propagate click if we're handling it here
                        e.stopPropagation();
                    }}
                    style={{
                        pointerEvents: 'auto',
                        width: "310px",
                        maxWidth: "90%"
                    }}
                >
                    We shuffled the cards 5 times. Now please 
                    {' '}
                    <span
                        className="text-gray-900 underline cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            spreadCards();
                        }}
                    >
                        tap on the deck
                    </span>
                    
                    {' '}and choose 6 cards, or tap here if you want to{' '}
                    <span
                        className="text-gray-900 underline cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            shuffleDeck();
                        }}
                    >
                        Reshuffle again
                    </span>.
                </div>
            );
        }
        return null;
    };


    // Get instruction message based on spread state
    const getShuffleLoader = () => {
        if (!spread) {
            return (
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 bg-opacity-70 text-black px-6 py-4 rounded-lg  max-w-xs z-50 text-lg"
                    onClick={(e) => {
                        // Don't propagate click if we're handling it here
                        e.stopPropagation();
                    }}
                    style={{
                        pointerEvents: 'auto',
                        width: "310px",
                        maxWidth: "90%"
                    }}
                >
                <div className="flex items-center gap-x-2">
                   <RefreshCw className={isShuffling ? "animate-spin" : ""} size={18} />
                   Shuffle Deck
                   </div>
                </div>
            );
        }
        return null;
    };


    return (
        <div>
            <div className="flex flex-col items-center text-white p-4 relative">
                {/* Card Area */}
                <div
                    ref={containerRef}
                    className="relative w-full max-w-5xl h-52 sm:h-96 perspective-1000"
                    style={{
                        perspective: '1000px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '250px'
                    }}
                    onClick={handleDeckClick}
                >
                    {/* Deck container - using CSS grid for layout instead of absolute positioning */}
                    <div className="grid place-items-center relative" style={{ height: '100%', width: '100%' }}>
                        {/* Centered Instructions overlay */}
                        {showInstructions && !isShuffling && getInstructionMessage()}
                        {!spread && isShuffling && getShuffleLoader()}

                        {/* Max cards modal */}
                        {showMaxCardsModal && (
                            <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-[#484848] text-white px-6 py-3 rounded-lg shadow-lg z-50 whitespace-nowrap">
                                You can only select up to 6 cards
                            </div>
                        )}

                        {/* Cards using CSS transforms instead of absolute positioning */}
                        <div className={`relative w-full h-full flex  md:justify-start items-center ${
    spread ? "" : "justify-center"
  }`}>
                            {cards.map((card, index) => {
                                const isSelected = selectedCards.includes(card);
                                const state = cardStates[index];
                                const isRevealed = cardsRevealed[index];

                                // Calculate CSS transform based on card state
                                const cardTransform = `
                                translate(${state.x}px, ${state.y}px) 
                                rotate(${state.rotate}deg) 
                                scale(${state.scale})
                            `;

                                return (
                                    <div
                                        key={card.name}
                                        className={`
                                        border-4 rounded-lg transition-all duration-500 ease-out cursor-pointer 
                                        ${isSelected ? 'border-yellow-400' : 'border-gray-700'}
                                    `}
                                        style={{
                                            width: `${cardWidth}px`,
                                            height: `${cardHeight}px`,
                                            transform: cardTransform,
                                            zIndex: state.zIndex,
                                            position: 'fixed',
                                            transformOrigin: 'center center',
                                            transition: isShuffling ? 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'all 0.5s ease-out',
                                            overflow: 'hidden'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSelectCard(card, index);
                                        }}
                                    >
                                        {isRevealed ? (
                                            // Revealed card shows the actual tarot card
                                            <div
                                                className="w-full h-full flex items-center justify-center"
                                                style={{
                                                    background: 'url(/bk.webp) no-repeat',
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: '0'
                                                }}
                                            ></div>
                                        ) : (
                                            // Card back design with the provided background image
                                            <div
                                                className="w-full h-full flex items-center justify-center"
                                                style={{
                                                    background: 'url(/bk.webp) no-repeat',
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: '0'
                                                }}
                                            ></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Control Buttons - Modified to hide shuffle when spread */}
                <div className="flex flex-wrap gap-4 justify-center mt-6">
                    {/* Only show shuffle button when cards are not spread */}
                    {/* {!spread && (
                        <button
                            className={`px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg transition flex items-center gap-2 ${isShuffling ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={shuffleDeck}
                            disabled={isShuffling}
                        >
                            <RefreshCw className={isShuffling ? "animate-spin" : ""} size={18} />
                            Shuffle Deck
                        </button>
                    )}

                    {!spread && (
                        <button
                            className={`px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition flex items-center gap-2 ${isShuffling ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={spreadCards}
                            disabled={isShuffling}
                        >
                            <Fan size={18} />
                            Spread Cards
                        </button>
                    )} */}

                    {spread && selectedCards.length > 0 && selectedCards.length < 6 && (
                        <button
                            className={`px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg transition flex items-center gap-2 
                                   ${selectedCards.length < 6 || isShuffling ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={goToReading}
                            disabled={selectedCards.length < 6 || isShuffling}
                        >
                            <BookOpen size={18} />
                            {selectedCards.length >= 6 ? 'Read the Cards' : `Select ${6 - selectedCards.length} More Cards`}
                        </button>
                    )}

                    {selectedCards.length === 6 && (
                        <button
                            className="px-4 py-2 bg-[#484848] hover:bg-[#302f2f] rounded-lg transition flex items-center gap-2"
                            onClick={goToReading}
                        >
                            <BookOpen size={18} />
                            Read the Cards
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TarotCardSpread;