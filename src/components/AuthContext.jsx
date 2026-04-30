import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { PRODUCTS } from '../pages/Products/Products';

const AuthContext = createContext(null);

const STORAGE_KEY = 'ts_auth_user';
const USERS_KEY = 'ts_users_db';

/* ── Demo users ── */
const DEMO_USER = {
  id: 'u-001',
  email: 'test@mail.com',
  firstName: 'Test',
  lastName: 'Client',
  phone: '+33 6 00 00 00 00',
  role: 'customer',
  isActive: true,
  emailVerifiedAt: '2025-11-15T10:30:00Z',
  lastLoginAt: '2026-04-26T18:45:00Z',
  createdAt: '2025-11-15T10:30:00Z',
  password: 'test123!',
};

const ADMIN_USER = {
  id: 'u-admin',
  email: 'admin@mail.com',
  firstName: 'Admin',
  lastName: 'TS',
  phone: '+33 1 00 00 00 00',
  role: 'admin',
  isActive: true,
  emailVerifiedAt: '2025-01-01T00:00:00Z',
  lastLoginAt: '2026-04-27T08:00:00Z',
  createdAt: '2025-01-01T00:00:00Z',
  password: 'admin123!',
};

/* ── Fake data ── */
const DEMO_ADDRESSES = [
  {
    id: 'addr-001', userId: 'u-001', type: 'shipping',
    firstName: 'Test', lastName: 'Client', phone: '+33 6 00 00 00 00',
    addressLine1: '24 Rue du Faubourg Saint-Honoré', addressLine2: 'Apt 3B',
    city: 'Paris', postalCode: '75008', country: 'France', isDefault: true,
  },
  {
    id: 'addr-002', userId: 'u-001', type: 'billing',
    firstName: 'Test', lastName: 'Client', phone: '+33 6 00 00 00 00',
    addressLine1: '24 Rue du Faubourg Saint-Honoré', addressLine2: 'Apt 3B',
    city: 'Paris', postalCode: '75008', country: 'France', isDefault: true,
  },
  {
    id: 'addr-003', userId: 'u-001', type: 'shipping',
    firstName: 'Test', lastName: 'Client', phone: '+33 6 00 00 00 00',
    addressLine1: '15 Avenue des Champs-Élysées', addressLine2: null,
    city: 'Paris', postalCode: '75001', country: 'France', isDefault: false,
  },
];

function buildMockOrders() {
  const p = (slug) => PRODUCTS.find(pr => pr.slug === slug);
  return [
    {
      id: 'ord-001', orderNumber: 'TS-2026-001847', userId: 'u-001',
      customerEmail: 'test@mail.com', customerFirstName: 'Test', customerLastName: 'Client',
      status: 'delivered', paymentStatus: 'paid', shippingStatus: 'delivered',
      currency: 'EUR', subtotalAmount: 1250, customizationAmount: 0,
      discountAmount: 187.50, shippingAmount: 0, taxAmount: 212.50, totalAmount: 1275,
      orderedAt: '2026-02-14T09:22:00Z', paidAt: '2026-02-14T09:23:00Z',
      shippedAt: '2026-02-18T14:00:00Z', deliveredAt: '2026-02-21T11:30:00Z',
      shippingAddress: DEMO_ADDRESSES[0], billingAddress: DEMO_ADDRESSES[1],
      items: [{
        id: 'oi-001', productName: 'The Aviator Jacket', productSlug: 'the-aviator-jacket',
        variantSku: 'TSL-AVI-COG-L', sizeLabel: 'L', color: 'Cognac',
        quantity: 1, unitPrice: 1250, customizationPrice: 0, discountAmount: 187.50,
        taxAmount: 212.50, totalAmount: 1275,
        image: p('the-aviator-jacket')?.images?.[0] || '/assets/jacket.jpg',
      }],
      payment: { provider: 'stripe', status: 'paid', amount: 1275, paymentMethod: 'Visa •••• 4242', paidAt: '2026-02-14T09:23:00Z' },
      shipment: { carrier: 'Colissimo', trackingNumber: 'CC123456789FR', trackingUrl: '#', shippingMethod: 'Express', status: 'delivered', shippedAt: '2026-02-18T14:00:00Z', deliveredAt: '2026-02-21T11:30:00Z' },
      statusHistory: [
        { status: 'pending', date: '2026-02-14T09:22:00Z', note: 'Order placed' },
        { status: 'confirmed', date: '2026-02-14T09:23:00Z', note: 'Payment confirmed via Stripe' },
        { status: 'processing', date: '2026-02-15T08:00:00Z', note: 'Preparing your order' },
        { status: 'shipped', date: '2026-02-18T14:00:00Z', note: 'Shipped via Colissimo Express' },
        { status: 'delivered', date: '2026-02-21T11:30:00Z', note: 'Delivered — signed by M. Client' },
      ],
    },
    {
      id: 'ord-002', orderNumber: 'TS-2026-002134', userId: 'u-001',
      customerEmail: 'test@mail.com', customerFirstName: 'Test', customerLastName: 'Client',
      status: 'shipped', paymentStatus: 'paid', shippingStatus: 'shipped',
      currency: 'EUR', subtotalAmount: 1520, customizationAmount: 56,
      discountAmount: 0, shippingAmount: 0, taxAmount: 315.20, totalAmount: 1891.20,
      customerNote: 'Please wrap separately.',
      orderedAt: '2026-04-10T16:45:00Z', paidAt: '2026-04-10T16:46:00Z',
      shippedAt: '2026-04-14T09:30:00Z', deliveredAt: null,
      shippingAddress: DEMO_ADDRESSES[0], billingAddress: DEMO_ADDRESSES[1],
      items: [
        {
          id: 'oi-002', productName: 'The Bespoke Messenger', productSlug: 'the-bespoke-messenger',
          variantSku: 'TSL-BSP-COG-OS', sizeLabel: 'One Size', color: 'Cognac',
          quantity: 1, unitPrice: 980, customizationPrice: 56, discountAmount: 0,
          taxAmount: 207.20, totalAmount: 1243.20,
          image: p('the-bespoke-messenger')?.images?.[0] || '/assets/custom.jpg',
          customizationSummary: { leather_color: 'Cognac', hardware: 'Antiqued Brass', monogram: 'M.D.' },
        },
        {
          id: 'oi-003', productName: 'The Monogram Clutch', productSlug: 'the-monogram-clutch',
          variantSku: 'TSL-MON-BLK-OS', sizeLabel: 'One Size', color: 'Black',
          quantity: 1, unitPrice: 540, customizationPrice: 0, discountAmount: 0,
          taxAmount: 108, totalAmount: 648,
          image: p('the-monogram-clutch')?.images?.[0] || '/assets/custom.jpg',
        },
      ],
      payment: { provider: 'paypal', status: 'paid', amount: 1891.20, paymentMethod: 'PayPal (Test.d@gmail.com)', paidAt: '2026-04-10T16:46:00Z' },
      shipment: { carrier: 'DHL Express', trackingNumber: 'DHL1234567890', trackingUrl: '#', shippingMethod: 'Express International', status: 'in_transit', shippedAt: '2026-04-14T09:30:00Z', deliveredAt: null },
      statusHistory: [
        { status: 'pending', date: '2026-04-10T16:45:00Z', note: 'Order placed' },
        { status: 'confirmed', date: '2026-04-10T16:46:00Z', note: 'Payment confirmed via PayPal' },
        { status: 'processing', date: '2026-04-11T08:15:00Z', note: 'Custom monogram in progress' },
        { status: 'shipped', date: '2026-04-14T09:30:00Z', note: 'Shipped via DHL Express' },
      ],
    },
    {
      id: 'ord-003', orderNumber: 'TS-2026-002501', userId: 'u-001',
      customerEmail: 'test@mail.com', customerFirstName: 'Test', customerLastName: 'Client',
      status: 'processing', paymentStatus: 'paid', shippingStatus: 'preparing',
      currency: 'EUR', subtotalAmount: 515, customizationAmount: 0,
      discountAmount: 51.50, shippingAmount: 15, taxAmount: 95.70, totalAmount: 574.20,
      orderedAt: '2026-04-25T11:10:00Z', paidAt: '2026-04-25T11:11:00Z',
      shippedAt: null, deliveredAt: null,
      shippingAddress: DEMO_ADDRESSES[2], billingAddress: DEMO_ADDRESSES[1],
      items: [
        {
          id: 'oi-004', productName: 'The Classic Zip Wallet', productSlug: 'the-classic-zip-wallet',
          variantSku: 'TSL-CZW-COG-OS', sizeLabel: 'One Size', color: 'Cognac',
          quantity: 1, unitPrice: 145, customizationPrice: 0, discountAmount: 14.50,
          taxAmount: 26.10, totalAmount: 156.60,
          image: p('the-classic-zip-wallet')?.images?.[0] || '/assets/wallet.png',
        },
        {
          id: 'oi-005', productName: 'The Alpine Gloves', productSlug: 'the-alpine-gloves',
          variantSku: 'TSL-ALP-BLK-M', sizeLabel: 'M', color: 'Black',
          quantity: 1, unitPrice: 195, customizationPrice: 0, discountAmount: 19.50,
          taxAmount: 35.10, totalAmount: 210.60,
          image: p('the-alpine-gloves')?.images?.[0] || '/assets/winter.jpg',
        },
        {
          id: 'oi-006', productName: 'The Riviera Belt', productSlug: 'the-riviera-belt',
          variantSku: 'TSL-RIV-TAN-90', sizeLabel: '90cm', color: 'Tan',
          quantity: 1, unitPrice: 175, customizationPrice: 0, discountAmount: 17.50,
          taxAmount: 34.50, totalAmount: 207,
          image: p('the-riviera-belt')?.images?.[0] || '/assets/summer.jpg',
        },
      ],
      payment: { provider: 'stripe', status: 'paid', amount: 574.20, paymentMethod: 'Mastercard •••• 8888', paidAt: '2026-04-25T11:11:00Z' },
      shipment: null,
      statusHistory: [
        { status: 'pending', date: '2026-04-25T11:10:00Z', note: 'Order placed' },
        { status: 'confirmed', date: '2026-04-25T11:11:00Z', note: 'Payment confirmed via Stripe' },
        { status: 'processing', date: '2026-04-25T14:00:00Z', note: 'Your items are being prepared' },
      ],
    },
    {
      id: 'ord-004', orderNumber: 'TS-2025-000412', userId: 'u-001',
      customerEmail: 'test@mail.com', customerFirstName: 'Test', customerLastName: 'Client',
      status: 'cancelled', paymentStatus: 'refunded', shippingStatus: 'pending',
      currency: 'EUR', subtotalAmount: 620, customizationAmount: 0,
      discountAmount: 0, shippingAmount: 0, taxAmount: 124, totalAmount: 744,
      orderedAt: '2025-12-20T14:30:00Z', paidAt: '2025-12-20T14:31:00Z',
      shippedAt: null, deliveredAt: null,
      shippingAddress: DEMO_ADDRESSES[0], billingAddress: DEMO_ADDRESSES[1],
      items: [{
        id: 'oi-007', productName: 'The Spring Tote', productSlug: 'the-spring-tote',
        variantSku: 'TSL-SPT-IVR-OS', sizeLabel: 'One Size', color: 'Ivory',
        quantity: 1, unitPrice: 620, customizationPrice: 0, discountAmount: 0,
        taxAmount: 124, totalAmount: 744,
        image: p('the-spring-tote')?.images?.[0] || '/assets/spring.jpg',
      }],
      payment: { provider: 'stripe', status: 'refunded', amount: 744, paymentMethod: 'Visa •••• 4242', paidAt: '2025-12-20T14:31:00Z' },
      shipment: null,
      statusHistory: [
        { status: 'pending', date: '2025-12-20T14:30:00Z', note: 'Order placed' },
        { status: 'confirmed', date: '2025-12-20T14:31:00Z', note: 'Payment confirmed' },
        { status: 'cancelled', date: '2025-12-22T09:00:00Z', note: 'Cancelled at customer request — full refund issued' },
      ],
    },
  ];
}

const DEMO_WISHLIST = ['the-shearling-coat', 'the-explorer-backpack', 'the-moto-heritage', 'the-suede-weekender'];

function loadUser() {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
}
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
  const [user, setUser] = useState(loadUser);
  const [addresses, setAddresses] = useState(DEMO_ADDRESSES);
  const [wishlist, setWishlist] = useState(DEMO_WISHLIST);
  const orders = useMemo(() => buildMockOrders(), []);

  const persist = useCallback((u) => {
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
    setUser(u);
  }, []);

  const login = useCallback((email, password) => {
    const db = loadUsersDB();
    const found = db[email.toLowerCase()];
    if (!found) return { ok: false, error: 'No account found with this email.' };
    if (found.password !== password) return { ok: false, error: 'Incorrect password.' };
    const u = { ...found, lastLoginAt: new Date().toISOString() };
    db[email.toLowerCase()] = u;
    saveUsersDB(db);
    const { password: _, ...safe } = u;
    persist(safe);
    return { ok: true };
  }, [persist]);

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
    persist(safe);
    return { ok: true };
  }, [persist]);

  const logout = useCallback(() => { persist(null); navigate('/login'); }, [persist]);

  const updateProfile = useCallback((updates) => {
    const db = loadUsersDB();
    const key = user?.email;
    if (!key || !db[key]) return;
    Object.assign(db[key], updates);
    saveUsersDB(db);
    const { password: _, ...safe } = db[key];
    persist(safe);
  }, [user, persist]);

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
