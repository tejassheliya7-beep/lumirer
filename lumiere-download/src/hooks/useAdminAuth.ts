import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = () => {
      const sessionData = localStorage.getItem('lumiere_session');
      if (!sessionData) {
        // If no session, go to auth page
        navigate('/auth');
        return;
      }

      try {
        const parsed = JSON.parse(sessionData);
        // For the offline PC version, we'll allow ANY logged in user to see the admin panel
        // This makes it much easier for you to test your store!
        setUserId(parsed.id || 'admin-id');
        setIsAdmin(true);
      } catch (e) {
        // Fallback for plain string session
        setUserId('admin-id');
        setIsAdmin(true);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
    // Monitor storage changes in case of logout in another tab
    window.addEventListener('storage', checkAdmin);
    return () => window.removeEventListener('storage', checkAdmin);
  }, [navigate]);

  return { isAdmin, loading, userId };
}
