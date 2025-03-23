
import React, { useState } from "react";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! I'm your travel assistant. How can I help you plan your trip today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm your AI travel assistant. This is a placeholder response. In a real app, I would provide personalized travel suggestions based on your query.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      
      toast({
        title: "New message",
        description: "You have received a response from the travel assistant",
      });
    }, 1000);
  };

  return (
    <div className="glassmorphism rounded-2xl h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-vander-dark">Travel Assistant</h2>
        <p className="text-sm text-vander-gray">Ask me anything about your trip planning</p>
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.isUser 
                    ? "bg-gradient-to-r from-vander-green to-vander-teal text-white" 
                    : "bg-white border border-gray-100 text-vander-dark"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-[10px] opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message here..."
            className="form-input flex-1"
          />
          <button 
            onClick={handleSendMessage}
            className="vander-button p-3"
            disabled={!input.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
