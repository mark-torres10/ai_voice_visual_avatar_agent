'use client';

import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  // Remove or use 'message' and 'setMessage' if not needed
  // Add a newline at the end of the file

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Avatar MVP
            </h1>
            <p className="text-lg text-gray-600">
              Hello World - Chat Interface Coming Soon
            </p>
          </div>

          {/* Main Chat Interface */}
          <ChatInterface />
        </div>
      </div>
    </main>
  );
}
