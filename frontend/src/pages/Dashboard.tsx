import React from "react";
import { Map } from "react-map-gl";
import { AlertTriangle, Camera as CameraIcon, CheckCircle } from "lucide-react";
import { useStore } from "../store";

function Dashboard() {
  const alerts = useStore((state) => state.alerts);
  const cameras = useStore((state) => state.cameras);

  const stats = [
    {
      name: "Active Cameras",
      value: cameras.filter((c) => c.status === "online").length,
      total: cameras.length,
      icon: CameraIcon,
    },
    {
      name: "Open Alerts",
      value: alerts.filter((a) => a.status === "new").length,
      total: alerts.length,
      icon: AlertTriangle,
    },
    {
      name: "Resolved Incidents",
      value: alerts.filter((a) => a.status === "resolved").length,
      total: alerts.length,
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold mt-1">
                    {stat.value}/{stat.total}
                  </p>
                </div>
                <Icon className="text-blue-500" size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Map */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Camera Locations</h2>
        <div className="h-[400px] rounded-lg overflow-hidden">
          <Map
            initialViewState={{
              longitude: -122.4,
              latitude: 37.8,
              zoom: 12,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
          />
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
        <div className="space-y-4">
          {alerts.slice(0, 5).map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{alert.type.replace("_", " ")}</p>
                <p className="text-sm text-gray-500">
                  Camera: {cameras.find((c) => c.id === alert.cameraId)?.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded ${
                    alert.severity === "high"
                      ? "bg-red-100 text-red-800"
                      : alert.severity === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {alert.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
