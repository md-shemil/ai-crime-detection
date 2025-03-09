import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Camera, Bell, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { useStore } from "../store";

function Layout() {
  const location = useLocation();
  const user = useStore((state) => state.user);

  const navigation = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Live View", path: "/live", icon: Camera },
    { name: "Incidents", path: "/incidents", icon: Bell },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - Fixed and Unscrollable */}
      <div className="w-64 bg-white shadow-lg h-screen flex flex-col overflow-hidden">
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-xl font-bold">AI CCTV Monitor</h1>
        </div>
        <nav className="p-4 flex-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg mb-1 ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="w-full p-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-auto h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
