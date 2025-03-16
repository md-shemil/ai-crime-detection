import React, { useState, useEffect } from "react";
import { useStore } from "../store"; // Assuming you have Zustand for state management

function Incidents() {
  const alerts = useStore((state) => state.alerts);
  const updateAlertStatus = useStore((state) => state.updateAlertStatus);
  const addAlert = useStore((state) => state.addAlert);
  const [filter, setFilter] = useState("all");

  // Fetch alerts from Flask server every second
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://172.16.44.139:5000/api/alert")
        .then((response) => response.json())
        .then((data) => {
          if (
            data.message.includes("detected") &&
            !data.message.includes("No threat")
          ) {
            const type = data.message
              .replace(" detected!", "")
              .replace(" ", "_");
            const severity = ["violence", "gun", "weapon"].some((keyword) =>
              data.message.includes(keyword)
            )
              ? "critical"
              : "high";

            addAlert({
              id: Date.now(), // Unique ID
              timestamp: new Date().toISOString(),
              type,
              severity,
              status: "new",
            });
          }
        })
        .catch((error) => console.error("Error fetching alerts:", error));
    }, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [addAlert]);

  const filteredAlerts = alerts.filter(
    (alert) => filter === "all" || alert.status === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Incident Management</h1>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border-gray-300"
          >
            <option value="all">All Incidents</option>
            <option value="new">New</option>
            <option value="reviewing">Reviewing</option>
            <option value="resolved">Resolved</option>
            <option value="false_positive">False Positive</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAlerts.map((alert) => (
              <tr key={alert.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(alert.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="capitalize">
                    {alert.type.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      alert.severity === "critical"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {alert.severity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="capitalize">
                    {alert.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <select
                    value={alert.status}
                    onChange={(e) =>
                      updateAlertStatus(alert.id, e.target.value)
                    }
                    className="rounded-md border-gray-300 text-sm"
                  >
                    <option value="new">New</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="resolved">Resolved</option>
                    <option value="false_positive">False Positive</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Incidents;
