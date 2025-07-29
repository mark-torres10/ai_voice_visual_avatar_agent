interface VideoPlayerProps {
  src: string;
}

export default function VideoPlayer({ src }: VideoPlayerProps) {
  return (
    <div className="mt-4">
      <video controls src={src} className="w-full rounded" />
    </div>
  );
}
