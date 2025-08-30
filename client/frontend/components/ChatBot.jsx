// src/components/ChatBot.jsx
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../src/AuthContext";
import { chatWithFashionBot } from "@/utils/chatbot";
import { generateMessageId } from '../src/utils/uniqueId';
import './css/chatbot.css'; // Import responsive styles

const ChatBot = () => {
  const { user } = useAuth();
  const username = user?.name || 'Guest';
  const [messages, setMessages] = useState([]); // {sender: "user"|"bot", text: "", id: "", timestamp: ""}
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [retryMessage, setRetryMessage] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Suggested prompts for better UX
  const suggestedPrompts = [
    "What is green hydrogen?",
    "How is green hydrogen produced?",
    "What are the applications of green hydrogen?",
    "What are the benefits of green hydrogen?"
  ];

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Focus input on component mount and load dark mode preference
  useEffect(() => {
    inputRef.current?.focus();
    
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('chatbot-dark-mode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('chatbot-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Copy message to clipboard
  const copyMessage = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
    setRetryMessage(null);
  };

  // Retry failed message
  const retryFailedMessage = async (messageText) => {
    setRetryMessage(null);
    setLoading(true);

    try {
      const reply = await chatWithFashionBot([messageText], username);
      const botMessage = { 
        sender: "bot", 
        text: reply, 
        id: generateMessageId(), 
        timestamp: new Date().toISOString() 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = { 
        sender: "bot", 
        text: "I'm having trouble connecting right now. Please try again later.", 
        id: generateMessageId(), 
        timestamp: new Date().toISOString(),
        isError: true 
      };
      setMessages(prev => [...prev, errorMessage]);
      setRetryMessage(messageText);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (messageText = input) => {
    if (!messageText.trim()) return;

    // Add user's message
    const userMessage = { 
      sender: "user", 
      text: messageText, 
      id: generateMessageId(), 
      timestamp: new Date().toISOString() 
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Call your chatbot function
      const reply = await chatWithFashionBot([messageText], username);
      const botMessage = { 
        sender: "bot", 
        text: reply, 
        id: generateMessageId(), 
        timestamp: new Date().toISOString() 
      };
      setMessages([...newMessages, botMessage]);
    } catch (err) {
      const errorMessage = { 
        sender: "bot", 
        text: "I'm having trouble connecting right now. Please try again later.", 
        id: generateMessageId(), 
        timestamp: new Date().toISOString(),
        isError: true 
      };
      setMessages([...newMessages, errorMessage]);
      setRetryMessage(messageText);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedPrompt = (prompt) => {
    setInput(prompt);
    handleSend(prompt);
  };

  return (
    <div className={`chatbot-page-container ${darkMode ? 'dark' : ''}`}>
      <div className="chatbot-page-header">
        <div className="chatbot-header-content">
          <div className="chatbot-title-row">
            <h1 className="chatbot-title">🌱 Green Hydrogen Assistant</h1>
            <button 
              onClick={toggleDarkMode} 
              className="chatbot-theme-toggle"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <p className="chatbot-subtitle">Your AI companion for Green Hydrogen fuel technology, production, and applications!</p>
          {user && <p className="chatbot-welcome-text">Welcome, {username}! 👋</p>}
        </div>
        
        {/* Chat Controls */}
        <div className="chatbot-controls">
          {messages.length > 0 && (
            <button onClick={clearChat} className="chatbot-clear-btn" title="Clear chat">
              🗑️ Clear Chat
            </button>
          )}
        </div>
      </div>
      
      <div className="chatbot-chat-container">
        {/* Messages Area */}
        <div className="chatbot-messages-container">
          {messages.length === 0 && (
            <div className="chatbot-welcome-message">
              <div className="chatbot-bot-avatar">🤖</div>
              <div className="chatbot-welcome-content">
                <h3>Hello! I'm your Green Hydrogen Assistant</h3>
                <p>I can help you learn about green hydrogen technology, production methods, applications, and more!</p>
                
                {/* Suggested Prompts */}
                <div className="chatbot-suggestions">
                  <p className="chatbot-suggestions-title">Try asking me:</p>
                  <div className="chatbot-suggestions-grid">
                    {suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        className="chatbot-suggestion-btn"
                        onClick={() => handleSuggestedPrompt(prompt)}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div
              key={msg.id || `message-${idx}-${msg.sender}`}
              className={`chatbot-message-wrapper ${msg.sender === "user" ? "user" : "bot"}`}
            >
              {msg.sender === "bot" && (
                <div className="chatbot-avatar">
                  🤖
                </div>
              )}
              
              <div className="chatbot-message-content">
                <div
                  className={`chatbot-message ${msg.sender} ${msg.isError ? 'error' : ''}`}
                >
                  <div className="chatbot-message-text">{msg.text}</div>
                  
                  {/* Message Actions */}
                  <div className="chatbot-message-actions">
                    <button
                      className="chatbot-action-btn"
                      onClick={() => copyMessage(msg.text)}
                      title="Copy message"
                    >
                      📋
                    </button>
                    <span className="chatbot-timestamp">
                      {msg.timestamp && formatTimestamp(msg.timestamp)}
                    </span>
                  </div>
                </div>
                
                {/* Retry button for failed messages */}
                {msg.isError && retryMessage && (
                  <button
                    className="chatbot-retry-btn"
                    onClick={() => retryFailedMessage(retryMessage)}
                  >
                    🔄 Retry
                  </button>
                )}
              </div>
              
              {msg.sender === "user" && (
                <div className="chatbot-avatar user">
                  👤
                </div>
              )}
            </div>
          ))}
          
          {/* Loading indicator with animation */}
          {loading && (
            <div className="chatbot-message-wrapper bot">
              <div className="chatbot-avatar">
                🤖
              </div>
              <div className="chatbot-message-content">
                <div className="chatbot-message bot">
                  <div className="chatbot-typing-indicator">
                    <div className="chatbot-typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="chatbot-typing-text">Assistant is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chatbot-input-container">
          <div className="chatbot-input-wrapper">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about green hydrogen..."
              className="chatbot-input"
              rows={1}
              disabled={loading}
            />
            <button 
              onClick={() => handleSend()} 
              className={`chatbot-send-btn ${input.trim() ? 'active' : ''}`}
              disabled={loading || !input.trim()}
              title="Send message"
            >
              {loading ? (
                <div className="chatbot-loading-spinner"></div>
              ) : (
                "➤"
              )}
            </button>
          </div>
          
          <div className="chatbot-input-hint">
            Press Enter to send • Shift + Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
};


export default ChatBot;
