// src/LiveChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import './LiveChat.css';
import { FaArrowLeft, FaPaperPlane, FaHeadset } from 'react-icons/fa';
import { db } from './firebase';

import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, setDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';

function LiveChat({ user, goBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const roomName = user ? `chat_${user.uid}` : null;

  
  useEffect(() => {
    if (!roomName) return;

    const q = query(collection(db, roomName), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(document => ({
        id: document.id,
        ...document.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [roomName]);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

 
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !roomName || !user) return;

    const messageText = input;
    setInput('');

   
    await addDoc(collection(db, roomName), {
      text: messageText,
      sender: 'user',
      timestamp: serverTimestamp()
    });

   
    await setDoc(doc(db, "active_chats", user.uid), {
      uid: user.uid,
      email: user.email,
      lastMessage: messageText,
      timestamp: serverTimestamp()
    });
  };

  
  const handleLeaveChat = async () => {
    if (user && roomName) {
      try {
        
        const q = query(collection(db, roomName));
        const snapshot = await getDocs(q);
        
        const deletePromises = snapshot.docs.map((document) => 
          deleteDoc(doc(db, roomName, document.id))
        );
        await Promise.all(deletePromises); 

        
        await deleteDoc(doc(db, "active_chats", user.uid));
        
      } catch (error) {
        console.error("Error clearing chat history: ", error);
      }
    }
    
    
    goBack();
  };

  
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

 
  return (
    <div className="live-chat-page">
      
      <button className="back-btn" onClick={handleLeaveChat}>
        <FaArrowLeft /> Leave Chat
      </button>

      <div className="chat-container">
        <div className="chat-header">
          <FaHeadset /> Crodyto Live Support
        </div>
        
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="message team">Hi {user.email.split('@')[0]}! How can we help you?</div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
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
