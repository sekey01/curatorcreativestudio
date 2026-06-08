import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#1D9E75] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">Admin Login</h1>
          <p className="text-sm text-[#6B7280] mt-1">Curator Creative Studio</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
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
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                <Lock size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            )}

            <Button type="submit" loading={authLoading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          Admin access only. Contact the developer to create an account.
        </p>
      </div>
    </div>
  );
}
