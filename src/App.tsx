import { Component, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Gallery } from './pages/Gallery';
import { Order } from './pages/Order';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/admin/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminOrders } from './pages/admin/Orders';
import { AdminGalleryManager } from './pages/admin/GalleryManager';
import { AdminPricing } from './pages/admin/Pricing';
import { isConfigured } from './lib/firebase';

// ── Error boundary ─────────────────────────────────────────────────────────

interface ErrorBoundaryState { error: Error | null }

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6"
          style={{ background: 'var(--bg-base)' }}>
          <div className="max-w-md text-center space-y-4">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 rounded-full
              flex items-center justify-center mx-auto">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>
              Something went wrong
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-3)' }}>
              {this.state.error.message}
            </p>
            <button
              className="px-4 py-2 rounded-lg text-sm border transition-colors"
              style={{
                background: 'var(--accent-subtle)',
                borderColor: 'var(--border-hover)',
                color: 'var(--text-1)',
              }}
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Firebase banner ────────────────────────────────────────────────────────

function ConfigBanner() {
  if (isConfigured) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-amber-400/25
      px-4 py-3 flex items-center gap-3"
      style={{ background: 'var(--bg-card)' }}>
      <span className="text-amber-500 text-lg">⚠</span>
      <p className="text-sm text-amber-600 flex-1">
        <strong>Firebase not configured.</strong>{' '}
        Copy <code className="bg-amber-100 dark:bg-amber-900/30 px-1 rounded text-xs">.env.example</code> to{' '}
        <code className="bg-amber-100 dark:bg-amber-900/30 px-1 rounded text-xs">.env</code> and add credentials.
      </p>
    </div>
  );
}

// ── Layouts ────────────────────────────────────────────────────────────────

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main><Outlet /></main>
      <Footer />
    </>
  );
}

function RequireAuth() {
  const { user, loading } = useAuthContext();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg-base)' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}/>
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/order" element={<Order />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<RequireAuth />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/gallery" element={<AdminGalleryManager />} />
        <Route path="/admin/pricing" element={<AdminPricing />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes />
            <ConfigBanner />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  borderRadius: '10px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  background: 'var(--bg-card)',
                  color: 'var(--text-1)',
                  border: '1px solid var(--border)',
                },
                success: { iconTheme: { primary: '#22c55e', secondary: 'var(--bg-card)' } },
                error:   { iconTheme: { primary: '#ef4444', secondary: 'var(--bg-card)' } },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
