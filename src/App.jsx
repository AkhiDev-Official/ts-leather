import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { /* no AuthProvider here - provided in index */ } from './components/AuthContext';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products/Products';
import ProductDetail from './pages/Products/Product/ProductDetail';
import Credits from './pages/Credits';
import Customize from './pages/Products/Customize';
import Login from './pages/User/Login';
import Register from './pages/User/Register';
import Account from './pages/User/Account';
import OrderDetail from './pages/OrderDetail';
import Admin from './pages/Admin/Admin';
import Cart from './pages/Cart';
import { Winter, Spring, Summer, Autumn } from './pages/Products/Season';
import './styles/global.css';
import { useDispatch } from 'react-redux';
import { setProducts } from './store/slices/productsSlice';
import { setUser } from './store/slices/userSlice';
import { setCart } from './store/slices/cartSlice';
import { setOrders } from './store/slices/ordersSlice';
import { PRODUCTS } from './data/products';

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
      <Navbar />
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
        <Route path="/cart" element={<Cart />} />
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

  // seed redux from local mocks / storage on first mount
  const dispatch = useDispatch();
  useEffect(() => {
    // seed products (fallback to existing mock data)
    if (PRODUCTS && PRODUCTS.length) dispatch(setProducts(PRODUCTS));

    // seed user from sessionStorage if present (AuthContext uses 'ts_auth_user')
    try {
      const rawUser = sessionStorage.getItem('ts_auth_user');
      if (rawUser) dispatch(setUser(JSON.parse(rawUser)));
    } catch (e) { /* ignore */ }

    // seed cart from localStorage key 'ts_cart' or 'cart' if present
    try {
      const rawCart = localStorage.getItem('ts_cart') || localStorage.getItem('cart');
      if (rawCart) dispatch(setCart(JSON.parse(rawCart)));
    } catch (e) { /* ignore */ }

    // optionally seed orders if you have mock ORDERS exported
    try {
      const rawOrders = localStorage.getItem('ts_orders');
      if (rawOrders) dispatch(setOrders(JSON.parse(rawOrders)));
    } catch (e) { /* ignore */ }
  }, [dispatch]);

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </>
  );
}

export default App;
