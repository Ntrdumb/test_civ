import React, { useState, useEffect, useRef } from 'react';
import ChatInput from '../ChatInput';

export default function ChatDisplay({ changeView }) {
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  const handleSend = async (question) => {
    const userMessage = { type: 'user', text: question };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Send question to the API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    
    const result = await response.json();
    
    if (result.nature === 'statistique') {
      const botMessage = {
        type: 'bot',
        text: result.statistique.texte,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } else if (result.nature === 'selection') {
      changeView(result.schema);  // Assuming changeView changes the UI based on result
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
              style={{ wordWrap: "break-word" }}  // Ensure text breaks within the container
            >
              <p className="text-sm font-bold text-gray-600">{message.type === 'bot' ? 'Chatbot' : 'You'}</p>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}
