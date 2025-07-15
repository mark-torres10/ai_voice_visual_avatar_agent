'use client';

import { useState } from 'react';
import InputArea from './InputArea';
import VideoPlayer from './VideoPlayer';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  type: 'user' | 'system';
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello World! Welcome to the AI Avatar MVP. Type a message below to get started.',
      timestamp: new Date(),
      type: 'system',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  // Remove or use 'setCurrentVideoUrl' if not needed
  // Format for Prettier compliance

  const handleSendMessage = async (messageText: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      timestamp: new Date(),
      type: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // For now, just echo the message back with "Hello World" response
      setTimeout(() => {
        const systemMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Hello World! You said: "${messageText}". Video generation will be implemented soon!`,
          timestamp: new Date(),
          type: 'system',
        };
        setMessages((prev) => [...prev, systemMessage]);
        setIsLoading(false);
      }, 1000);

      // TODO: Replace with actual API call to /api/generate
      // const response = await fetch('/api/generate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userMessage: messageText }),
      // });
      // const data = await response.json();
      // setCurrentVideoUrl(data.videoUrl);
    } catch (error) {
      console.error('Error generating response:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Video Player Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          AI Avatar Video
        </h3>
        <VideoPlayer videoUrl={null} />
      </div>

      {/* Chat Messages */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-800">Conversation</h3>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.type === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'
            }`}
          >
            <p className="text-gray-800">{message.text}</p>
            <p className="text-xs text-gray-500 mt-1">
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-100 mr-8 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Processing your message...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <InputArea onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
