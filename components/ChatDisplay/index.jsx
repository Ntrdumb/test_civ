import React, { useState, useEffect, useRef } from 'react';
import ChatInput from '../ChatInput';

export default function ChatDisplay({ changeView, updateDateRange, updateSelectedComptes, updateSelectedExpenses }) {
  const [messages, setMessages] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatContainerRef = useRef(null);

  const handleSend = async (question) => {
    const userMessage = { type: 'user', text: question };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsBotTyping(true);

    // Add a typing indicator for the bot
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'bot', text: '...', typing: true },
    ]);

    // Send question to the API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    
    const result = await response.json();

    // Remove typing indicator
    setMessages((prevMessages) =>
      prevMessages.filter((message) => !message.typing)
    );

    if (result.nature === 'selection') {
      changeView(result.schema);

      if (result.selection) {
        const { comptes, periode } = result.selection;
        
        // Handle balances (comptes) selection
        if (result.schema === 'solde_compte' && comptes && comptes.length > 0) {
          updateSelectedComptes(comptes);
        }

        // Handle expenses (categories_depense) selection
        if (result.schema === 'categories_depense' && comptes && comptes.length > 0) {
          updateSelectedExpenses(comptes);  // Pass the expense types to Home.js
        }

        if (periode) {
          const [startDate, endDate] = periode;
          updateDateRange(result.schema, [startDate, endDate]);
        }
      }

      const botMessage = {
        type: 'bot',
        text: "Voici ce que j'ai trouvé.",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } else {
      const botMessage = {
        type: 'bot',
        text: "Je n'ai pas compris votre demande.",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }

    setIsBotTyping(false);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full max-w-lg mx-auto p-2">
      <div
        ref={chatContainerRef}
        className="border p-4 rounded h-96 overflow-y-auto flex flex-col space-y-4"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} my-2`}
          >
            <div
              className={`max-w-xs w-full p-3 rounded-lg ${
                message.type === 'user' ? 'bg-civision-green text-white rounded-br-none' : 'bg-gray-300 text-black rounded-bl-none'
              }`}
              style={{ wordWrap: "break-word" }}
            >
              <p className="text-sm font-bold text-gray-600">
                {message.type === 'bot' ? 'Chatbot' : 'You'}
              </p>
              {message.typing ? (
                <div className="flex space-x-1">
                  <span className="dot bg-gray-500 rounded-full w-2 h-2 animate-dot-wave"></span>
                  <span className="dot bg-gray-500 rounded-full w-2 h-2 animate-dot-wave delay-150"></span>
                  <span className="dot bg-gray-500 rounded-full w-2 h-2 animate-dot-wave delay-250"></span>
                </div>
              ) : (
                <p>{message.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <ChatInput onSend={handleSend} isDisabled={isBotTyping} />
    </div>
  );
}
