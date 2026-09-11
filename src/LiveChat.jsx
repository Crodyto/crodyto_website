// src/LiveChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import './LiveChat.css';
import { FaArrowLeft, FaPaperPlane, FaHeadset } from 'react-icons/fa';

function LiveChat({ user, goBack }) {
  const [messages, setMessages] = useState([
    { sender: 'team', text: 'Hello! Welcome to Crodyto support. How can we help you today?' }
  ]);
  const [input, setInput] = useState('');
  
  const chatEndRef = useRef(null);
  const timeoutRef = useRef(null);

  // নতুন মেসেজ এলে অটোমেটিক নিচে স্ক্রল করার জন্য
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // ইউজারের মেসেজ অ্যাড করা
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setInput('');

    // আগের কোনো ২০ সেকেন্ডের টাইমার থাকলে সেটা ক্লিয়ার করা
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // নতুন করে ২০ সেকেন্ডের টাইমার সেট করা
    timeoutRef.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { 
          sender: 'system', 
          text: 'There is no team member currently available. Please leave your message or try again later.' 
        }
      ]);
    }, 20000); // 20000 ms = 20 seconds
  };

  // যদি ইউজার লগইন করা না থাকে
  if (!user) {
    return (
      <div className="live-chat-page">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft /> Back
        </button>
        <div className="auth-error-container">
          <h2>Authentication Required</h2>
          <p>You must Sign In to your account to use the Live Chat feature.</p>
        </div>
      </div>
    );
  }

  // যদি ইউজার লগইন থাকে তবে চ্যাট দেখাবে
  return (
    <div className="live-chat-page">
      <button className="back-btn" onClick={goBack}>
        <FaArrowLeft /> Back to Options
      </button>

      <div className="chat-container">
        <div className="chat-header">
          <FaHeadset /> Crodyto Live Support
        </div>
        
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {/* স্ক্রল করার জন্য ডামি div */}
          <div ref={chatEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <input 
            type="text" 
            placeholder="Type your message here..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="send-btn">
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
}

export default LiveChat;