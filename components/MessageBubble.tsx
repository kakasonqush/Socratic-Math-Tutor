import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, Role } from '../types';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? 'bg-slate-200 text-slate-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'
        }`}>
          {isUser ? <User size={18} /> : <Bot size={20} />}
        </div>

        {/* Bubble Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed overflow-hidden ${
            isUser 
              ? 'bg-slate-800 text-white rounded-br-none' 
              : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
          }`}>
            {message.image && (
              <div className="mb-3 rounded-lg overflow-hidden border border-slate-200/20">
                <img 
                  src={message.image} 
                  alt="Uploaded math problem" 
                  className="max-w-full h-auto max-h-64 object-contain bg-slate-50"
                />
              </div>
            )}
            
            <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-pre:bg-slate-900/50 prose-pre:text-slate-100">
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          </div>
          
          <span className="text-[11px] text-slate-400 mt-1 px-1">
            {isUser ? 'You' : 'Socratic Tutor'}
          </span>
        </div>
      </div>
    </div>
  );
};
