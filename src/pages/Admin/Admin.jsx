import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { PRODUCTS } from '../Products/Products';
import './Admin.css';

/* ─────────────────────── helpers ─────────────────────── */
const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
};
const fmtCurrency = (n) => `€${Number(n).toFixed(2)}`;
const icon = (name) => <span className="material-symbols-outlined">{name}</span>;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/* ─────────────────────── FAKE DATA ─────────────────────── */

const MOCK_CUSTOMERS = [
  { id: 'u-001', email: 'test@mail.com', firstName: 'Test', lastName: 'Client', role: 'customer', isActive: true, ordersCount: 4, totalSpent: 4484.40, createdAt: '2025-11-15' },
  { id: 'u-002', email: 'marie.dupont@email.fr', firstName: 'Marie', lastName: 'Dupont', role: 'customer', isActive: true, ordersCount: 7, totalSpent: 8250.00, createdAt: '2025-08-22' },
  { id: 'u-003', email: 'jean.martin@email.fr', firstName: 'Jean', lastName: 'Martin', role: 'customer', isActive: true, ordersCount: 2, totalSpent: 1890.00, createdAt: '2026-01-10' },
  { id: 'u-004', email: 'sophie.bernard@email.fr', firstName: 'Sophie', lastName: 'Bernard', role: 'customer', isActive: false, ordersCount: 1, totalSpent: 540.00, createdAt: '2026-03-05' },
  { id: 'u-admin', email: 'admin@tsleather.com', firstName: 'Admin', lastName: 'TS', role: 'admin', isActive: true, ordersCount: 0, totalSpent: 0, createdAt: '2025-01-01' },
];

const p = (slug) => PRODUCTS.find(pr => pr.slug === slug);

const MOCK_ORDERS = [
  {
    id: 'ord-001', orderNumber: 'TS-2026-001847',
    customer: { name: 'Test Client', email: 'test@mail.com' },
    status: 'delivered', paymentStatus: 'paid', shippingStatus: 'delivered',
    items: [
      { name: 'The Aviator Jacket', quantity: 1, unitPrice: 1250, image: p('the-aviator-jacket')?.images?.[0] || '/assets/jacket.jpg' },
    ],
    subtotal: 1250, discount: 187.50, shipping: 0, tax: 212.50, total: 1275,
    orderedAt: '2026-02-14T09:22:00Z', paymentMethod: 'Visa •••• 4242',
    trackingNumber: 'CC123456789FR',
    shippingAddress: '24 Rue du Faubourg Saint-Honoré, 75008 Paris, France',
    billingAddress: '24 Rue du Faubourg Saint-Honoré, 75008 Paris, France',
    statusHistory: [
      { status: 'pending', date: '2026-02-14T09:22:00Z', note: 'Order placed' },
      { status: 'confirmed', date: '2026-02-14T09:23:00Z', note: 'Payment confirmed via Stripe' },
      { status: 'processing', date: '2026-02-15T08:00:00Z', note: 'Preparing your order' },
      { status: 'shipped', date: '2026-02-18T14:00:00Z', note: 'Shipped via Colissimo Express' },
      { status: 'delivered', date: '2026-02-21T11:30:00Z', note: 'Delivered — signed by M. Client' },
    ],
    adminNote: '',
  },
  {
    id: 'ord-002', orderNumber: 'TS-2026-002134',
    customer: { name: 'Test Client', email: 'test@mail.com' },
    status: 'shipped', paymentStatus: 'paid', shippingStatus: 'shipped',
    items: [
      { name: 'The Bespoke Messenger', quantity: 1, unitPrice: 980, image: p('the-bespoke-messenger')?.images?.[0] || '/assets/custom.jpg' },
      { name: 'The Monogram Clutch', quantity: 1, unitPrice: 540, image: p('the-monogram-clutch')?.images?.[0] || '/assets/custom.jpg' },
    ],
    subtotal: 1520, discount: 0, shipping: 0, tax: 315.20, total: 1891.20,
    orderedAt: '2026-04-10T16:45:00Z', paymentMethod: 'PayPal',
    trackingNumber: 'DHL1234567890',
    shippingAddress: '24 Rue du Faubourg Saint-Honoré, 75008 Paris, France',
    billingAddress: '24 Rue du Faubourg Saint-Honoré, 75008 Paris, France',
    statusHistory: [
      { status: 'pending', date: '2026-04-10T16:45:00Z', note: 'Order placed' },
      { status: 'confirmed', date: '2026-04-10T16:46:00Z', note: 'Payment confirmed via PayPal' },
      { status: 'processing', date: '2026-04-11T08:15:00Z', note: 'Custom monogram in progress' },
      { status: 'shipped', date: '2026-04-14T09:30:00Z', note: 'Shipped via DHL Express' },
    ],
    adminNote: 'Customer requested separate wrapping.',
  },
  {
    id: 'ord-003', orderNumber: 'TS-2026-002501',
    customer: { name: 'Test Client', email: 'test@mail.com' },
    status: 'processing', paymentStatus: 'paid', shippingStatus: 'preparing',
    items: [
      { name: 'The Classic Zip Wallet', quantity: 1, unitPrice: 145, image: p('the-classic-zip-wallet')?.images?.[0] || '/assets/wallet.png' },
      { name: 'The Alpine Gloves', quantity: 1, unitPrice: 195, image: p('the-alpine-gloves')?.images?.[0] || '/assets/winter.jpg' },
      { name: 'The Riviera Belt', quantity: 1, unitPrice: 175, image: p('the-riviera-belt')?.images?.[0] || '/assets/summer.jpg' },
    ],
    subtotal: 515, discount: 51.50, shipping: 15, tax: 95.70, total: 574.20,
    orderedAt: '2026-04-25T11:10:00Z', paymentMethod: 'Mastercard •••• 8888',
    trackingNumber: null,
    shippingAddress: '15 Avenue des Champs-Élysées, 75001 Paris, France',
    billingAddress: '24 Rue du Faubourg Saint-Honoré, 75008 Paris, France',
    statusHistory: [
      { status: 'pending', date: '2026-04-25T11:10:00Z', note: 'Order placed' },
      { status: 'confirmed', date: '2026-04-25T11:11:00Z', note: 'Payment confirmed via Stripe' },
      { status: 'processing', date: '2026-04-25T14:00:00Z', note: 'Your items are being prepared' },
    ],
    adminNote: '',
  },
  {
    id: 'ord-004', orderNumber: 'TS-2025-000412',
    customer: { name: 'Test Client', email: 'test@mail.com' },
    status: 'cancelled', paymentStatus: 'refunded', shippingStatus: 'pending',
    items: [
      { name: 'The Spring Tote', quantity: 1, unitPrice: 620, image: p('the-spring-tote')?.images?.[0] || '/assets/spring.jpg' },
    ],
    subtotal: 620, discount: 0, shipping: 0, tax: 124, total: 744,
    orderedAt: '2025-12-20T14:30:00Z', paymentMethod: 'Visa •••• 4242',
    trackingNumber: null,
    shippingAddress: '24 Rue du Faubourg Saint-Honoré, 75008 Paris, France',
    billingAddress: '24 Rue du Faubourg Saint-Honoré, 75008 Paris, France',
    statusHistory: [
      { status: 'pending', date: '2025-12-20T14:30:00Z', note: 'Order placed' },
      { status: 'confirmed', date: '2025-12-20T14:31:00Z', note: 'Payment confirmed' },
      { status: 'cancelled', date: '2025-12-22T09:00:00Z', note: 'Cancelled at customer request — full refund issued' },
    ],
    adminNote: 'Customer changed mind, full refund processed.',
  },
  {
    id: 'ord-005', orderNumber: 'TS-2026-002600',
    customer: { name: 'Marie Dupont', email: 'marie.dupont@email.fr' },
    status: 'pending', paymentStatus: 'pending', shippingStatus: 'pending',
    items: [
      { name: 'The Shearling Coat', quantity: 1, unitPrice: 1890, image: p('the-shearling-coat')?.images?.[0] || '/assets/winter.jpg' },
    ],
    subtotal: 1890, discount: 0, shipping: 0, tax: 378, total: 2268,
    orderedAt: '2026-04-27T08:15:00Z', paymentMethod: 'Pending',
    trackingNumber: null,
    shippingAddress: '8 Rue de Rivoli, 75004 Paris, France',
    billingAddress: '8 Rue de Rivoli, 75004 Paris, France',
    statusHistory: [
      { status: 'pending', date: '2026-04-27T08:15:00Z', note: 'Awaiting payment confirmation' },
    ],
    adminNote: '',
  },
  {
    id: 'ord-006', orderNumber: 'TS-2026-002610',
    customer: { name: 'Marie Dupont', email: 'marie.dupont@email.fr' },
    status: 'confirmed', paymentStatus: 'paid', shippingStatus: 'pending',
    items: [
      { name: 'The Explorer Backpack', quantity: 1, unitPrice: 890, image: p('the-explorer-backpack')?.images?.[0] || '/assets/fall.jpg' },
      { name: 'The Cognac Belt', quantity: 1, unitPrice: 165, image: p('the-cognac-belt')?.images?.[0] || '/assets/fall.jpg' },
    ],
    subtotal: 1055, discount: 158.25, shipping: 0, tax: 179.35, total: 1076.10,
    orderedAt: '2026-04-26T19:00:00Z', paymentMethod: 'Visa •••• 1234',
    trackingNumber: null,
    shippingAddress: '8 Rue de Rivoli, 75004 Paris, France',
    billingAddress: '8 Rue de Rivoli, 75004 Paris, France',
    statusHistory: [
      { status: 'pending', date: '2026-04-26T19:00:00Z', note: 'Order placed' },
      { status: 'confirmed', date: '2026-04-26T19:01:00Z', note: 'Payment confirmed via Stripe' },
    ],
    adminNote: '',
  },
  {
    id: 'ord-007', orderNumber: 'TS-2026-002450',
    customer: { name: 'Jean Martin', email: 'jean.martin@email.fr' },
    status: 'delivered', paymentStatus: 'paid', shippingStatus: 'delivered',
    items: [
      { name: 'The Moto Heritage', quantity: 1, unitPrice: 950, image: p('the-moto-heritage')?.images?.[0] || '/assets/jacket.jpg' },
    ],
    subtotal: 950, discount: 0, shipping: 0, tax: 190, total: 1140,
    orderedAt: '2026-03-05T10:30:00Z', paymentMethod: 'Mastercard •••• 5678',
    trackingNumber: 'LP987654321FR',
    shippingAddress: '22 Boulevard Haussmann, 75009 Paris, France',
    billingAddress: '22 Boulevard Haussmann, 75009 Paris, France',
    statusHistory: [
      { status: 'pending', date: '2026-03-05T10:30:00Z', note: 'Order placed' },
      { status: 'confirmed', date: '2026-03-05T10:31:00Z', note: 'Payment confirmed' },
      { status: 'processing', date: '2026-03-06T09:00:00Z', note: 'Preparing order' },
      { status: 'shipped', date: '2026-03-08T14:00:00Z', note: 'Shipped via La Poste' },
      { status: 'delivered', date: '2026-03-11T16:20:00Z', note: 'Delivered' },
    ],
    adminNote: '',
  },
  {
    id: 'ord-008', orderNumber: 'TS-2026-002620',
    customer: { name: 'Sophie Bernard', email: 'sophie.bernard@email.fr' },
    status: 'processing', paymentStatus: 'paid', shippingStatus: 'preparing',
    items: [
      { name: 'The Pastel Satchel', quantity: 1, unitPrice: 540, image: p('the-pastel-satchel')?.images?.[0] || '/assets/spring.jpg' },
    ],
    subtotal: 540, discount: 54, shipping: 15, tax: 100.20, total: 601.20,
    orderedAt: '2026-04-27T11:00:00Z', paymentMethod: 'Apple Pay',
    trackingNumber: null,
    shippingAddress: '5 Place Bellecour, 69002 Lyon, France',
    billingAddress: '5 Place Bellecour, 69002 Lyon, France',
    statusHistory: [
      { status: 'pending', date: '2026-04-27T11:00:00Z', note: 'Order placed' },
      { status: 'confirmed', date: '2026-04-27T11:01:00Z', note: 'Payment confirmed via Apple Pay' },
      { status: 'processing', date: '2026-04-27T14:00:00Z', note: 'Preparing order' },
    ],
    adminNote: '',
  },
];

const MOCK_REVIEWS = [
  { id: 'rev-001', userId: 'u-001', userName: 'Test Client', productId: 1, productName: 'The Aviator Jacket', rating: 5, title: 'Exceptional quality', comment: 'Stunning jacket, the calfskin is incredibly supple. Worth every euro.', status: 'approved', isVerifiedPurchase: true, createdAt: '2026-03-01T10:00:00Z' },
  { id: 'rev-002', userId: 'u-002', userName: 'Marie Dupont', productId: 7, productName: 'The Explorer Backpack', rating: 5, title: 'My daily companion', comment: 'Best backpack I have ever owned. The steerhide gets better with age.', status: 'approved', isVerifiedPurchase: true, createdAt: '2026-03-15T14:30:00Z' },
  { id: 'rev-003', userId: 'u-003', userName: 'Jean Martin', productId: 3, productName: 'The Moto Heritage', rating: 4, title: 'Great jacket, tight fit', comment: 'Amazing quality but runs a bit small. Consider sizing up.', status: 'approved', isVerifiedPurchase: true, createdAt: '2026-03-20T09:15:00Z' },
  { id: 'rev-004', userId: 'u-002', userName: 'Marie Dupont', productId: 19, productName: 'The Shearling Coat', rating: 5, title: 'Pure luxury', comment: 'The most beautiful coat I have ever seen. Absolutely worth the investment.', status: 'pending', isVerifiedPurchase: true, createdAt: '2026-04-20T16:00:00Z' },
  { id: 'rev-005', userId: 'u-004', userName: 'Sophie Bernard', productId: 22, productName: 'The Pastel Satchel', rating: 3, title: 'Nice but fragile', comment: 'The colour is lovely but the leather scratches very easily. Expected more for the price.', status: 'pending', isVerifiedPurchase: true, createdAt: '2026-04-22T11:45:00Z' },
  { id: 'rev-006', userId: 'u-001', userName: 'Test Client', productId: 13, productName: 'The Bespoke Messenger', rating: 5, title: 'Custom perfection', comment: 'The monogram turned out beautifully. Incredible craftsmanship throughout.', status: 'approved', isVerifiedPurchase: true, createdAt: '2026-04-25T08:30:00Z' },
  { id: 'rev-007', userId: 'u-003', userName: 'Jean Martin', productId: 5, productName: 'The Classic Zip Wallet', rating: 4, title: 'Solid everyday wallet', comment: 'Good quality calfskin, holds all my cards. The zip is smooth.', status: 'pending', isVerifiedPurchase: false, createdAt: '2026-04-26T13:00:00Z' },
  { id: 'rev-008', userId: 'u-002', userName: 'Marie Dupont', productId: 8, productName: 'The Cognac Belt', rating: 2, title: 'Buckle tarnished quickly', comment: 'The leather is fine but the brass buckle started tarnishing after two weeks.', status: 'pending', isVerifiedPurchase: true, createdAt: '2026-04-26T17:30:00Z' },
  { id: 'rev-009', userId: 'u-004', userName: 'Sophie Bernard', productId: 2, productName: 'The Minimalist Bifold', rating: 1, title: 'Stitching came undone', comment: 'Terrible quality. The stitching fell apart within the first month.', status: 'rejected', isVerifiedPurchase: false, createdAt: '2026-04-10T10:00:00Z' },
  { id: 'rev-010', userId: 'u-001', userName: 'Test Client', productId: 15, productName: 'The Monogram Clutch', rating: 4, title: 'Elegant evening piece', comment: 'Beautiful clutch, the monogram was a nice personal touch. Slightly smaller than expected.', status: 'approved', isVerifiedPurchase: true, createdAt: '2026-04-27T09:00:00Z' },
];

const MOCK_DISCOUNTS = [
  { id: 'd-001', code: 'WELCOME15', name: 'Welcome Discount', type: 'percentage', value: 15, minOrder: 100, maxDiscount: 200, usageLimit: 500, usedCount: 234, startsAt: '2026-01-01', endsAt: '2026-12-31', isActive: true },
  { id: 'd-002', code: 'LEATHER50', name: 'Leather Month', type: 'fixed_amount', value: 50, minOrder: 300, maxDiscount: null, usageLimit: 100, usedCount: 67, startsAt: '2026-04-01', endsAt: '2026-04-30', isActive: true },
  { id: 'd-003', code: 'VIP25', name: 'VIP Exclusive', type: 'percentage', value: 25, minOrder: 500, maxDiscount: 400, usageLimit: 50, usedCount: 12, startsAt: '2026-01-01', endsAt: null, isActive: true },
  { id: 'd-004', code: 'SUMMER10', name: 'Summer Sale', type: 'percentage', value: 10, minOrder: null, maxDiscount: 100, usageLimit: 1000, usedCount: 845, startsAt: '2025-06-01', endsAt: '2025-09-30', isActive: false },
];

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

/* ─────────────────────── STATUS BADGE ─────────────────────── */
function StatusBadge({ status }) {
  return <span className={`adm__badge adm__badge--${status}`}>{status}</span>;
}

/* ─────────────────────── STAR DISPLAY ─────────────────────── */
function Stars({ rating }) {
  return (
    <span className="adm__review-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className="material-symbols-outlined" style={{ color: i <= rating ? '#f59e0b' : '#d1d5db', fontSize: 18 }}>star</span>
      ))}
    </span>
  );
}

/* ─────────────────────── TOAST ─────────────────────── */
function Toast({ toasts, removeToast }) {
  return (
    <div className="adm__toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`adm__toast adm__toast--${t.type}`}>
          {icon(t.type === 'success' ? 'check_circle' : t.type === 'error' ? 'error' : 'info')}
          <span>{t.message}</span>
          <button className="adm__icon-btn" onClick={() => removeToast(t.id)}>{icon('close')}</button>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════ DASHBOARD ═══════════════════════ */
function DashboardTab({ orders, products, setActiveTab, setOrderFilter }) {
  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0);
  const ordersToday = orders.filter(o => new Date(o.orderedAt).toDateString() === new Date('2026-04-27').toDateString()).length;
  const pendingReviews = MOCK_REVIEWS.filter(r => r.status === 'pending').length;
  const activeDiscounts = MOCK_DISCOUNTS.filter(d => d.isActive).length;
  const lowStockProducts = products.filter(pr => pr.stock <= 5);

  const stats = [
    { label: 'Total Revenue', value: fmtCurrency(totalRevenue), icon: 'trending_up', color: '#10b981' },
    { label: 'Orders Today', value: ordersToday, icon: 'orders', color: '#3b82f6' },
    { label: 'Total Customers', value: MOCK_CUSTOMERS.filter(c => c.role === 'customer').length, icon: 'people', color: '#8b5cf6' },
    { label: 'Total Products', value: products.length, icon: 'inventory_2', color: '#f59e0b' },
    { label: 'Pending Reviews', value: pendingReviews, icon: 'reviews', color: '#ef4444' },
    { label: 'Active Discounts', value: activeDiscounts, icon: 'local_offer', color: '#06b6d4' },
  ];

  const recentOrders = [...orders].sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt)).slice(0, 5);

  return (
    <div className="adm__dashboard">
      <h2 className="adm__section-title">Dashboard Overview</h2>

      <div className="adm__stats">
        {stats.map(s => (
          <div key={s.label} className="adm__stat-card">
            <div className="adm__stat-icon" style={{ backgroundColor: s.color + '1a', color: s.color }}>
              {icon(s.icon)}
            </div>
            <div>
              <span className="adm__stat-value">{s.value}</span>
              <span className="adm__stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="adm__quick-actions">
        <button className="adm__quick-action" onClick={() => { setOrderFilter('processing'); setActiveTab('orders'); }}>
          {icon('local_shipping')} Process Pending Orders
        </button>
        <button className="adm__quick-action" onClick={() => setActiveTab('reviews')}>
          {icon('reviews')} Review Pending Reviews
        </button>
        <button className="adm__quick-action" onClick={() => setActiveTab('products')}>
          {icon('inventory_2')} View All Products
        </button>
      </div>

      <div className="adm__dashboard-grid">
        <div className="adm__card">
          <h3 className="adm__card-title">Recent Orders</h3>
          <div className="adm__table-wrap">
            <table className="adm__table">
              <thead>
                <tr><th>Order #</th><th>Customer</th><th>Status</th><th>Total</th><th>Date</th></tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id}>
                    <td><strong>{o.orderNumber}</strong></td>
                    <td>{o.customer.name}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td>{fmtCurrency(o.total)}</td>
                    <td>{fmtDate(o.orderedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="adm__card">
          <h3 className="adm__card-title">{icon('warning')} Low Stock Alerts</h3>
          <div>
            {lowStockProducts.map(pr => (
              <div key={pr.id} className="adm__alert adm__alert--warning">
                <div className="adm__low-stock-item">
                  <img src={pr.images?.[0] || pr.img} alt={pr.name} className="adm__low-stock-img" />
                  <div className="adm__low-stock-info">
                    <strong>{pr.name}</strong>
                    <span className={`adm__stock-level adm__stock-level--${pr.stock === 0 ? 'out' : 'low'}`}>
                      {pr.stock === 0 ? 'Out of Stock' : `${pr.stock} left`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════ ORDERS ═══════════════════════ */
function OrdersTab({ orders, setOrders, addToast, initialFilter }) {
  const [statusFilter, setStatusFilter] = useState(initialFilter || 'all');
  const [detailOrder, setDetailOrder] = useState(null);
  const [noteInputs, setNoteInputs] = useState({});
  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    if (initialFilter) setStatusFilter(initialFilter);
  }, [initialFilter]);

  const filtered = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const entry = { status: newStatus, date: new Date().toISOString(), note: `Status updated to ${newStatus}` };
      return { ...o, status: newStatus, statusHistory: [...o.statusHistory, entry] };
    }));
    setStatusUpdates(prev => ({ ...prev, [orderId]: undefined }));
    if (detailOrder?.id === orderId) {
      setDetailOrder(prev => {
        const entry = { status: newStatus, date: new Date().toISOString(), note: `Status updated to ${newStatus}` };
        return { ...prev, status: newStatus, statusHistory: [...prev.statusHistory, entry] };
      });
    }
    addToast(`Order status updated to ${newStatus}`, 'success');
  };

  const handleAddNote = (orderId) => {
    const note = noteInputs[orderId];
    if (!note?.trim()) return;
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, adminNote: note.trim() } : o));
    setNoteInputs(prev => ({ ...prev, [orderId]: '' }));
  };

  const markAs = (orderId, status) => {
    handleStatusChange(orderId, status);
  };

  return (
    <div className="adm__orders">
      <h2 className="adm__section-title">Orders Management</h2>
      <div className="adm__toolbar">
        <div className="adm__filter-group">
          {['all', ...ORDER_STATUSES].map(s => (
            <button key={s} className={`adm__pill ${statusFilter === s ? 'adm__pill--active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="adm__order-cards">
        {filtered.map(o => (
          <div key={o.id} className="adm__order-card">
            <div className="adm__order-card__header">
              <strong>{o.orderNumber}</strong>
              <span>{fmtDate(o.orderedAt)}</span>
              <StatusBadge status={o.status} />
              <strong>{fmtCurrency(o.total)}</strong>
            </div>
            <div className="adm__order-card__body">
              <div>
                <span>{o.customer.name}</span>
                <small>{o.customer.email}</small>
              </div>
              <StatusBadge status={o.paymentStatus} />
            </div>
            <div className="adm__order-card__items">
              {o.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img src={item.image} alt={item.name} style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4 }} />
                  <small>{item.name}</small>
                </div>
              ))}
            </div>
            <div className="adm__order-card__actions">
              <button className="adm__btn adm__btn--ghost adm__btn--sm" onClick={() => setDetailOrder(o)}>
                {icon('visibility')} View Details
              </button>
              <button className="adm__btn adm__btn--success adm__btn--sm" onClick={() => markAs(o.id, 'shipped')} disabled={o.status === 'shipped' || o.status === 'delivered' || o.status === 'cancelled'}>
                {icon('local_shipping')} Mark Shipped
              </button>
              <button className="adm__btn adm__btn--success adm__btn--sm" onClick={() => markAs(o.id, 'delivered')} disabled={o.status === 'delivered' || o.status === 'cancelled'}>
                {icon('check_circle')} Mark Delivered
              </button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="adm__empty">No orders match this filter.</p>}

      {detailOrder && (
        <div className="adm__modal-backdrop" onClick={() => setDetailOrder(null)}>
          <div className="adm__modal-content" onClick={e => e.stopPropagation()}>
            <div className="adm__modal-header">
              <h3>Order {detailOrder.orderNumber}</h3>
              <button className="adm__icon-btn" onClick={() => setDetailOrder(null)}>{icon('close')}</button>
            </div>
            <div className="adm__modal-body">
              <div className="adm__detail-grid">
                <div className="adm__detail-section">
                  <h4>Items</h4>
                  {detailOrder.items.map((item, idx) => (
                    <div key={idx} className="adm__detail" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                      <div>
                        <strong>{item.name}</strong>
                        <div>Qty: {item.quantity} × {fmtCurrency(item.unitPrice)}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--bg-elevated)', paddingTop: '0.75rem' }}>
                    <div className="adm__detail"><span className="adm__detail-label">Subtotal</span> <span className="adm__detail-value">{fmtCurrency(detailOrder.subtotal)}</span></div>
                    {detailOrder.discount > 0 && <div className="adm__detail"><span className="adm__detail-label">Discount</span> <span className="adm__detail-value">−{fmtCurrency(detailOrder.discount)}</span></div>}
                    {detailOrder.shipping > 0 && <div className="adm__detail"><span className="adm__detail-label">Shipping</span> <span className="adm__detail-value">{fmtCurrency(detailOrder.shipping)}</span></div>}
                    <div className="adm__detail"><span className="adm__detail-label">Tax</span> <span className="adm__detail-value">{fmtCurrency(detailOrder.tax)}</span></div>
                    <div className="adm__detail"><strong className="adm__detail-label">Total</strong> <strong className="adm__detail-value">{fmtCurrency(detailOrder.total)}</strong></div>
                  </div>
                </div>

                <div className="adm__detail-section">
                  <h4>Addresses</h4>
                  <p><span className="adm__detail-label">Shipping:</span> {detailOrder.shippingAddress}</p>
                  <p><span className="adm__detail-label">Billing:</span> {detailOrder.billingAddress}</p>
                  {detailOrder.trackingNumber && <p><span className="adm__detail-label">Tracking:</span> {detailOrder.trackingNumber}</p>}
                  <p><span className="adm__detail-label">Payment:</span> {detailOrder.paymentMethod}</p>
                </div>

                <div className="adm__detail-section">
                  <h4>Timeline</h4>
                  <div className="adm__timeline">
                    {detailOrder.statusHistory.map((h, idx) => (
                      <div key={idx} className="adm__timeline-entry">
                        <StatusBadge status={h.status} />
                        <span>{fmtDate(h.date)}</span>
                        <span>{h.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="adm__form-group" style={{ marginTop: '1rem' }}>
                <label className="adm__form-label">Admin Note</label>
                <textarea className="adm__form-textarea" value={noteInputs[detailOrder.id] ?? detailOrder.adminNote} onChange={e => setNoteInputs(prev => ({ ...prev, [detailOrder.id]: e.target.value }))} placeholder="Add an internal note…" rows={2} />
                <button className="adm__btn adm__btn--ghost adm__btn--sm" style={{ marginTop: '0.5rem' }} onClick={() => handleAddNote(detailOrder.id)}>
                  {icon('save')} Save Note
                </button>
              </div>
            </div>
            <div className="adm__modal-footer">
              <select className="adm__form-select" value={statusUpdates[detailOrder.id] || detailOrder.status} onChange={e => setStatusUpdates(prev => ({ ...prev, [detailOrder.id]: e.target.value }))}>
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
              <button className="adm__btn adm__btn--primary" onClick={() => handleStatusChange(detailOrder.id, statusUpdates[detailOrder.id] || detailOrder.status)} disabled={!statusUpdates[detailOrder.id] || statusUpdates[detailOrder.id] === detailOrder.status}>
                {icon('save')} Apply
              </button>
              <button className="adm__btn adm__btn--ghost" onClick={() => setDetailOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════ PRODUCTS ═══════════════════════ */
function ProductsTab({ addToast }) {
  const [products, setProducts] = useState(() => PRODUCTS.map(pr => ({ ...pr, isActive: true })));
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const categories = useMemo(() => ['all', ...new Set(PRODUCTS.map(pr => pr.cat))], []);

  const filtered = products.filter(pr => {
    if (catFilter !== 'all' && pr.cat !== catFilter) return false;
    if (search && !pr.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openAdd = () => {
    setEditingId(null);
    setEditForm({ name: '', price: 0, description: '', stock: 0, cat: 'men', material: '' });
    setShowModal(true);
  };

  const openEdit = (pr) => {
    setEditingId(pr.id);
    setEditForm({ name: pr.name, price: pr.price, description: pr.description || '', stock: pr.stock, cat: pr.cat || 'men', material: pr.material || '' });
    setShowModal(true);
  };

  const saveProduct = () => {
    if (editingId) {
      setProducts(prev => prev.map(pr => pr.id === editingId ? { ...pr, ...editForm, price: Number(editForm.price), stock: Number(editForm.stock) } : pr));
      addToast('Product updated successfully', 'success');
    } else {
      const newProd = {
        id: Date.now(), name: editForm.name, slug: editForm.name.toLowerCase().replace(/\s+/g, '-'),
        price: Number(editForm.price), description: editForm.description, stock: Number(editForm.stock),
        cat: editForm.cat || 'men', material: editForm.material || 'Leather', images: ['/assets/leather.jpg'],
        rating: 0, reviewCount: 0, soldCount: 0, isFeatured: false, isCustomizable: false, isActive: true,
        colors: ['Black'], sizes: ['One Size'], discount: 0, season: 'spring',
        shortDesc: editForm.description?.slice(0, 80) || '',
      };
      setProducts(prev => [...prev, newProd]);
      addToast('Product created successfully', 'success');
    }
    setShowModal(false);
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(pr => pr.id !== id));
    setDeleteConfirm(null);
    addToast('Product deleted', 'info');
  };

  const toggleField = (id, field) => {
    setProducts(prev => prev.map(pr => pr.id === id ? { ...pr, [field]: !pr[field] } : pr));
  };

  const stockColor = (stock) => {
    if (stock === 0) return 'adm__stock-level--out';
    if (stock <= 5) return 'adm__stock-level--low';
    if (stock <= 15) return 'adm__stock-level--medium';
    return 'adm__stock-level--good';
  };

  return (
    <div className="adm__products">
      <div className="adm__section-header">
        <h2 className="adm__section-title">Products Management</h2>
        <button className="adm__btn adm__btn--primary" onClick={openAdd}>{icon('add')} Add Product</button>
      </div>

      <div className="adm__toolbar">
        <div className="adm__search-bar">
          {icon('search')}
          <input type="text" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="adm__filter-group">
          {categories.map(c => (
            <button key={c} className={`adm__pill ${catFilter === c ? 'adm__pill--active' : ''}`} onClick={() => setCatFilter(c)}>
              {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="adm__table-wrap">
      <table className="adm__table">
        <thead>
          <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Active</th><th>Featured</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {filtered.map(pr => (
            <tr key={pr.id}>
              <td><img src={pr.images?.[0] || pr.img} alt={pr.name} className="adm__product-thumb" /></td>
              <td><strong>{pr.name}</strong></td>
              <td>{pr.cat}</td>
              <td>{fmtCurrency(pr.price)}</td>
              <td><span className={`adm__stock-level ${stockColor(pr.stock)}`}>{pr.stock}</span></td>
              <td>
                <label className="adm__switch">
                  <input type="checkbox" checked={pr.isActive} onChange={() => toggleField(pr.id, 'isActive')} />
                  <span className="adm__switch-slider" />
                </label>
              </td>
              <td>
                <label className="adm__switch">
                  <input type="checkbox" checked={pr.isFeatured} onChange={() => toggleField(pr.id, 'isFeatured')} />
                  <span className="adm__switch-slider" />
                </label>
              </td>
              <td className="adm__actions-cell">
                <button className="adm__icon-btn" onClick={() => openEdit(pr)} title="Edit">{icon('edit')}</button>
                {deleteConfirm === pr.id ? (
                  <span className="adm__delete-confirm">
                    Sure? <button className="adm__icon-btn adm__icon-btn--danger" onClick={() => handleDelete(pr.id)}>✓</button>
                    <button className="adm__icon-btn" onClick={() => setDeleteConfirm(null)}>✗</button>
                  </span>
                ) : (
                  <button className="adm__icon-btn adm__icon-btn--danger" onClick={() => setDeleteConfirm(pr.id)} title="Delete">{icon('delete')}</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {filtered.length === 0 && <p className="adm__empty">No products found.</p>}

      {showModal && (
        <div className="adm__modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="adm__modal-content" onClick={e => e.stopPropagation()}>
            <div className="adm__modal-header">
              <h3>{editingId ? 'Edit Product' : 'New Product'}</h3>
              <button className="adm__icon-btn" onClick={() => setShowModal(false)}>{icon('close')}</button>
            </div>
            <div className="adm__modal-body">
              <div className="adm__form">
                <div className="adm__form-grid">
                  <div className="adm__form-group">
                    <label className="adm__form-label">Name</label>
                    <input className="adm__form-input" type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="adm__form-group">
                    <label className="adm__form-label">Price (€)</label>
                    <input className="adm__form-input" type="number" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} />
                  </div>
                  <div className="adm__form-group">
                    <label className="adm__form-label">Stock</label>
                    <input className="adm__form-input" type="number" value={editForm.stock} onChange={e => setEditForm(f => ({ ...f, stock: e.target.value }))} />
                  </div>
                  <div className="adm__form-group">
                    <label className="adm__form-label">Category</label>
                    <select className="adm__form-select" value={editForm.cat} onChange={e => setEditForm(f => ({ ...f, cat: e.target.value }))}>
                      {categories.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="adm__form-group">
                    <label className="adm__form-label">Material</label>
                    <input className="adm__form-input" type="text" value={editForm.material} onChange={e => setEditForm(f => ({ ...f, material: e.target.value }))} />
                  </div>
                  <div className="adm__form-group adm__form-full">
                    <label className="adm__form-label">Description</label>
                    <textarea className="adm__form-textarea" value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={3} />
                  </div>
                </div>
              </div>
            </div>
            <div className="adm__modal-footer">
              <button className="adm__btn adm__btn--primary" onClick={saveProduct}>{icon('save')} {editingId ? 'Update' : 'Create'}</button>
              <button className="adm__btn adm__btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════ CUSTOMERS ═══════════════════════ */
function CustomersTab({ orders, addToast }) {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [viewingId, setViewingId] = useState(null);

  const filtered = customers.filter(c => {
    if (c.role === 'admin') return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return c.firstName.toLowerCase().includes(q) || c.lastName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const toggleActive = (id) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    const cust = customers.find(c => c.id === id);
    addToast(`${cust?.firstName} ${cust?.isActive ? 'deactivated' : 'activated'}`, 'info');
  };

  const customerOrders = viewingId ? orders.filter(o => {
    const cust = customers.find(c => c.id === viewingId);
    return cust && o.customer.email === cust.email;
  }) : [];

  return (
    <div className="adm__customers">
      <h2 className="adm__section-title">Customers</h2>
      <div className="adm__toolbar">
        <div className="adm__search-bar">
          {icon('search')}
          <input type="text" placeholder="Search customers…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="adm__table-wrap">
      <table className="adm__table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Orders</th><th>Total Spent</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {filtered.map(c => (
            <tr key={c.id}>
              <td><strong>{c.firstName} {c.lastName}</strong></td>
              <td>{c.email}</td>
              <td>{c.ordersCount}</td>
              <td>{fmtCurrency(c.totalSpent)}</td>
              <td><StatusBadge status={c.isActive ? 'active' : 'inactive'} /></td>
              <td>{fmtDate(c.createdAt)}</td>
              <td className="adm__actions-cell">
                <button className="adm__icon-btn" onClick={() => setViewingId(viewingId === c.id ? null : c.id)} title="View orders">{icon('visibility')}</button>
                <button className="adm__icon-btn" onClick={() => toggleActive(c.id)} title={c.isActive ? 'Deactivate' : 'Activate'}>
                  {icon(c.isActive ? 'cancel' : 'check_circle')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {viewingId && (
        <div className="adm__card" style={{ marginTop: '1.5rem' }}>
          <div className="adm__section-header">
            <h3>Orders for {customers.find(c => c.id === viewingId)?.firstName} {customers.find(c => c.id === viewingId)?.lastName}</h3>
            <button className="adm__icon-btn" onClick={() => setViewingId(null)}>{icon('close')}</button>
          </div>
          {customerOrders.length === 0 ? (
            <p className="adm__empty">No orders found for this customer.</p>
          ) : (
            <div className="adm__table-wrap">
            <table className="adm__table">
              <thead><tr><th>Order #</th><th>Date</th><th>Status</th><th>Total</th></tr></thead>
              <tbody>
                {customerOrders.map(o => (
                  <tr key={o.id}>
                    <td>{o.orderNumber}</td>
                    <td>{fmtDate(o.orderedAt)}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td>{fmtCurrency(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════ REVIEWS ═══════════════════════ */
function ReviewsTab({ addToast }) {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState([]);

  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.status === filter);

  const updateStatus = (id, status) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    setSelected(prev => prev.filter(s => s !== id));
    addToast(`Review ${status}`, status === 'approved' ? 'success' : 'info');
  };

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map(r => r.id));
  };

  const bulkAction = (status) => {
    setReviews(prev => prev.map(r => selected.includes(r.id) ? { ...r, status } : r));
    addToast(`${selected.length} reviews ${status}`, status === 'approved' ? 'success' : 'info');
    setSelected([]);
  };

  return (
    <div className="adm__reviews">
      <h2 className="adm__section-title">Reviews Moderation</h2>
      <div className="adm__toolbar">
        <div className="adm__filter-group">
          {['all', 'pending', 'approved', 'rejected'].map(s => (
            <button key={s} className={`adm__pill ${filter === s ? 'adm__pill--active' : ''}`} onClick={() => setFilter(s)}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} ({s === 'all' ? reviews.length : reviews.filter(r => r.status === s).length})
            </button>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="adm__bulk-actions">
            <span>{selected.length} selected</span>
            <button className="adm__btn adm__btn--success adm__btn--sm" onClick={() => bulkAction('approved')}>{icon('check_circle')} Approve</button>
            <button className="adm__btn adm__btn--danger adm__btn--sm" onClick={() => bulkAction('rejected')}>{icon('cancel')} Reject</button>
          </div>
        )}
      </div>

      <div className="adm__review-list">
        <div style={{ padding: '0.75rem 1rem' }}>
          <label className="adm__checkbox-label">
            <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} />
            Select All
          </label>
        </div>
        {filtered.map(r => (
          <div key={r.id} className={`adm__review-card ${selected.includes(r.id) ? 'adm__review-card--selected' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
              <label className="adm__checkbox-label">
                <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)} />
              </label>
              <div style={{ flex: 1, minWidth: 200 }}>
                <strong>{r.productName}</strong>
                <div>by {r.userName}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Stars rating={r.rating} />
                <StatusBadge status={r.status} />
                {r.isVerifiedPurchase && <span className="adm__badge adm__badge--verified">{icon('check_circle')} Verified</span>}
              </div>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <h4 style={{ margin: '0 0 0.25rem' }}>{r.title}</h4>
              <p style={{ margin: '0 0 0.25rem' }}>{r.comment}</p>
              <small>{fmtDate(r.createdAt)}</small>
            </div>
            <div className="adm__review-actions">
              {r.status !== 'approved' && (
                <button className="adm__btn adm__btn--success adm__btn--sm" onClick={() => updateStatus(r.id, 'approved')}>{icon('check_circle')} Approve</button>
              )}
              {r.status !== 'rejected' && (
                <button className="adm__btn adm__btn--danger adm__btn--sm" onClick={() => updateStatus(r.id, 'rejected')}>{icon('cancel')} Reject</button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="adm__empty">No reviews match this filter.</p>}
      </div>
    </div>
  );
}

/* ═══════════════════════ DISCOUNTS ═══════════════════════ */
function DiscountsTab({ addToast }) {
  const [discounts, setDiscounts] = useState(MOCK_DISCOUNTS);
  const [showModal, setShowModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const emptyForm = { code: '', name: '', type: 'percentage', value: 0, minOrder: '', maxDiscount: '', usageLimit: '', startsAt: '', endsAt: '', isActive: true };
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingDiscount(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (d) => {
    setEditingDiscount(d.id);
    setForm({
      code: d.code, name: d.name, type: d.type, value: d.value,
      minOrder: d.minOrder ?? '', maxDiscount: d.maxDiscount ?? '',
      usageLimit: d.usageLimit ?? '', startsAt: d.startsAt || '', endsAt: d.endsAt || '',
      isActive: d.isActive,
    });
    setShowModal(true);
  };

  const saveDiscount = () => {
    if (!form.code.trim() || !form.name.trim()) return;
    const data = {
      code: form.code.toUpperCase().trim(), name: form.name.trim(), type: form.type,
      value: Number(form.value),
      minOrder: form.minOrder ? Number(form.minOrder) : null,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      startsAt: form.startsAt || null, endsAt: form.endsAt || null,
      isActive: form.isActive,
    };
    if (editingDiscount) {
      setDiscounts(prev => prev.map(d => d.id === editingDiscount ? { ...d, ...data } : d));
      addToast('Discount updated', 'success');
    } else {
      setDiscounts(prev => [...prev, { id: 'd-' + uid(), ...data, usedCount: 0 }]);
      addToast('Discount created', 'success');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setDiscounts(prev => prev.filter(d => d.id !== id));
    setDeleteConfirm(null);
    addToast('Discount deleted', 'info');
  };

  return (
    <div className="adm__discounts">
      <div className="adm__section-header">
        <h2 className="adm__section-title">Discount Codes</h2>
        <button className="adm__btn adm__btn--primary" onClick={openAdd}>{icon('add')} Add Discount</button>
      </div>

      <div className="adm__table-wrap">
      <table className="adm__table">
        <thead>
          <tr><th>Code</th><th>Name</th><th>Type</th><th>Value</th><th>Usage</th><th>Period</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {discounts.map(d => (
            <tr key={d.id}>
              <td><code className="adm__code">{d.code}</code></td>
              <td>{d.name}</td>
              <td>{d.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}</td>
              <td>{d.type === 'percentage' ? `${d.value}%` : fmtCurrency(d.value)}</td>
              <td>{d.usedCount} / {d.usageLimit ?? '∞'}</td>
              <td>{fmtDate(d.startsAt)} — {d.endsAt ? fmtDate(d.endsAt) : 'No end'}</td>
              <td><StatusBadge status={d.isActive ? 'active' : 'inactive'} /></td>
              <td className="adm__actions-cell">
                <button className="adm__icon-btn" onClick={() => openEdit(d)} title="Edit">{icon('edit')}</button>
                {deleteConfirm === d.id ? (
                  <span className="adm__delete-confirm">
                    Sure? <button className="adm__icon-btn adm__icon-btn--danger" onClick={() => handleDelete(d.id)}>✓</button>
                    <button className="adm__icon-btn" onClick={() => setDeleteConfirm(null)}>✗</button>
                  </span>
                ) : (
                  <button className="adm__icon-btn adm__icon-btn--danger" onClick={() => setDeleteConfirm(d.id)} title="Delete">{icon('delete')}</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {showModal && (
        <div className="adm__modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="adm__modal-content" onClick={e => e.stopPropagation()}>
            <div className="adm__modal-header">
              <h3>{editingDiscount ? 'Edit Discount' : 'New Discount'}</h3>
              <button className="adm__icon-btn" onClick={() => setShowModal(false)}>{icon('close')}</button>
            </div>
            <div className="adm__modal-body">
              <div className="adm__form">
                <div className="adm__form-grid">
                  <div className="adm__form-group">
                    <label className="adm__form-label">Code</label>
                    <input className="adm__form-input" type="text" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="e.g. SAVE20" />
                  </div>
                  <div className="adm__form-group">
                    <label className="adm__form-label">Name</label>
                    <input className="adm__form-input" type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Discount name" />
                  </div>
                  <div className="adm__form-group">
                    <label className="adm__form-label">Type</label>
                    <select className="adm__form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                      <option value="percentage">Percentage</option>
                      <option value="fixed_amount">Fixed Amount (€)</option>
                    </select>
                  </div>
                  <div className="adm__form-group">
                    <label className="adm__form-label">Value</label>
                    <input className="adm__form-input" type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
                  </div>
                  <div className="adm__form-group">
                    <label className="adm__form-label">Min Order (€)</label>
                    <input className="adm__form-input" type="number" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))} placeholder="Optional" />
                  </div>
                  <div className="adm__form-group">
                    <label className="adm__form-label">Max Discount (€)</label>
                    <input className="adm__form-input" type="number" value={form.maxDiscount} onChange={e => setForm(f => ({ ...f, maxDiscount: e.target.value }))} placeholder="Optional" />
                  </div>
                  <div className="adm__form-group">
                    <label className="adm__form-label">Usage Limit</label>
                    <input className="adm__form-input" type="number" value={form.usageLimit} onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))} placeholder="Optional" />
                  </div>
                  <div className="adm__form-group">
                    <label className="adm__form-label">Start Date</label>
                    <input className="adm__form-input" type="date" value={form.startsAt} onChange={e => setForm(f => ({ ...f, startsAt: e.target.value }))} />
                  </div>
                  <div className="adm__form-group">
                    <label className="adm__form-label">End Date</label>
                    <input className="adm__form-input" type="date" value={form.endsAt} onChange={e => setForm(f => ({ ...f, endsAt: e.target.value }))} />
                  </div>
                  <div className="adm__form-group">
                    <label className="adm__form-label">Active</label>
                    <label className="adm__switch">
                      <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                      <span className="adm__switch-slider" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="adm__modal-footer">
              <button className="adm__btn adm__btn--primary" onClick={saveDiscount}>{icon('save')} {editingDiscount ? 'Update' : 'Create'}</button>
              <button className="adm__btn adm__btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════ SETTINGS ═══════════════════════ */
function SettingsTab({ addToast }) {
  const STORAGE = 'ts_admin_settings';
  const defaults = {
    storeName: 'TS Leather', storeEmail: 'contact@tsleather.com', storePhone: '+33 1 42 68 00 00',
    storeAddress: '24 Rue du Faubourg Saint-Honoré, 75008 Paris, France',
    currency: 'EUR', taxRate: 20,
    freeShippingThreshold: 500,
    carriers: 'Colissimo, DHL Express, La Poste',
  };

  const [settings, setSettings] = useState(() => {
    try { const raw = localStorage.getItem(STORAGE); return raw ? { ...defaults, ...JSON.parse(raw) } : defaults; }
    catch { return defaults; }
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE, JSON.stringify(settings));
    addToast('Settings saved successfully', 'success');
  };

  return (
    <div className="adm__settings">
      <h2 className="adm__section-title">Settings</h2>

      <div className="adm__card">
        <h3 className="adm__card-title">Store Information</h3>
        <div className="adm__form">
          <div className="adm__form-grid">
            <div className="adm__form-group">
              <label className="adm__form-label">Store Name</label>
              <input className="adm__form-input" type="text" value={settings.storeName} onChange={e => handleChange('storeName', e.target.value)} />
            </div>
            <div className="adm__form-group">
              <label className="adm__form-label">Email</label>
              <input className="adm__form-input" type="email" value={settings.storeEmail} onChange={e => handleChange('storeEmail', e.target.value)} />
            </div>
            <div className="adm__form-group">
              <label className="adm__form-label">Phone</label>
              <input className="adm__form-input" type="tel" value={settings.storePhone} onChange={e => handleChange('storePhone', e.target.value)} />
            </div>
            <div className="adm__form-group adm__form-full">
              <label className="adm__form-label">Address</label>
              <input className="adm__form-input" type="text" value={settings.storeAddress} onChange={e => handleChange('storeAddress', e.target.value)} />
            </div>
            <div className="adm__form-group">
              <label className="adm__form-label">Currency</label>
              <select className="adm__form-select" value={settings.currency} onChange={e => handleChange('currency', e.target.value)}>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div className="adm__form-group">
              <label className="adm__form-label">Tax Rate (%)</label>
              <input className="adm__form-input" type="number" value={settings.taxRate} onChange={e => handleChange('taxRate', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="adm__card">
        <h3 className="adm__card-title">Shipping Settings</h3>
        <div className="adm__form">
          <div className="adm__form-grid">
            <div className="adm__form-group">
              <label className="adm__form-label">Free Shipping Threshold (€)</label>
              <input className="adm__form-input" type="number" value={settings.freeShippingThreshold} onChange={e => handleChange('freeShippingThreshold', e.target.value)} />
            </div>
            <div className="adm__form-group adm__form-full">
              <label className="adm__form-label">Carriers (comma-separated)</label>
              <input className="adm__form-input" type="text" value={settings.carriers} onChange={e => handleChange('carriers', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="adm__form-actions">
        <button className="adm__btn adm__btn--primary" onClick={handleSave}>{icon('save')} Save Settings</button>
      </div>
    </div>
  );
}

/* ═══════════════════════ MAIN ADMIN COMPONENT ═══════════════════════ */
const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'orders', label: 'Orders', icon: 'orders' },
  { id: 'products', label: 'Products', icon: 'inventory_2' },
  { id: 'customers', label: 'Customers', icon: 'people' },
  { id: 'reviews', label: 'Reviews', icon: 'reviews' },
  { id: 'discounts', label: 'Discounts', icon: 'local_offer' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

function Admin() {
  const { isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [toasts, setToasts] = useState([]);
  const [orderFilter, setOrderFilter] = useState(null);

  const addToast = useCallback((message, type = 'info') => {
    const id = uid();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  if (!isAdmin) {
    return (
      <div className="adm adm--denied">
        <div className="adm__denied-card">
          {icon('warning')}
          <h1>Access Denied</h1>
          <p>You do not have permission to access the admin dashboard.</p>
          <Link to="/login" className="adm__btn adm__btn--primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab orders={orders} products={PRODUCTS} setActiveTab={setActiveTab} setOrderFilter={setOrderFilter} />;
      case 'orders': return <OrdersTab orders={orders} setOrders={setOrders} addToast={addToast} initialFilter={orderFilter} />;
      case 'products': return <ProductsTab addToast={addToast} />;
      case 'customers': return <CustomersTab orders={orders} addToast={addToast} />;
      case 'reviews': return <ReviewsTab addToast={addToast} />;
      case 'discounts': return <DiscountsTab addToast={addToast} />;
      case 'settings': return <SettingsTab addToast={addToast} />;
      default: return <DashboardTab orders={orders} products={PRODUCTS} setActiveTab={setActiveTab} setOrderFilter={setOrderFilter} />;
    }
  };

  return (
    <div className="adm">
      <aside className="adm__sidebar">
        <div className="adm__sidebar-brand">
          <Link to="/" className="adm__sidebar-back">
            {icon('storefront')} <span>Back to Store</span>
          </Link>
          <h2>TS Admin</h2>
        </div>

        <nav className="adm__sidebar-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`adm__sidebar-link ${activeTab === tab.id ? 'adm__sidebar-link--active' : ''}`}
              onClick={() => { setActiveTab(tab.id); if (tab.id !== 'orders') setOrderFilter(null); }}
            >
              {icon(tab.icon)}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="adm__sidebar-footer">
          <div className="adm__sidebar-user">
            <strong>{user?.firstName} {user?.lastName}</strong>
            <small>{user?.email}</small>
          </div>
          <button className="adm__sidebar-link" onClick={() => { navigate('/login'); setTimeout(logout, 50); }}>
            {icon('logout')}
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="adm__main">
        {renderTab()}
      </main>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default Admin;
