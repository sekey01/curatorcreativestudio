import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

export function AdminLogin() {
  const { signIn, authLoading, authError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = await signIn(email, password);
    if (ok) navigate('/admin');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-sm">

        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors duration-200"
          style={{ color: 'var(--text-3)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-1)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
        >
          <ArrowLeft size={14}/>
          Back to site
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--accent-medium)', border: '1px solid var(--border-hover)' }}>
            <span className="font-bold text-xl" style={{ color: 'var(--text-1)' }}>C</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-1)' }}>Admin Login</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>Curator Creative Studio</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
        }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@curatorcreativestudio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] transition-colors cursor-pointer"
                style={{ color: 'var(--text-3)' }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3 rounded-lg"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                }}>
                <Lock size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-500">{authError}</p>
              </div>
            )}

            <Button type="submit" loading={authLoading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-4)' }}>
          Admin access only. Contact the developer to create an account.
        </p>
      </div>
    </div>
  );
}
