import { useEffect } from "react";

interface VideoModalProps {
  activeVideo: string | null;
  setActiveVideo: (video: string | null) => void;
}

const VideoModal = ({ activeVideo, setActiveVideo }: VideoModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveVideo(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveVideo]);

  if (!activeVideo) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
      onClick={() => setActiveVideo(null)}
    >
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-white text-3xl md:text-4xl p-2 md:p-3 rounded-full cursor-pointer hover:scale-90 transition-colors duration-200 z-50"
        onClick={() => setActiveVideo(null)}
      >
        ×
      </button>

      {/* Video Container */}
      <div
        className="relative w-full max-w-7xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={activeVideo.replace("watch?v=", "embed/")}
          title="YouTube Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg hover:scale-105 transition-transform duration-300"
        ></iframe>
      </div>
    </div>
  );
};

export default VideoModal;
