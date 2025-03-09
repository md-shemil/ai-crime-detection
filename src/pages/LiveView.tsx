import React, { useState, useRef } from "react";
import { Grid2X2, Grid3X3, Maximize2 } from "lucide-react";

const LiveView: React.FC = () => {
  const [layout, setLayout] = useState<"2x2" | "3x3">("2x2");
  const videoRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const cameras = [
    {
      id: 1,
      name: "Camera 1",
      url: "http://172.16.44.140:5000/video_feed",
      status: "online",
    },
    // Add more cameras if needed
  ];

  const handleFullscreen = (cameraId: number) => {
    const videoElement = videoRefs.current[cameraId];
    if (videoElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if ((videoElement as any).webkitRequestFullscreen) {
        (videoElement as any).webkitRequestFullscreen(); // Safari
      } else if ((videoElement as any).mozRequestFullScreen) {
        (videoElement as any).mozRequestFullScreen(); // Firefox
      } else if ((videoElement as any).msRequestFullscreen) {
        (videoElement as any).msRequestFullscreen(); // IE/Edge
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Live View</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLayout("2x2")}
            className={`p-2 rounded ${
              layout === "2x2" ? "bg-blue-100 text-blue-600" : "text-gray-600"
            }`}
          >
            <Grid2X2 size={20} />
          </button>
          <button
            onClick={() => setLayout("3x3")}
            className={`p-2 rounded ${
              layout === "3x3" ? "bg-blue-100 text-blue-600" : "text-gray-600"
            }`}
          >
            <Grid3X3 size={20} />
          </button>
        </div>
      </div>

      <div
        className={`grid gap-4 ${
          layout === "2x2" ? "grid-cols-2" : "grid-cols-3"
        }`}
      >
        {cameras.map((camera) => (
          <div
            key={camera.id}
            ref={(el) => (videoRefs.current[camera.id] = el)}
            className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden group"
          >
            {/* Display Live Video Feed */}
            <img
              src={camera.url}
              alt={camera.name}
              className="w-full h-full object-cover"
            />

            {/* Camera Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{camera.name}</p>
                  <p className="text-sm text-gray-300">
                    {camera.status === "online" ? (
                      <span className="text-green-400">● Online</span>
                    ) : (
                      <span className="text-red-400">● Offline</span>
                    )}
                  </p>
                </div>
                {/* Fullscreen Button */}
                <button
                  onClick={() => handleFullscreen(camera.id)}
                  className="p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Maximize2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveView;
