import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser as setReduxUser, updateUser as updateReduxUser, logout as reduxLogout } from '../store/slices/userSlice';
import { setOrders, clearOrders } from '../store/slices/ordersSlice';
import { clearCart } from '../store/slices/cartSlice';
import { buildMockOrders } from '../data/mockOrders';
import { DEMO_USER, ADMIN_USER, DEMO_ADDRESSES, DEMO_WISHLIST } from '../data/mockUsers';

const AuthContext = createContext(null);

const USERS_KEY = 'ts_users_db';

function loadUsersDB() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const db = raw ? JSON.parse(raw) : {};
    if (!db[DEMO_USER.email]) db[DEMO_USER.email] = DEMO_USER;
    if (!db[ADMIN_USER.email]) db[ADMIN_USER.email] = ADMIN_USER;
    return db;
  } catch { return { [DEMO_USER.email]: DEMO_USER, [ADMIN_USER.email]: ADMIN_USER }; }
}
function saveUsersDB(db) { localStorage.setItem(USERS_KEY, JSON.stringify(db)); }

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.user);
  const orders = useSelector((s) => s.orders.list);

  const [addresses, setAddresses] = useState(DEMO_ADDRESSES);
  const [wishlist, setWishlist] = useState(DEMO_WISHLIST);

  const login = useCallback((email, password) => {
    const db = loadUsersDB();
    const found = db[email.toLowerCase()];
    if (!found) return { ok: false, error: 'No account found with this email.' };
    if (found.password !== password) return { ok: false, error: 'Incorrect password.' };
    const u = { ...found, lastLoginAt: new Date().toISOString() };
    db[email.toLowerCase()] = u;
    saveUsersDB(db);
    const { password: _, ...safe } = u;
    dispatch(setReduxUser({ user: safe }));
    dispatch(setOrders(safe.id === 'u-001' ? buildMockOrders() : []));
    return { ok: true };
  }, [dispatch]);

  const register = useCallback((data) => {
    const db = loadUsersDB();
    const key = data.email.toLowerCase();
    if (db[key]) return { ok: false, error: 'An account with this email already exists.' };
    const now = new Date().toISOString();
    const newUser = {
      id: 'u-' + Date.now().toString(36),
      email: key, firstName: data.firstName, lastName: data.lastName,
      phone: data.phone || null, role: 'customer', isActive: true,
      emailVerifiedAt: null, lastLoginAt: now, createdAt: now, password: data.password,
    };
    db[key] = newUser;
    saveUsersDB(db);
    const { password: _, ...safe } = newUser;
    dispatch(setReduxUser({ user: safe }));
    dispatch(setOrders([]));
    return { ok: true };
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(reduxLogout());
    dispatch(clearOrders());
    dispatch(clearCart());
  }, [dispatch]);

  const updateProfile = useCallback((updates) => {
    const db = loadUsersDB();
    const key = user?.email;
    if (!key || !db[key]) return;
    Object.assign(db[key], updates);
    saveUsersDB(db);
    dispatch(updateReduxUser(updates));
  }, [user, dispatch]);

  const addAddress = useCallback((addr) => {
    const newAddr = { ...addr, id: 'addr-' + Date.now().toString(36), userId: user?.id };
    if (newAddr.isDefault) {
      setAddresses(prev => prev.map(a => a.type === newAddr.type ? { ...a, isDefault: false } : a).concat(newAddr));
    } else {
      setAddresses(prev => [...prev, newAddr]);
    }
  }, [user]);

  const removeAddress = useCallback((id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  }, []);

  const toggleWishlist = useCallback((slug) => {
    setWishlist(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  }, []);

  const value = useMemo(() => ({
    user, login, register, logout, updateProfile,
    addresses, addAddress, removeAddress,
    orders: user ? orders : [],
    wishlist, toggleWishlist,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  }), [user, login, register, logout, updateProfile, addresses, addAddress, removeAddress, orders, wishlist, toggleWishlist]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
