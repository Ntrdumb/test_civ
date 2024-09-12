import React, { useState, useRef } from 'react';

export default function ChatInput({ onSend, isDisabled }) {  // Accept the new prop
  const [input, setInput] = useState('');
  const textAreaRef = useRef(null);

  const adjustHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'inherit';  // Reset height to recalibrate
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Set to scroll height
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    adjustHeight();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
      if (textAreaRef.current) {
        textAreaRef.current.style.height = 'inherit'; // Reset height after sending
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-end gap-2 mt-4">
      <textarea
        ref={textAreaRef}
        className="border p-2 rounded w-full max-w-xs resize-none"
        placeholder="Posez une question..."
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        style={{ minHeight: '20px', overflow: 'hidden' }}
        disabled={isDisabled}  // Disable textarea if bot is typing
      />
      <button
        type="submit"
        className={`bg-civision-green text-white p-2 rounded ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isDisabled}  // Disable button if bot is typing
      >
        Send
      </button>
    </form>
  );
}
