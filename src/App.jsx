import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Page components
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CustomizePage from './pages/CustomizePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminSettingsNotificationsPage from './pages/AdminSettingsNotificationsPage';
import HowToUsePage from './pages/HowToUsePage';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import NeonLoadingScreen from './components/NeonLoadingScreen';
import { API_URL } from './utils/api';
import { useScrollToTop } from './hooks/useScrollToTop';

// Fires on every route change — applied globally
function ScrollToTop() {
  useScrollToTop();
  return null;
}

function App() {
  const [apiReady, setApiReady] = useState(false);
  const [loadingText, setLoadingText] = useState('Connecting to server...');

  useEffect(() => {
    const texts = [
      'Connecting to server...',
      'Loading NEONTHREADS...',
      'Almost ready...'
    ];
    let index = 0;

    const textInterval = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 2000);

    const checkAPI = async () => {
      try {
        const res = await fetch(`${API_URL}/health`, { credentials: 'include' });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.status === 'ok') {
          setApiReady(true);
        }
      } catch (err) {
        // Keep checking
      }
    };

    const pollInterval = setInterval(checkAPI, 2000);
    checkAPI();

    return () => {
      clearInterval(textInterval);
      clearInterval(pollInterval);
    };
  }, []);

  if (!apiReady) {
    return <NeonLoadingScreen text={loadingText} />;
  }
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-8">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/customize" element={
                  <ProtectedRoute>
                    <CustomizePage />
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<LoginPage />} />
                <Route path="/how-to-use" element={<HowToUsePage />} />

                {/* Protected User Routes */}
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } />
                <Route path="/order-success" element={
                  <ProtectedRoute>
                    <OrderSuccessPage />
                  </ProtectedRoute>
                } />
                <Route path="/my-orders" element={
                  <ProtectedRoute>
                    <MyOrdersPage />
                  </ProtectedRoute>
                } />

                {/* Protected Admin Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminOrdersPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/settings/notifications" element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminSettingsNotificationsPage />
                  </ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#0a0a0a',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                }
              }}
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
