// src/Consultant.jsx
import React from 'react';
import './Consultant.css';
import { FaRobot, FaHeadset, FaPhoneAlt, FaArrowLeft } from 'react-icons/fa';

// App.jsx থেকে goBack এবং goToLiveChat প্রপস হিসেবে আসছে
function Consultant({ goBack, goToLiveChat }) {
  return (
    <div className="consultant-page">
      <button className="back-btn" onClick={goBack}>
        <FaArrowLeft /> Back to Home
      </button>
      
      <div className="consultant-container">
        <h1>Choose Your Consultation Mode</h1>
        <p>How would you like to connect with the Crodyto team?</p>
        
        <div className="options-grid">
          
          <div className="consult-card">
            <FaRobot className="consult-icon ai-icon" />
            <h3>Chat with AI</h3>
            <p>Get instant answers to your queries using our smart AI assistant.</p>
            <button className="consult-btn" onClick={() => alert("AI Chat feature coming soon!")}>
              Start AI Chat
            </button>
          </div>
          
          <div className="consult-card">
            <FaHeadset className="consult-icon human-icon" />
            <h3>Live Chat with Team</h3>
            <p>Chat directly with our expert team members in real-time.</p>
            
            {/* 👉 ঠিক এই বাটনে goToLiveChat কল করা হয়েছে 👈 */}
            <button className="consult-btn" onClick={goToLiveChat}>
              Start Live Chat
            </button>
          </div>
          
          <div className="consult-card">
            <FaPhoneAlt className="consult-icon call-icon" />
            <h3>Get a Call</h3>
            <p>Leave your number and our team will call you back shortly.</p>
            <button className="consult-btn" onClick={() => alert("Call request form coming soon!")}>
              Request a Call
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Consultant;
