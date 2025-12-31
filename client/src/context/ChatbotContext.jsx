import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBotResponse } from "../chatbot/chatLogic";
import { getAllPortfolios } from "../api/portfolioAPI";

const ChatbotContext = createContext();

export const useChatbot = () => useContext(ChatbotContext);

export const ChatbotProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // 1. Get User Name (Fail gracefully to "User")
  const getUserName = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      // Capitalize first letter for premium feel
      const firstName = user?.name ? user.name.split(" ")[0] : "User";
      return firstName.charAt(0).toUpperCase() + firstName.slice(1);
    } catch (e) {
      return "User";
    }
  };

  // 2. Get Premium Time-Based Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // 3. Reset/Init Function
  const initializeChat = () => {
    const name = getUserName();
    const greeting = getGreeting();
    
    setMessages([
      {
        id: Date.now(),
        // 🔥 PREMIUM BRANDING: Cleaner, professional text.
        text: `${greeting}, ${name}. I am FYX Ai. I have full control over the interface. How may I assist you?`,
        sender: "bot",
        options: [
          { label: "Go to Dashboard", value: "dashboard" },
          { label: "Create Portfolio", value: "create" },
          { label: "View Templates", value: "Templates" }
        ]
      }
    ]);
  };

  // Run on mount
  useEffect(() => {
    if (messages.length === 0) initializeChat();
  }, []);

  const toggleChat = () => setIsOpen((prev) => !prev);
  const closeChat = () => setIsOpen(false);

  // 4. Handle "Clear" Action
  const clearHistory = () => {
    setMessages([]); 
    // Quick fade out/in effect simulation
    setTimeout(() => initializeChat(), 300); 
  };

  const addMessage = (text, sender = "user", options = []) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text, sender, options, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const addBotMessage = (text, options = []) => {
    setIsTyping(true);
    // Smart delay: fast for short texts, slightly longer for long texts
    const delay = Math.min(1000, 400 + text.length * 15); 
    
    setTimeout(() => {
      addMessage(text, "bot", options);
      setIsTyping(false);
    }, delay);
  };

  const handleUserMessage = async (text) => {
    addMessage(text, "user");

    // Get intelligence from chatLogic
    const { response, action, path, options } = getBotResponse(text);

    // --- ⚡ ACTION HANDLERS ---

    // 1. Clear History
    if (action === "clear") {
      setTimeout(() => clearHistory(), 500);
      return;
    }

    // 2. Scroll Actions (Full Control)
    if (action === "scroll_down") {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
    }
    
    if (action === "scroll_top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Respond first
    addBotMessage(response, options);

    // 3. Navigation Actions (Delayed slightly for user to read response)
    if (action === "navigate" && path) {
      setTimeout(() => {
        navigate(path);
        // Optional: Close chat on mobile if navigating? 
        // setIsOpen(false); 
      }, 1500); 
    }
  };

  const value = { 
    isOpen, toggleChat, closeChat, 
    messages, handleUserMessage, 
    isTyping, clearHistory 
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

export default ChatbotContext;