'use client';

interface VideoPlayerProps {
  videoUrl?: string | null;
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  if (!videoUrl) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-4xl mb-2">🎥</div>
          <p className="text-gray-600 font-medium">
            Hello World - Video Player
          </p>
          <p className="text-gray-500 text-sm mt-2">
            AI-generated avatar videos will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <video
        src={videoUrl}
        controls
        className="w-full h-64 bg-black rounded-lg"
        autoPlay
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}