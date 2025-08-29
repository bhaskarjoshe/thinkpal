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
    setZoom((prev) => Math.min(Math.max(prev + zoomChange, 1), 3)); // min 1x, max 3x
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

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div>
      <div
        key={index}
        className="border rounded-lg p-4 shadow-md bg-yellow-50 animate-fadeIn"
      >
        <h3 className="font-bold text-lg mb-2">{component.title}</h3>
        {/* {component.content && (
          <p className="text-gray-700 mb-2">{component.content}</p>
        )} */}

        {component.content_image && (
          <img
            src={component.content_image}
            alt={component.title}
            className="mt-2 rounded-lg shadow-md cursor-pointer max-h-64 object-contain w-full"
            onClick={() => setIsImageOpen(true)}
          />
        )}
      </div>

      {/* Lightbox modal */}
      {isImageOpen && component.content_image && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 cursor-grab"
          onClick={handleClose}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <img
            ref={imageRef}
            src={component.content_image}
            alt={component.title}
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg object-contain"
            style={{
              transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${
                offset.y / zoom
              }px)`,
              transition: isDragging ? "none" : "transform 0.2s",
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
          />
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default VisualAgent;
