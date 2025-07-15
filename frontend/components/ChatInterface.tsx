'use client';

import { useState } from 'react';
import InputArea from './InputArea';
import VideoPlayer from './VideoPlayer';
import { generateAudio } from '../lib/api';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  type: 'user' | 'system';
  audioUrl?: string;
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
  const [error, setError] = useState<string | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

  const handleSendMessage = async (messageText: string) => {
    setError(null);
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
      const data = await generateAudio(messageText);
      // Add system message with script and audio
      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.script,
        timestamp: new Date(),
        type: 'system',
        audioUrl: data.audioUrl,
      };
      setMessages((prev) => [...prev, systemMessage]);
      setCurrentAudioUrl(data.audioUrl);
    } catch (err: any) {
      setError('Failed to generate audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Audio Player Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          AI Avatar Audio
        </h3>
        {currentAudioUrl ? (
          <audio src={currentAudioUrl} controls className="w-full" autoPlay />
        ) : (
          <div className="text-gray-500 text-sm">Audio will appear here after you send a message.</div>
        )}
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
            {message.audioUrl && (
              <audio src={message.audioUrl} controls className="mt-2 w-full" />
            )}
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
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mr-8">
            {error}
          </div>
        )}
      </div>

      {/* Input Area */}
      <InputArea onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
