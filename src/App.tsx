import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import Login from './pages/Login';
import Register from './pages/Register';
import Timeline from './pages/Timeline';

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = !!token;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Timeline /></PrivateRoute>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
