import { useState, useEffect, useRef } from "react";
import type { UIComponent } from "../../types/types";

type VisualAgentProps = {
  component: UIComponent;
  index: number;
};

const VisualAgent = ({ component, index }: VisualAgentProps) => {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleWheel = (e: React.WheelEvent<HTMLImageElement>) => {
    e.preventDefault();
    const zoomChange = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((prev) => Math.min(Math.max(prev + zoomChange, 1), 3));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClose = () => {
    setIsImageOpen(false);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div>
      {/* Main card */}
      <div
        key={index}
        className="rounded-2xl border border-gray-200 p-5 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 animate-fadeIn"
      >
        <h3 className="font-semibold text-xl text-indigo-700 mb-3">
          {component.title}
        </h3>

        {component.content && (
          <p className="text-gray-800 leading-relaxed mb-3">
            {component.content}
          </p>
        )}

        {component.image_url && (
          <div className="mt-3 rounded-2xl overflow-hidden">
          <img
            src={component.image_url}
            alt={component.title}
            className="mx-auto max-h-64 object-contain transition-transform hover:scale-102 cursor-pointer  "
            onClick={() => setIsImageOpen(true)}
          />
        </div>
        
        )}
      </div>

      {/* Lightbox modal */}
      {isImageOpen && component.image_url && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center z-50 cursor-grab p-6"
          onClick={handleClose}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div className="max-w-[90%] max-h-[90%] flex flex-col items-center gap-6">
            <img
              ref={imageRef}
              src={component.image_url}
              alt={component.title}
              className="max-h-[70vh] rounded-xl shadow-2xl object-contain bg-white p-2"
              style={{
                transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${
                  offset.y / zoom
                }px)`,
                transition: isDragging ? "none" : "transform 0.2s",
                cursor: isDragging ? "grabbing" : "grab",
              }}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onClick={(e) => e.stopPropagation()}
            />
            {component.content && (
              <p className="text-white text-center max-w-2xl text-lg leading-relaxed">
                {component.content}
              </p>
            )}
          </div>

          <button
            onClick={handleClose}
            className="absolute top-5 right-6 text-white text-3xl font-bold hover:text-red-400 transition"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default VisualAgent;
