'use client';

import { useState, useRef } from 'react';
import InputArea from './InputArea';
import VideoPlayer from './VideoPlayer';
import { generateAudio, generateVideo } from '../lib/api';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  type: 'user' | 'system';
  audioBase64?: string; // <-- add this
}

const DEFAULT_PHOTO_URL = '/generic_secretary_stock_image.jpg';

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
  const [currentAudioBase64, setCurrentAudioBase64] = useState<string | null>(
    null
  );
  const [activeMessageIdx, setActiveMessageIdx] = useState<number | null>(null); // for highlighting
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSendMessage = async (messageText: string) => {
    setError(null);
    setVideoError(null);
    setVideoUrl(null);
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
      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.script,
        timestamp: new Date(),
        type: 'system',
        audioBase64: data.audioBase64 || undefined,
      };
      setMessages((prev) => [...prev, systemMessage]);
      if (data.audioBase64) {
        setCurrentAudioBase64(data.audioBase64);
        setActiveMessageIdx((prev) =>
          prev === null ? messages.length : prev + 2
        ); // auto-highlight last
        setTimeout(() => {
          if (typeof data.audioBase64 === 'string') {
            playAudio(data.audioBase64, messages.length);
          }
        }, 0);
      }
      // Video generation step
      if (data.script && (data.audioUrl || data.audioBase64)) {
        setIsVideoLoading(true);
        try {
          // Prefer audioUrl if available, else fallback to base64 (not supported by backend yet)
          const audioUrl = data.audioUrl || '';
          if (!audioUrl) throw new Error('No audioUrl available for video');
          const video = await generateVideo(
            data.script,
            audioUrl,
            DEFAULT_PHOTO_URL
          );
          setVideoUrl(video.videoUrl);
        } catch (err: unknown) {
          console.error('Error generating video:', err);
          setVideoError(
            err instanceof Error ? err.message : 'Failed to generate video'
          );
        } finally {
          setIsVideoLoading(false);
        }
      }
    } catch (err: unknown) {
      console.error('Error generating audio:', err);
      setError('Failed to generate audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  function playAudio(audioBase64: string, idx: number) {
    if (!audioBase64 || typeof audioBase64 !== 'string') {
      console.error('Invalid audio base64 data provided');
      return;
    }

    if (audioRef.current) {
      audioRef.current.src = `data:audio/mp3;base64,${audioBase64}`;
      audioRef.current.play();
      setActiveMessageIdx(idx);
      setCurrentAudioBase64(audioBase64);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Audio Player Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          AI Avatar Audio
        </h3>
        <audio
          ref={audioRef}
          controls
          className="w-full"
          style={{ display: currentAudioBase64 ? undefined : 'none' }}
          data-testid="audio-player"
        />
        {!currentAudioBase64 && (
          <div className="text-gray-500 text-sm">
            Audio will appear here after you send a message.
          </div>
        )}
      </div>
      {/* Video Player Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          AI Avatar Video
        </h3>
        {isVideoLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600">Generating video...</p>
          </div>
        ) : videoError ? (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg">
            {videoError}
          </div>
        ) : (
          <VideoPlayer videoUrl={videoUrl} />
        )}
      </div>
      {/* Chat Messages */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-800">Conversation</h3>
        {messages.map((message, idx) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors duration-150 ${
              message.type === 'user'
                ? 'bg-blue-100 ml-8'
                : `bg-gray-100 mr-8 ${activeMessageIdx === idx ? 'ring-2 ring-indigo-400' : ''}`
            }`}
            onClick={() => {
              if (message.type === 'system' && message.audioBase64) {
                playAudio(message.audioBase64, idx);
              }
            }}
          >
            <p className="text-gray-800 flex items-center">
              {message.text}
              {message.type === 'system' && message.audioBase64 && (
                <span className="ml-2 text-indigo-400">▶️</span>
              )}
            </p>
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
