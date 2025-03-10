import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import axios from "axios";

function Settings() {
  const [cameras, setCameras] = useState([]);
  const [cameraName, setCameraName] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/cameras");
      setCameras(response.data);
    } catch (error) {
      console.error("Error fetching cameras:", error);
    }
  };

  const handleSave = async () => {
    const cameraData = { name: cameraName, streamUrl, location };

    try {
      await axios.post("http://localhost:5000/api/cameras", cameraData);
      setCameraName("");
      setStreamUrl("");
      setLocation("");
      fetchCameras();
    } catch (error) {
      console.error("Error saving camera:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cameras/${id}`);
      fetchCameras();
    } catch (error) {
      console.error("Error deleting camera:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Camera Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Add New Camera</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Camera Name
            </label>
            <input
              type="text"
              value={cameraName}
              onChange={(e) => setCameraName(e.target.value)}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stream URL</label>
            <input
              type="text"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Save Camera
          </button>
        </div>
      </div>

      {/* Camera List */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Existing Cameras</h2>

        {cameras.length === 0 ? (
          <p className="text-gray-500">No cameras added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-3 border">Camera</th>
                  <th className="p-3 border">URL</th>
                  <th className="p-3 border">Location</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cameras.map((camera) => (
                  <tr key={camera.id} className="border-t hover:bg-gray-100">
                    <td className="p-3 border">{camera.name}</td>
                    <td className="p-3 border">
                      <a
                        href={camera.streamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                      >
                        {camera.streamUrl}
                      </a>
                    </td>
                    <td className="p-3 border">{camera.location}</td>
                    <td className="p-3 border">
                      <button
                        onClick={() => handleDelete(camera.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
