
import React, { useState, useRef, useEffect } from 'react';
import { streamGeminiResponse } from './services/geminiService';
import { ChatMessage, Role } from './types';
import { MessageBubble } from './components/MessageBubble';
import { InputArea } from './components/InputArea';
import { ThinkingIndicator } from './components/ThinkingIndicator';
import { ExampleProblems } from './components/ExampleProblems';
import { Sparkles, Calculator, BookOpen } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      text: "Hello! I'm your Socratic Math Tutor. \n\nI won't just give you the answers—instead, I'll help you think through problems step-by-step so you can master them. \n\n**Upload a photo** of a tricky problem or **type a question** to get started!",
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string, image: string | null) => {
    // 1. Add User Message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: Role.USER,
      text: text,
      image: image || undefined,
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // 2. Placeholder for Bot Message
      const botMessageId = (Date.now() + 1).toString();
      const botMessagePlaceholder: ChatMessage = {
        id: botMessageId,
        role: Role.MODEL,
        text: "",
      };
      
      setMessages((prev) => [...prev, botMessagePlaceholder]);

      // 3. Stream Response
      await streamGeminiResponse(
        newHistory.filter(m => m.id !== botMessageId), // Pass history up to user message
        text, // Current text
        image, // Current image
        (streamedText) => {
          setMessages((prev) => 
            prev.map((msg) => 
              msg.id === botMessageId 
                ? { ...msg, text: streamedText } 
                : msg
            )
          );
        }
      );

    } catch (error) {
      console.error("Failed to generate response", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: Role.MODEL,
          text: "I'm having a little trouble thinking through that right now. Could you try asking again, or checking your internet connection?",
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectExample = (text: string) => {
    handleSendMessage(text, null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="flex-none bg-white border-b border-slate-200 px-6 py-4 shadow-sm z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
              <Calculator size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Socratic Math Tutor</h1>
              <p className="text-xs text-slate-500 font-medium">Powered by Gemini 3 Pro</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
             <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-emerald-500"/>
                <span>Step-by-Step</span>
             </div>
             <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500"/>
                <span>Deep Reasoning</span>
             </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-6">
        <div className="max-w-4xl mx-auto flex flex-col min-h-full justify-end">
          {/* Messages */}
          <div className="flex flex-col gap-2">
            {messages.map((msg, index) => (
              <React.Fragment key={msg.id}>
                <MessageBubble message={msg} />
                {/* Show example problems right after the first welcome message if user hasn't replied yet */}
                {index === 0 && messages.length === 1 && (
                  <ExampleProblems onSelect={handleSelectExample} />
                )}
              </React.Fragment>
            ))}
            
            {/* Thinking State */}
            {isLoading && messages[messages.length - 1].text.length === 0 && (
               <div className="mb-6">
                 <ThinkingIndicator />
               </div>
            )}
            
            {/* Invisible div for scrolling */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-none z-20">
        <InputArea onSend={handleSendMessage} disabled={isLoading} />
      </footer>
    </div>
  );
}
