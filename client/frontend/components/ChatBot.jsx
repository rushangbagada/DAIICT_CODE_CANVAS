// src/components/ChatBot.jsx
import React, { useState } from "react";
import { useAuth } from "../src/AuthContext";
import { chatWithFashionBot } from "@/utils/chatbot";
import { generateMessageId } from '../src/utils/uniqueId';
import './css/chatbot.css'; // Import responsive styles

const ChatBot = () => {
  const { user } = useAuth();
  const username = user?.name || 'Guest';
  const [messages, setMessages] = useState([]); // {sender: "user"|"bot", text: "", id: ""}
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user's message
    const userMessage = { sender: "user", text: input, id: generateMessageId() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Call your chatbot function
      const reply = await chatWithFashionBot([input], username);
      const botMessage = { sender: "bot", text: reply, id: generateMessageId() };
      setMessages([...newMessages, botMessage]);
    } catch (err) {
      const errorMessage = { sender: "bot", text: "Bot is unavailable.", id: generateMessageId() };
      setMessages([...newMessages, errorMessage]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chatbot-page-container">
      <div className="chatbot-page-header">
        <h1 className="chatbot-title">🌱 Green Hydrogen Assistant</h1>
        <p className="chatbot-subtitle">Your AI companion for Green Hydrogen fuel technology, production, and applications!</p>
        {user && <p className="chatbot-welcome-text">Welcome, {username}!</p>}
      </div>
      
      <div className="chatbot-chat-container">
        <div className="chatbot-messages-container">
        {messages.map((msg, idx) => (
          <div
            key={msg.id || `message-${idx}-${msg.sender}`}
            className="chatbot-message"
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#059669" : "#f3f4f6",
              color: msg.sender === "user" ? "white" : "#1f2937",
            }}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div 
            className="chatbot-message" 
            style={{ alignSelf: "flex-start", backgroundColor: "#f3f4f6", color: "#6b7280" }}
          >
            🤖 Bot is typing...
          </div>
        )}
      </div>

        <div className="chatbot-input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about green hydrogen..."
            className="chatbot-input"
          />
          <button onClick={handleSend} className="chatbot-button">
            🚀 Send
          </button>
        </div>
      </div>
    </div>
  );
};


export default ChatBot;
