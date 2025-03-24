import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Send } from "lucide-react";
import BackgroundImage from "../components/BackgroundImage";
import Logo from "../components/Logo";
import BackButton from "../components/BackButton";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const API_URL = 'http://localhost:5051';

const SelfPlanning = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = () => {
    navigate("/travel-preference");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load welcome message when component mounts
  useEffect(() => {
    const loadWelcomeMessage = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const healthCheck = await fetch(`${API_URL}/health`, {
          signal: controller.signal
        });
        
        if (!healthCheck.ok) {
          throw new Error('Backend server is not responding');
        }

        const response = await fetch(`${API_URL}/welcome`, {
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error('Failed to load welcome message');
        }
        
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        
        clearTimeout(timeoutId);
        setMessages([{ role: 'assistant', content: data.response }]);
      } catch (error) {
        console.error('Error loading welcome message:', error);
        let errorMessage = 'Failed to connect to the chat service. Please try again later.';
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            errorMessage = 'Connection timed out. Please refresh the page.';
          } else {
            errorMessage = error.message;
          }
        }
        
        setMessages([{ 
          role: 'assistant', 
          content: `Error: ${errorMessage}` 
        }]);
      }
    };

    loadWelcomeMessage();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from server');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${errorMessage}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden relative page-transition">
      <BackgroundImage fullHeight={false} />
      
      <div className="relative z-20 h-full flex flex-col">
        {/* Back button */}
        <div className="absolute top-6 left-6 z-30">
          <BackButton to="/travel-preference" />
        </div>
        
        {/* Logo at top center */}
        <div className="pt-6 flex justify-center">
          <div 
            onClick={handleLogoClick}
            className="glassmorphism p-4 rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <Logo />
          </div>
        </div>
        
        {/* Chat header */}
        <div className="glassmorphism mx-4 mt-6 rounded-full flex justify-center p-2 shadow-md">
          <div className="flex items-center gap-2 text-vander-dark">
            <MessageCircle size={20} />
            <span className="font-medium">Chat with AI Travel Assistant</span>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 mx-4 mt-4 overflow-y-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 whitespace-pre-wrap ${
                  message.role === 'user'
                    ? 'bg-vander-green text-white'
                    : 'bg-white/20 text-vander-dark'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/20 text-vander-dark rounded-lg p-3">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4">
          <form onSubmit={handleSubmit} className="glassmorphism rounded-xl p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about travel..."
                className="flex-1 bg-white/10 text-vander-dark placeholder-vander-gray/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-vander-green"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-vander-green text-white rounded-lg px-4 py-2 hover:bg-vander-teal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SelfPlanning;
