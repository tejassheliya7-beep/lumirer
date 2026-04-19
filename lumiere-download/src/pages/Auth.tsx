import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import logoImg from '@/assets/logo.jpg';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type AuthMode = 'login' | 'signup' | 'forgot';

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const, staggerChildren: 0.08 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/', { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/', { replace: true });
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Offline Database Verification
    setTimeout(() => {
      setLoading(false);
      const db = JSON.parse(localStorage.getItem('lumiere_db') || '[]');
      const adminEmails = ['admin@lumiere.com']; // Auto-admin
      
      const isGoogle = email === 'google-auth';
      const user = isGoogle ? { email: 'google@test.com', displayName: 'Google User' } : db.find((u: any) => u.email === email && u.password === password);
      
      if (user || adminEmails.includes(email)) {
        localStorage.setItem('lumiere_session', JSON.stringify(user || { email, displayName: 'Admin' }));
        toast({ title: 'Welcome Back', description: `Successfully signed in as ${user?.displayName || email}` });
        navigate('/', { replace: true });
      } else {
        toast({ title: 'Login failed', description: 'Invalid email or password. Are you sure you made an account?', variant: 'destructive' });
      }
    }, 800);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Offline Database Insertion
    setTimeout(() => {
      setLoading(false);
      const db = JSON.parse(localStorage.getItem('lumiere_db') || '[]');
      
      if (db.find((u: any) => u.email === email)) {
        toast({ title: 'Signup failed', description: 'This email is already registered!', variant: 'destructive' });
        return;
      }

      const newUser = { id: crypto.randomUUID(), email, password, display_name: displayName, created_at: new Date() };
      db.push(newUser);
      
      localStorage.setItem('lumiere_db', JSON.stringify(db));
      localStorage.setItem('lumiere_session', JSON.stringify(newUser));
      
      toast({ title: 'Account Created', description: `Welcome to Lumière, ${displayName || email}!` });
      navigate('/', { replace: true });
    }, 800);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock Forgot Password
    setTimeout(() => {
      setLoading(false);
      toast({ title: 'Email sent', description: 'Check your inbox for a password reset link.' });
      setMode('login');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex lg:w-1/2 bg-foreground items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 text-center px-12"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <img src={logoImg} alt="Lumière Jewel" className="h-20 w-auto object-contain rounded-sm" />
          </div>
          <h1 className="font-serif text-4xl text-background mb-4 tracking-wide">LUMIÈRE <span className="text-primary">Jewel</span></h1>
          <p className="text-background/60 text-sm uppercase tracking-[0.25em]">Where Elegance Meets Eternity</p>
        </motion.div>
      </motion.div>

      {/* Right form panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex-1 flex items-center justify-center px-6 py-12"
      >
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to store
            </Link>
          </motion.div>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src={logoImg} alt="Lumière Jewel" className="h-12 w-auto object-contain" />
            <div className="flex flex-col leading-none">
              <span className="font-serif text-xl tracking-wide text-gold-gradient">LUMIÈRE</span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Jewel</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.h2 variants={itemVariants} className="font-serif text-3xl mb-2">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot' && 'Reset Password'}
              </motion.h2>
              <motion.p variants={itemVariants} className="text-muted-foreground text-sm mb-8">
                {mode === 'login' && 'Sign in to access your account and wishlist.'}
                {mode === 'signup' && 'Join us for an exclusive shopping experience.'}
                {mode === 'forgot' && 'Enter your email to receive a reset link.'}
              </motion.p>

              <form onSubmit={mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handleForgotPassword} className="space-y-5">
                {mode === 'signup' && (
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="displayName" className="text-xs uppercase tracking-[0.1em]">Full Name</Label>
                    <Input id="displayName" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your full name" required maxLength={100} />
                  </motion.div>
                )}

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="email" className="text-xs uppercase tracking-[0.1em]">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required maxLength={255} />
                </motion.div>

                {mode !== 'forgot' && (
                  <motion.div variants={itemVariants} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs uppercase tracking-[0.1em]">Password</Label>
                      {mode === 'login' && (
                        <button type="button" onClick={() => setMode('forgot')} className="text-xs text-primary hover:text-primary/80 transition-colors">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  <Button type="submit" variant="luxury" size="xl" className="w-full" disabled={loading}>
                    {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                  </Button>
                </motion.div>

                {mode !== 'forgot' && (
                  <motion.div variants={itemVariants}>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                      <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-3 text-muted-foreground">or continue with</span></div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => {
                        const googleUser = {
                          id: 'google-' + Date.now(),
                          email: 'google@lumiere.com',
                          display_name: 'Google User',
                          created_at: new Date().toISOString(),
                        };
                        toast({ title: 'Google Sign In', description: 'Logged in with Google successfully!' });
                        localStorage.setItem('lumiere_session', JSON.stringify(googleUser));
                        navigate('/', { replace: true });
                      }}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Google
                    </Button>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            {mode === 'login' ? (
              <>Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Create one
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Sign in
                </button>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
