import React, { createContext, useContext, useState } from "react";
import { getBotResponse } from "../chatbot/chatLogic";
import { useNavigate } from "react-router-dom"; // ✅ Import this

const ChatbotContext = createContext();

export const ChatbotProvider = ({ children, portfolioData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize hook

  // Initial Welcome Message Logic
  const getWelcomeMessage = () => {
      if (portfolioData) {
          const firstName = portfolioData.name.split(" ")[0];
          return `Hi! I'm ${firstName}'s agent. They are a skilled ${portfolioData.role}. How can I assist?`;
      }
      return "Hello! I'm FolioFYX Ai. Ask me to 'Create a Site' or 'Go to Dashboard'.";
  };

  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: getWelcomeMessage(),
      sender: "bot", 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: portfolioData 
        ? [{ label: "Why Hire?", value: "why hire" }, { label: "Projects", value: "projects" }]
        : [{ label: "Create Portfolio", value: "create" }, { label: "Templates", value: "templates" }]
    }
  ]);

  const toggleChat = () => setIsOpen(!isOpen);
  const closeChat = () => setIsOpen(false);

  const handleUserMessage = async (text) => {
    const userMsg = { id: Date.now(), text, sender: "user", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
        const botData = getBotResponse(text, portfolioData);
        
        const botMsg = { 
            id: Date.now() + 1, 
            text: botData.response, 
            sender: "bot", 
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            options: botData.options 
        };

        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);

        // --- ⚡ ACTION HANDLER ---
        
        // 1. Navigation (Internal Routes)
        if (botData.action === "navigate" && botData.path) {
            navigate(botData.path); // ✅ Performs the route change
        }

        // 2. Scrolling (Portfolio Sections)
        if (botData.action === "scroll" && botData.path) {
            const element = document.getElementById(botData.path.toLowerCase());
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }

        // 3. External Links
        if (botData.action === "link" && botData.path) {
            window.open(botData.path, "_blank");
        }

    }, 800);
  };

  return (
    <ChatbotContext.Provider value={{ isOpen, toggleChat, closeChat, messages, isTyping, handleUserMessage }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => useContext(ChatbotContext);