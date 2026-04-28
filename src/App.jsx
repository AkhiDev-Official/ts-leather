import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Credits from './pages/Credits';
import Customize from './pages/Customize';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import OrderDetail from './pages/OrderDetail';
import Admin from './pages/Admin';
import { Winter, Spring, Summer, Autumn } from './pages/Season';
import './styles/global.css';

/* Instant scroll top */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

/* "scroll-to-top" btn (400px to show) */
function ScrollTopButton() {
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isAdmin) return null;

  return (
    <button
      className={`scroll-top-btn ${visible ? 'scroll-top-btn--visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
    >
      <span className="material-symbols-outlined">keyboard_arrow_up</span>
    </button>
  );
}

function AppShell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/collection/winter" element={<Winter />} />
        <Route path="/collection/spring" element={<Spring />} />
        <Route path="/collection/summer" element={<Summer />} />
        <Route path="/collection/autumn" element={<Autumn />} />
        <Route path="/customize/:slug" element={<Customize />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/order/:orderNumber" element={<OrderDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/credits" element={<Credits />} />
      </Routes>
      {!isAdmin && <Footer />}
      <ScrollTopButton />
    </>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem('ts_splash_seen')
  );

  const handleSplashComplete = useCallback(() => {
    sessionStorage.setItem('ts_splash_seen', '1');
    setShowSplash(false);
  }, []);

  return (
    <AuthProvider>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
