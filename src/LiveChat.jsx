// src/LiveChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import './LiveChat.css';
import { FaArrowLeft, FaPaperPlane, FaHeadset, FaExclamationCircle } from 'react-icons/fa';
import { db } from './firebase';
// নতুন updateDoc ইম্পোর্ট করা হলো
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, setDoc, doc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';

function LiveChat({ user, goBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatStatus, setChatStatus] = useState('checking'); 
  
  // টিম মেম্বার টাইপ করছে কি না ট্র্যাক করার জন্য
  const [isTeamTyping, setIsTeamTyping] = useState(false);
  
  const chatEndRef = useRef(null);
  const timeoutRef = useRef(null);
  const typingTimeoutRef = useRef(null); // ইউজারের টাইপিং টাইমার
  const roomName = user ? `chat_${user.uid}` : null;

  useEffect(() => {
    if (!user) return;
    const requestChat = async () => {
      await setDoc(doc(db, "active_chats", user.uid), {
        uid: user.uid,
        email: user.email,
        lastMessage: "Customer requested a chat...",
        status: "pending",
        customerTyping: false,
        teamTyping: false,
        timestamp: serverTimestamp()
      });
    };
    requestChat();

    timeoutRef.current = setTimeout(() => {
      setChatStatus((prev) => (prev === 'checking' ? 'not_available' : prev));
    }, 20000);

    return () => clearTimeout(timeoutRef.current);
  }, [user]);

  // স্ট্যাটাস এবং টিমের টাইপিং চেক করা
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, "active_chats", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Accept এর লজিক
        if (data.status === 'accepted' && chatStatus === 'checking') {
          clearTimeout(timeoutRef.current);
          setChatStatus('typing'); 
          setTimeout(() => {
            setChatStatus('connected');
          }, 1500);
        }

        // টিম টাইপ করছে কি না
        if (data.teamTyping) {
          setIsTeamTyping(true);
        } else {
          setIsTeamTyping(false);
        }
      }
    });
    return () => unsubscribe();
  }, [user, chatStatus]);

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
  }, [messages, chatStatus, isTeamTyping]);

  // 🔴 কাস্টমার যখন টাইপ করবে 🔴
  const handleTyping = async (e) => {
    setInput(e.target.value);
    
    if (chatStatus !== 'connected') return;

    // ডাটাবেসে customerTyping = true করে দেওয়া
    await updateDoc(doc(db, "active_chats", user.uid), { customerTyping: true });

    // ২ সেকেন্ড টাইপ না করলে আবার false করে দেওয়া
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(async () => {
      await updateDoc(doc(db, "active_chats", user.uid), { customerTyping: false });
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !roomName || !user || chatStatus !== 'connected') return;

    const messageText = input;
    setInput('');

    // মেসেজ পাঠানোর পর customerTyping টাইমার ক্লিয়ার করে false করা
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    await updateDoc(doc(db, "active_chats", user.uid), { customerTyping: false });

    await addDoc(collection(db, roomName), {
      text: messageText,
      sender: 'user',
      timestamp: serverTimestamp()
    });

    await updateDoc(doc(db, "active_chats", user.uid), {
      lastMessage: messageText,
      timestamp: serverTimestamp()
    });
  };

  const handleLeaveChat = async () => {
    if (user && roomName) {
      try {
        const q = query(collection(db, roomName));
        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs.map((document) => deleteDoc(doc(db, roomName, document.id)));
        await Promise.all(deletePromises); 
        await deleteDoc(doc(db, "active_chats", user.uid));
      } catch (error) {}
    }
    goBack();
  };

  if (!user) {
    return (
      <div className="live-chat-page">
        <button className="back-btn" onClick={goBack}><FaArrowLeft /> Back</button>
        <div className="auth-error-container">
          <h2>Authentication Required</h2>
          <p>You must Sign In to your account to use the Live Chat feature.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="live-chat-page">
      <button className="back-btn" onClick={handleLeaveChat}><FaArrowLeft /> Leave Chat</button>

      <div className="chat-container">
        <div className="chat-header">
          <FaHeadset /> Crodyto Live Support
        </div>
        
        {chatStatus === 'checking' && (
          <div className="loading-screen">
            <div className="spinner"></div>
            <h3>Finding an available consultant...</h3>
            <p style={{ fontSize: '0.9rem' }}>Please wait a moment.</p>
          </div>
        )}

        {chatStatus === 'not_available' && (
          <div className="loading-screen" style={{ color: '#d9534f' }}>
            <FaExclamationCircle style={{ fontSize: '3rem', marginBottom: '15px' }} />
            <h3>Our team is currently busy</h3>
            <p style={{ fontSize: '0.9rem' }}>All consultants are currently occupied. Please leave the chat and try again later.</p>
          </div>
        )}

        {(chatStatus === 'connected' || chatStatus === 'typing') && (
          <>
            <div className="chat-messages">
              {messages.length === 0 && chatStatus === 'connected' && (
                <div className="message team">
                  Hi {user.email.split('@')[0]}! A consultant has joined the chat. How can we assist you today?
                </div>
              )}
              
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.sender}`}>{msg.text}</div>
              ))}

              {/* 🔴 Initial Connect বা টিম মেম্বার টাইপ করলে অ্যানিমেশন দেখাবে 🔴 */}
              {(chatStatus === 'typing' || isTeamTyping) && (
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Type your message here..." 
                value={input}
                onChange={handleTyping} // এখানে handleTyping ফাংশন কল হলো
                disabled={chatStatus !== 'connected'}
              />
              <button type="submit" className="send-btn" disabled={chatStatus !== 'connected'}>
                <FaPaperPlane />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default LiveChat;
