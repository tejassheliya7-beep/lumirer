import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { generateAdminToken, verifyAdminToken } from '@/lib/authService';

interface AdminAuthProps {
  children: React.ReactNode;
}

const SESSION_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour

const AdminAuth: React.FC<AdminAuthProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(true);

  const logout = useCallback(() => {
    sessionStorage.removeItem('admin_jwt');
    sessionStorage.removeItem('admin_login_time');
    setIsAuthenticated(false);
    toast.info('Session ended. Please log in again.');
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      const token = sessionStorage.getItem('admin_jwt');
      const loginTime = sessionStorage.getItem('admin_login_time');
      if (token && loginTime) {
        const elapsed = Date.now() - parseInt(loginTime, 10);
        if (elapsed > SESSION_TIMEOUT_MS) {
          sessionStorage.removeItem('admin_jwt');
          sessionStorage.removeItem('admin_login_time');
          toast.error('Session expired. Please log in again.');
          setIsVerifying(false);
          return;
        }
        const isValid = await verifyAdminToken(token);
        if (isValid) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem('admin_jwt');
          sessionStorage.removeItem('admin_login_time');
        }
      }
      setIsVerifying(false);
    };
    checkToken();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const loginTime = sessionStorage.getItem('admin_login_time');
    if (!loginTime) return;
    const remaining = SESSION_TIMEOUT_MS - (Date.now() - parseInt(loginTime, 10));
    if (remaining <= 0) { logout(); return; }
    const timer = setTimeout(logout, remaining);
    return () => clearTimeout(timer);
  }, [isAuthenticated, logout]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    if (!adminPassword) {
      toast.error('Admin password not configured. Set VITE_ADMIN_PASSWORD in Netlify environment variables.');
      return;
    }
    if (password === adminPassword) {
      const token = await generateAdminToken();
      sessionStorage.setItem('admin_jwt', token);
      sessionStorage.setItem('admin_login_time', Date.now().toString());
      setIsAuthenticated(true);
      toast.success('Welcome back! Session valid for 1 hour.');
    } else {
      toast.error('Invalid password');
    }
  };

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Verifying secure session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <div className="fixed top-4 right-4 z-[9999]">
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="bg-white shadow-md text-red-600 border-red-200 hover:bg-red-50"
          >
            Logout
          </Button>
        </div>
        {children}
      </>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Admin Login</h2>
          <p className="text-sm text-gray-500 mt-1">Lumière Management Panel</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Admin Password"
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full bg-[#1A1F2C] hover:bg-[#2A2F3C] text-white">
            Login
          </Button>
        </form>
        <p className="text-xs text-center text-gray-400 mt-4">Session expires after 1 hour</p>
      </div>
    </div>
  );
};

export default AdminAuth;
