import React from 'react';
import { Camera, Bell, Brain } from 'lucide-react';

function Settings() {
  const sections = [
    {
      title: 'Camera Management',
      icon: Camera,
      description: 'Configure camera connections and streaming settings',
      fields: [
        { label: 'Camera Name', type: 'text' },
        { label: 'Stream URL', type: 'text' },
        { label: 'Location', type: 'text' },
      ],
    },
    {
      title: 'Alert Configuration',
      icon: Bell,
      description: 'Set up alert thresholds and notification preferences',
      fields: [
        { label: 'Minimum Confidence Score', type: 'range' },
        { label: 'Alert Frequency', type: 'select' },
        { label: 'Email Notifications', type: 'checkbox' },
      ],
    },
    {
      title: 'AI Model Settings',
      icon: Brain,
      description: 'Adjust AI detection parameters and sensitivity',
      fields: [
        { label: 'Detection Threshold', type: 'range' },
        { label: 'Processing Resolution', type: 'select' },
        { label: 'Enable Night Mode', type: 'checkbox' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="grid grid-cols-1 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Icon className="text-blue-500" size={24} />
                <div>
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.label}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    {field.type === 'text' && (
                      <input
                        type="text"
                        className="w-full rounded-lg border-gray-300"
                      />
                    )}
                    {field.type === 'range' && (
                      <input
                        type="range"
                        className="w-full"
                        min="0"
                        max="100"
                      />
                    )}
                    {field.type === 'select' && (
                      <select className="w-full rounded-lg border-gray-300">
                        <option>Select an option</option>
                      </select>
                    )}
                    {field.type === 'checkbox' && (
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="ml-2">Enable</span>
                      </label>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Settings