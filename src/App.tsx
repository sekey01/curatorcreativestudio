import { Component, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuthContext } from './context/AuthContext';
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
import { isConfigured } from './lib/firebase';

// ── Error boundary ──────────────────────────────────────────────────────────

interface ErrorBoundaryState { error: Error | null }

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAF9]">
          <div className="max-w-md text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h1 className="text-xl font-bold text-[#111827]">Something went wrong</h1>
            <p className="text-sm text-[#6B7280]">{this.state.error.message}</p>
            <button
              className="px-4 py-2 bg-[#1D9E75] text-white rounded-lg text-sm"
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

// ── Firebase not configured banner ────────────────────────────────────────

function ConfigBanner() {
  if (isConfigured) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-50 border-t border-amber-200 px-4 py-3 flex items-center gap-3">
      <span className="text-amber-600 text-lg">⚠</span>
      <p className="text-sm text-amber-800 flex-1">
        <strong>Firebase not configured.</strong> Copy{' '}
        <code className="bg-amber-100 px-1 rounded">.env.example</code> to{' '}
        <code className="bg-amber-100 px-1 rounded">.env</code> and add your Firebase credentials.
        See <strong>README.md</strong> for setup steps.
      </p>
    </div>
  );
}

// ── Layouts ───────────────────────────────────────────────────────────────

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function RequireAuth() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

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
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
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
              },
              success: {
                style: { background: '#E8F5F0', color: '#0F6E56', border: '1px solid #1D9E75' },
                iconTheme: { primary: '#1D9E75', secondary: '#fff' },
              },
              error: {
                style: { background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FCA5A5' },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
