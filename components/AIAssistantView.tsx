import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { generateAiResponse } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';

const AIAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<{ file: File; base64: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '' && !image) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: input,
      ...(image && { image: image.base64 }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setImage(null);
    setIsLoading(true);

    try {
      const imagePart = image ? { mimeType: image.file.type, data: image.base64.split(',')[1] } : undefined;
      const responseText = await generateAiResponse(input, imagePart);
      
      const modelMessage: ChatMessage = { role: 'model', text: responseText };
      setMessages((prev) => [...prev, modelMessage]);

    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setImage({ file, base64 });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg p-3 max-w-sm md:max-w-md lg:max-w-lg shadow-md ${msg.role === 'user' ? 'bg-brand-cyan text-brand-primary' : 'bg-brand-secondary text-brand-text'}`}>
              {msg.image && <img src={msg.image} alt="user upload" className="rounded-md mb-2 max-h-48" />}
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-brand-secondary text-brand-text rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-brand-cyan rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-brand-cyan rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-brand-cyan rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {image && (
        <div className="p-2 bg-brand-secondary rounded-md mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={image.base64} alt="preview" className="h-10 w-10 rounded object-cover" />
            <span className="text-xs text-brand-light truncate">{image.file.name}</span>
          </div>
          <button onClick={() => setImage(null)} className="p-1 rounded-full hover:bg-brand-accent">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      <div className="mt-4 flex items-center space-x-2 bg-brand-secondary rounded-full p-2 shadow-lg">
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <button onClick={() => fileInputRef.current?.click()} className="p-2 text-brand-light rounded-full hover:bg-brand-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v11.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          placeholder="Ask your assistant..."
          className="flex-1 bg-transparent text-brand-text placeholder-brand-light focus:outline-none"
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading || (input.trim() === '' && !image)} className="p-3 bg-brand-cyan rounded-full text-brand-primary disabled:bg-brand-accent disabled:text-brand-light transition-colors shadow-md hover:bg-opacity-90">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  );
};

export default AIAssistantView;