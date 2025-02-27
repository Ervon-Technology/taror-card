// src/components/tarotCardSpread copy.jsx

'use client'

import React, { useState, useEffect } from 'react';
import { RefreshCw, Fan, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { tarotCards } from '@/app/tarotCards';

// Card back design
const cardBackImage = "/api/placeholder/200/350?text=Tarot";

const TarotCardSpread2 = () => {
    const router = useRouter();
    
    // State management
    const [cards, setCards] = useState(tarotCards);
    const [spread, setSpread] = useState(false);
    const [selectedCards, setSelectedCards] = useState([]);
    const [isReversed, setIsReversed] = useState(Array(tarotCards.length).fill(false));
    const [isShuffling, setIsShuffling] = useState(false);
    const [cardsRevealed, setCardsRevealed] = useState(Array(tarotCards.length).fill(false));
    const [cardStates, setCardStates] = useState(
        cards.map((_, i) => ({ 
            x: 0, 
            y: 0, 
            rotate: 0,
            zIndex: i 
        }))
    );
    
    // Function to shuffle array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Shuffle using the specific logic provided
    const shuffleDeck = () => {
        if (isShuffling) return;
        
        setIsShuffling(true);
        setSpread(false);
        setSelectedCards([]);
        setCardsRevealed(Array(cards.length).fill(false));
        
        // Create a shuffled order of the cards
        let shuffledOrder = [...cards];
        shuffleArray(shuffledOrder);
        
        // First, scatter cards randomly
        const scatterStates = shuffledOrder.map((_, index) => {
            const randomOffsetX = Math.random() * 60;
            const randomOffsetY = 0;
            const randomRotate = (Math.random() - 0.5) * 10;
            
            return {
                x: randomOffsetX,
                y: randomOffsetY,
                rotate: randomRotate,
                zIndex: index
            };
        });
        
        setCardStates(scatterStates);
        
        // After scatter, re-align cards back into a stacked deck
        setTimeout(() => {
            const alignedStates = shuffledOrder.map((_, index) => {
                return {
                    x: 0,
                    y: 0,
                    rotate: 0,
                    zIndex: index
                };
            });
            
            setCardStates(alignedStates);
            
            // Update card order and set reversed states
            const newReversed = Array(cards.length).fill(false).map(() => Math.random() > 0.7);
            setIsReversed(newReversed);
            setCards(shuffledOrder);
            
            // Finish shuffling
            setTimeout(() => {
                setIsShuffling(false);
            }, 500);
        }, 700);
    };

    // Spread cards in a line
    const spreadCards = () => {
        if (isShuffling) return;
        
        setSpread(true);
        
        // Calculate card positions for spread
        const totalWidth = Math.min(800, window.innerWidth - 40);
        const cardWidth = 80;
        const spacing = (totalWidth - cardWidth) / (cards.length - 1);
        
        const spreadStates = cards.map((_, i) => ({
            x: (i * spacing) - (totalWidth / 2) + (cardWidth / 2),
            y: 0,
            rotate: isReversed[i] ? 180 : 0,
            zIndex: i
        }));
        
        setCardStates(spreadStates);
    };

    // Toggle card selection
    const toggleSelectCard = (card, index) => {
        if (isShuffling) return;
        
        const isSelected = selectedCards.includes(card);
        let newCardStates = [...cardStates];
        let newCardsRevealed = [...cardsRevealed];
        
        if (isSelected) {
            // Deselect card
            setSelectedCards(selectedCards.filter(c => c !== card));
            newCardStates[index] = {
                ...newCardStates[index],
                y: 0
            };
            newCardsRevealed[index] = false;
        } else if (selectedCards.length < 6) {
            // Select card and reveal it
            setSelectedCards([...selectedCards, card]);
            newCardStates[index] = {
                ...newCardStates[index],
                y: -30,
                zIndex: 100 + index
            };
            newCardsRevealed[index] = true;
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
        console.log("Generated Reading Code:", readingCode); // Debug log
        
        // Redirect to reading page with the encoded card selection
        router.push(`/reading/${readingCode}`);
    };

    return (
        <div className="flex flex-col items-center text-white p-4">
            {/* Header */}
           
            
            {/* Card Area */}
            <div className="relative w-full max-w-4xl h-64 mb-8">
                {cards.map((card, index) => {
                    const isSelected = selectedCards.includes(card);
                    const state = cardStates[index];
                    const isRevealed = cardsRevealed[index];
                    
                    return (
                        <div
                            key={card.name}
                            className={`absolute w-20 h-32 rounded-lg border-2 transition-all duration-500 ease-out cursor-pointer
                                       ${isSelected ? 'border-yellow-400 shadow-lg shadow-yellow-400/50' : 'border-gray-700'}`}
                            style={{
                                transform: `translate(${state.x}px, ${state.y}px) rotate(${state.rotate}deg)`,
                                top: '50%',
                                left: '50%',
                                marginLeft: '-40px',
                                marginTop: '-64px',
                                zIndex: state.zIndex,
                                overflow: 'hidden'
                            }}
                            onClick={() => toggleSelectCard(card, index)}
                        >
                            {isRevealed ? (
                                // Revealed card shows the actual tarot card
                                <div className={`w-full h-full ${card.color} flex items-center justify-center`}>
                                    <span className="text-xs font-medium text-center px-1 text-white" style={{
                                        transform: isReversed[index] && spread ? 'rotate(180deg)' : 'rotate(0deg)'
                                    }}>
                                        {card.name}
                                    </span>
                                </div>
                            ) : (
                                // Card back design for unrevealed cards
                                <div className="w-full h-full bg-purple-800 bg-opacity-90 flex items-center justify-center">
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-800 to-purple-900 flex items-center justify-center">
                                        <div className="w-12 h-12 border-2 border-yellow-500 rounded-full flex items-center justify-center">
                                            <div className="w-8 h-8 border-2 border-yellow-500 rounded-full flex items-center justify-center">
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {/* Control Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
                <button 
                    className={`px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg transition flex items-center gap-2 ${isShuffling ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={shuffleDeck}
                    disabled={isShuffling}
                >
                    <RefreshCw className={isShuffling ? "animate-spin" : ""} size={18} />
                    Shuffle Deck
                </button>
                
                <button 
                    className={`px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition flex items-center gap-2 ${isShuffling ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={spreadCards}
                    disabled={isShuffling}
                >
                    <Fan size={18} />
                    Spread Cards
                </button>
                
                {selectedCards.length > 0 && (
                    <button 
                        className={`px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg transition flex items-center gap-2 
                                   ${selectedCards.length < 3 || isShuffling ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={goToReading}
                        disabled={selectedCards.length < 3 || isShuffling}
                    >
                        <BookOpen size={18} />
                        {selectedCards.length >= 3 ? 'Show Reading' : `Need ${3 - selectedCards.length} More Cards`}
                    </button>
                )}
            </div>
            
        </div>
    );
};

export default TarotCardSpread2;