import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Calendar, Edit2, Save, X, ShoppingBag, Heart, LogOut } from 'lucide-react';

interface LocalUser {
  id: string;
  email: string;
  display_name?: string;
  displayName?: string;
  created_at: string;
}

const Account = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [memberSince, setMemberSince] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOfflineUser, setIsOfflineUser] = useState(false);
  const [offlineUserId, setOfflineUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadUser = async () => {
      // 1. Try Supabase session first
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setEmail(session.user.email || '');
          setMemberSince(session.user.created_at || '');
          setIsOfflineUser(false);

          // Load profile from Supabase
          const { data } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', session.user.id)
            .maybeSingle();

          setDisplayName(data?.display_name || '');
          setLoading(false);
          return;
        }
      } catch (_) {
        // Supabase unavailable — fall through to offline check
      }

      // 2. Fallback: check offline lumiere_session
      const rawSession = localStorage.getItem('lumiere_session');
      if (!rawSession) {
        navigate('/auth');
        return;
      }

      try {
        let localUser: LocalUser;
        if (rawSession === 'google-auth') {
          // Legacy Google auth string — treat as a generic user
          localUser = {
            id: 'google-user',
            email: 'google@lumiere.com',
            display_name: 'Google User',
            created_at: new Date().toISOString(),
          };
        } else {
          localUser = JSON.parse(rawSession) as LocalUser;
        }

        setEmail(localUser.email || '');
        setDisplayName(localUser.display_name || localUser.displayName || '');
        setMemberSince(localUser.created_at || new Date().toISOString());
        setOfflineUserId(localUser.id || null);
        setIsOfflineUser(true);
      } catch {
        // Corrupt session — clear and redirect
        localStorage.removeItem('lumiere_session');
        navigate('/auth');
        return;
      }

      setLoading(false);
    };

    loadUser();
  }, [navigate]);

  const handleSave = async () => {
    setSaving(true);

    if (isOfflineUser) {
      // Update offline DB
      try {
        const db: LocalUser[] = JSON.parse(localStorage.getItem('lumiere_db') || '[]');
        const updated = db.map((u) =>
          u.id === offlineUserId ? { ...u, display_name: displayName } : u
        );
        localStorage.setItem('lumiere_db', JSON.stringify(updated));

        // Also update session
        const rawSession = localStorage.getItem('lumiere_session');
        if (rawSession && rawSession !== 'google-auth') {
          const session = JSON.parse(rawSession);
          localStorage.setItem('lumiere_session', JSON.stringify({ ...session, display_name: displayName }));
        }

        setEditing(false);
        toast({ title: 'Profile updated!' });
      } catch {
        toast({ title: 'Error', description: 'Failed to update profile.', variant: 'destructive' });
      }
      setSaving(false);
      return;
    }

    // Supabase update
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) { setSaving(false); return; }

    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', session.user.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update profile.', variant: 'destructive' });
    } else {
      setEditing(false);
      toast({ title: 'Profile updated!' });
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    if (isOfflineUser) {
      localStorage.removeItem('lumiere_session');
      toast({ title: 'Signed out', description: 'See you again soon!' });
      navigate('/');
      return;
    }
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-luxury py-20 text-center text-muted-foreground">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-luxury py-12 max-w-2xl">
        <h1 className="font-serif text-3xl mb-8">My Account</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-primary" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Display Name</Label>
              {editing ? (
                <div className="flex gap-2 mt-1">
                  <Input value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={100} />
                  <Button size="icon" onClick={handleSave} disabled={saving}><Save className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setEditing(false)}><X className="w-4 h-4" /></Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-base">{displayName || '—'}</p>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(true)}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>

            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Email</Label>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <p className="text-base">{email}</p>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Member Since</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-base">
                  {memberSince
                    ? new Date(memberSince).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                    : '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2" onClick={() => navigate('/wishlist')}>
              <Heart className="w-4 h-4" /> My Wishlist
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => navigate('/cart')}>
              <ShoppingBag className="w-4 h-4" /> My Cart
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => navigate('/track-order')}>
              Track Order
            </Button>
            <Button variant="destructive" className="gap-2 ml-auto" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Account;
