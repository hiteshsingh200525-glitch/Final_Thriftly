import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ToastProvider } from './context/ToastContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import Sell from './pages/Sell';
import ProductDetails from './pages/ProductDetails';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Favorites from './pages/Favorites';
import Cart from './pages/Cart';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Authenticating...</p>
      </div>
    );
  }
  if (!currentUser) return <Navigate to="/login" />;
  return children;
};

// Component to handle conditional Navbar rendering
const LayoutWithNavbar = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/signup'];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  if (shouldHideNavbar) return null;
  return <Navbar />;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <FavoritesProvider>
            <Router>
              <div className="app-container">
                <LayoutWithNavbar />
                <main className="content page-enter">
                  <Routes>
                    <Route path="/login" element={<Auth />} />
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    } />
                    <Route path="/product/:id" element={
                      <ProtectedRoute>
                        <ProductDetails />
                      </ProtectedRoute>
                    } />
                    <Route path="/sell" element={
                      <ProtectedRoute>
                        <Sell />
                      </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/favorites" element={
                      <ProtectedRoute>
                        <Favorites />
                      </ProtectedRoute>
                    } />
                    <Route path="/cart" element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    } />
                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>
              </div>
            </Router>
          </FavoritesProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
