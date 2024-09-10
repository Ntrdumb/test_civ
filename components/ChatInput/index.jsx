import React, { useState, useRef } from 'react';

export default function ChatInput({ onSend }) {
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

  // Send
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {  // Check if Enter is pressed without the Shift key
      e.preventDefault();  // Prevent the default action to stop adding a new line
      handleSubmit(e);  // Manually trigger the submit handler
    }
  };

  // Jump line
  const handleSubmit = (e) => {
    e.preventDefault();  // This stops the form from submitting through traditional HTML submit
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
        onKeyDown={handleKeyPress}  // Add the key down event handler
        style={{ minHeight: '20px', overflow: 'hidden' }}
      />
      <button type="submit" className="bg-civision-green text-white p-2 rounded">
        Send
      </button>
    </form>
  );
}
