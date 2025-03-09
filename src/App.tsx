import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LiveView from './pages/LiveView';
import Incidents from './pages/Incidents';
import Settings from './pages/Settings';
import Login from './pages/Login';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = useStore((state) => state.user);
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="live" element={<LiveView />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;