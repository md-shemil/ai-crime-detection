import React, { useState, useRef, useEffect, useCallback } from "react";
import { Grid2X2, Grid3X3, Maximize2 } from "lucide-react";
import axios from "axios";

const LiveView: React.FC = () => {
  const [layout, setLayout] = useState<"2x2" | "3x3">("2x2");
  const [cameras, setCameras] = useState<
    { id: number; name: string; streamUrl: string }[]
  >([]);
  const [cameraStatuses, setCameraStatuses] = useState<{
    [key: number]: string;
  }>({});

  const videoRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Fetch camera list from Flask backend
  const fetchCameras = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/cameras");
      setCameras(response.data);
    } catch (error) {
      console.error("Error fetching cameras:", error);
    }
  }, []);

  useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

  // Function to fetch camera statuses
  const fetchCameraStatuses = useCallback(() => {
    cameras.forEach(async (camera) => {
      try {
        const response = await axios.get(`${camera.streamUrl}/api/health`);
        setCameraStatuses((prev) => ({
          ...prev,
          [camera.id]: response.data.camera_status,
        }));
      } catch (error) {
        setCameraStatuses((prev) => ({ ...prev, [camera.id]: "" }));
      }
    });
  }, [cameras]);

  // Poll camera statuses every 10 seconds
  useEffect(() => {
    fetchCameraStatuses();
    const interval = setInterval(fetchCameraStatuses, 10000);
    return () => clearInterval(interval);
  }, [fetchCameraStatuses]);

  // Handle fullscreen mode
  const handleFullscreen = (cameraId: number) => {
    const videoElement = videoRefs.current[cameraId];
    if (videoElement) {
      if (videoElement.requestFullscreen) videoElement.requestFullscreen();
      else if ((videoElement as any).webkitRequestFullscreen)
        (videoElement as any).webkitRequestFullscreen();
      else if ((videoElement as any).mozRequestFullScreen)
        (videoElement as any).mozRequestFullScreen();
      else if ((videoElement as any).msRequestFullscreen)
        (videoElement as any).msRequestFullscreen();
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
            {/* Video Feed */}
            <img
              id={`video-${camera.id}`}
              src={`${camera.streamUrl}?${new Date().getTime()}`} // Prevent caching issues
              alt={camera.name}
              className="w-full h-full object-cover"
            />

            {/* Camera Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{camera.name}</p>
                  <p className="text-sm text-gray-300">
                    {cameraStatuses[camera.id] === "online" ? (
                      <span className="text-green-400">● Online</span>
                    ) : (
                      <span className="text-red-400"></span>
                    )}
                  </p>
                </div>
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
