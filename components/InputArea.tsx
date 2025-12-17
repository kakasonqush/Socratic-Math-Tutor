import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { Send, Image as ImageIcon, X } from 'lucide-react';

interface InputAreaProps {
  onSend: (text: string, image: string | null) => void;
  disabled: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("Image size too large. Please upload an image smaller than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset input value so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleSend = () => {
    if ((!text.trim() && !selectedImage) || disabled) return;
    onSend(text, selectedImage);
    setText('');
    setSelectedImage(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full bg-white border-t border-slate-200 px-4 py-4 md:px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="max-w-4xl mx-auto">
        
        {/* Image Preview */}
        {selectedImage && (
          <div className="relative inline-block mb-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="relative rounded-xl overflow-hidden border border-indigo-100 shadow-sm group">
              <img 
                src={selectedImage} 
                alt="Preview" 
                className="h-24 w-auto object-cover bg-slate-50" 
              />
              <button
                onClick={removeImage}
                className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
            <div className="text-xs text-indigo-600 mt-1 font-medium">Image attached</div>
          </div>
        )}

        <div className="flex items-end gap-2 bg-slate-50 rounded-2xl border border-slate-200 p-2 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors disabled:opacity-50"
            title="Upload math problem photo"
          >
            <ImageIcon size={22} />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedImage ? "Ask a question about this image..." : "Type your math question or upload a photo..."}
            className="flex-1 bg-transparent border-0 focus:ring-0 resize-none py-3 text-slate-700 placeholder:text-slate-400 max-h-32 min-h-[48px]"
            rows={1}
            disabled={disabled}
            style={{ height: 'auto', minHeight: '48px' }} // Simple auto-grow could go here, keeping it fixed for now or simple
          />

          <button
            onClick={handleSend}
            disabled={(!text.trim() && !selectedImage) || disabled}
            className={`p-3 rounded-xl transition-all duration-200 ${
              (!text.trim() && !selectedImage) || disabled
                ? 'bg-slate-200 text-slate-400'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }`}
          >
            <Send size={20} className={(!text.trim() && !selectedImage) ? "" : "ml-0.5"} />
          </button>
        </div>
        <div className="text-center mt-2">
           <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Gemini 3 Pro • Socratic Mode</span>
        </div>
      </div>
    </div>
  );
};
