import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { PRODUCTS, StarRating } from '../Products/Products';
import './Account.css';

const TABS = [
  { key: 'overview', label: 'Overview', icon: 'dashboard' },
  { key: 'orders', label: 'Orders', icon: 'receipt_long' },
  { key: 'addresses', label: 'Addresses', icon: 'location_on' },
  { key: 'wishlist', label: 'Wishlist', icon: 'favorite' },
  { key: 'profile', label: 'Profile', icon: 'person' },
];

const STATUS_COLORS = {
  pending: '#C49B38',
  confirmed: '#5A9A6F',
  processing: '#6A8FD8',
  shipped: '#9B6AD8',
  delivered: '#4CAF50',
  cancelled: '#B44040',
  refunded: '#B44040',
};

const STATUS_ICONS = {
  pending: 'hourglass_top',
  confirmed: 'check_circle',
  processing: 'precision_manufacturing',
  shipped: 'local_shipping',
  delivered: 'inventory_2',
  cancelled: 'cancel',
  refunded: 'currency_exchange',
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
function formatCurrency(n) {
  return '€' + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function Account() {
  const { user, isAuthenticated, logout, updateProfile, orders, addresses, addAddress, removeAddress, wishlist, toggleWishlist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialTab = new URLSearchParams(location.search).get('tab') || 'overview';
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    const param = new URLSearchParams(location.search).get('tab');
    if (param && TABS.some(t => t.key === param)) setTab(param);
  }, [location.search]);
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [addingAddr, setAddingAddr] = useState(false);
  const [addrForm, setAddrForm] = useState({ type: 'shipping', firstName: '', lastName: '', phone: '', addressLine1: '', addressLine2: '', city: '', postalCode: '', country: 'France', isDefault: false });

  const wishlistProducts = useMemo(
    () => wishlist.map(slug => PRODUCTS.find(p => p.slug === slug)).filter(Boolean),
    [wishlist]
  );

  if (!isAuthenticated) {
    navigate('/login', { replace: true });
    return null;
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  function startEditProfile() {
    setProfileForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || '' });
    setEditMode(true);
  }
  function saveProfile(e) {
    e.preventDefault();
    updateProfile(profileForm);
    setEditMode(false);
  }

  function handleAddAddress(e) {
    e.preventDefault();
    addAddress(addrForm);
    setAddrForm({ type: 'shipping', firstName: '', lastName: '', phone: '', addressLine1: '', addressLine2: '', city: '', postalCode: '', country: 'France', isDefault: false });
    setAddingAddr(false);
  }

  return (
    <main className="acct">
      <div className="container acct__layout">
        <aside className="acct__sidebar">
          <div className="acct__user-card">
            <div className="acct__avatar">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <h3 className="acct__user-name">{user.firstName} {user.lastName}</h3>
            <span className="acct__user-email">{user.email}</span>
            <span className="acct__member-since">Member since {formatDate(user.createdAt)}</span>
          </div>
          <nav className="acct__nav">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`acct__nav-item ${tab === t.key ? 'active' : ''}`}
                onClick={() => setTab(t.key)}
              >
                <span className={`material-symbols-outlined${tab === t.key ? ' icon--filled' : ''}`}>{t.icon}</span>
                {t.label}
              </button>
            ))}
            <button className="acct__nav-item acct__nav-item--logout" onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span>
              Sign Out
            </button>
          </nav>
        </aside>

        <section className="acct__main">

          {tab === 'overview' && (
            <div className="acct__tab">
              <h2 className="acct__tab-title">
                Welcome back, {user.firstName}
                <span className="material-symbols-outlined">waving_hand</span>
              </h2>

              <div className="acct__stats">
                <div className="acct__stat-card">
                  <span className="material-symbols-outlined">receipt_long</span>
                  <div>
                    <span className="acct__stat-num">{orders.length}</span>
                    <span className="acct__stat-label">Orders</span>
                  </div>
                </div>
                <div className="acct__stat-card">
                  <span className="material-symbols-outlined">favorite</span>
                  <div>
                    <span className="acct__stat-num">{wishlist.length}</span>
                    <span className="acct__stat-label">Wishlist</span>
                  </div>
                </div>
                <div className="acct__stat-card">
                  <span className="material-symbols-outlined">location_on</span>
                  <div>
                    <span className="acct__stat-num">{addresses.length}</span>
                    <span className="acct__stat-label">Addresses</span>
                  </div>
                </div>
                <div className="acct__stat-card">
                  <span className="material-symbols-outlined">payments</span>
                  <div>
                    <span className="acct__stat-num">{formatCurrency(orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.totalAmount, 0))}</span>
                    <span className="acct__stat-label">Total Spent</span>
                  </div>
                </div>
              </div>

              {/* Recent orders */}
              <h3 className="acct__section-title">Recent Orders</h3>
              <div className="acct__orders-list">
                {orders.slice(0, 3).map(order => (
                  <Link key={order.id} to={`/order/${order.orderNumber}`} className="acct__order-card">
                    <div className="acct__order-left">
                      <span className="acct__order-num">{order.orderNumber}</span>
                      <span className="acct__order-date">{formatDate(order.orderedAt)}</span>
                    </div>
                    <div className="acct__order-items-preview">
                      {order.items.slice(0, 3).map(item => (
                        <img key={item.id} src={item.image} alt={item.productName} className="acct__order-thumb" />
                      ))}
                      {order.items.length > 3 && <span className="acct__order-more">+{order.items.length - 3}</span>}
                    </div>
                    <div className="acct__order-right">
                      <span className="acct__order-status" style={{ color: STATUS_COLORS[order.status] }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>{STATUS_ICONS[order.status]}</span>
                        {order.status}
                      </span>
                      <span className="acct__order-total">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── Orders ── */}
          {tab === 'orders' && (
            <div className="acct__tab">
              <h2 className="acct__tab-title">Order History</h2>
              {orders.length === 0 ? (
                <div className="acct__empty">
                  <span className="material-symbols-outlined">receipt_long</span>
                  <p>No orders yet.</p>
                  <Link to="/products" className="btn btn--solid">Start Shopping</Link>
                </div>
              ) : (
                <div className="acct__orders-full">
                  {orders.map(order => (
                    <Link key={order.id} to={`/order/${order.orderNumber}`} className="acct__order-row">
                      <div className="acct__order-row-main">
                        <div className="acct__order-row-left">
                          <span className="acct__order-num">{order.orderNumber}</span>
                          <span className="acct__order-date">{formatDate(order.orderedAt)}</span>
                          <span className="acct__order-item-count">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                        </div>
                        <div className="acct__order-row-items">
                          {order.items.map(item => (
                            <div key={item.id} className="acct__order-item-mini">
                              <img src={item.image} alt={item.productName} />
                              <div>
                                <span className="acct__order-item-name">{item.productName}</span>
                                <span className="acct__order-item-detail">{item.color} • {item.sizeLabel} • ×{item.quantity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="acct__order-row-right">
                          <span className="acct__order-status" style={{ color: STATUS_COLORS[order.status] }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>{STATUS_ICONS[order.status]}</span>
                            {order.status}
                          </span>
                          <span className="acct__order-total">{formatCurrency(order.totalAmount)}</span>
                          {order.shipment?.trackingNumber && (
                            <span className="acct__order-tracking">
                              <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>local_shipping</span>
                              {order.shipment.trackingNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Addresses ── */}
          {tab === 'addresses' && (
            <div className="acct__tab">
              <div className="acct__tab-header">
                <h2 className="acct__tab-title">My Addresses</h2>
                <button className="btn btn--solid btn--sm cust__nav-btn" onClick={() => setAddingAddr(true)}>
                  <span className="material-symbols-outlined">add</span> Add Address
                </button>
              </div>

              {addingAddr && (
                <form className="acct__addr-form" onSubmit={handleAddAddress}>
                  <h3>New Address</h3>
                  <div className="acct__addr-grid">
                    <select value={addrForm.type} onChange={e => setAddrForm(f => ({ ...f, type: e.target.value }))}>
                      <option value="shipping">Shipping</option>
                      <option value="billing">Billing</option>
                    </select>
                    <input placeholder="First Name *" required value={addrForm.firstName} onChange={e => setAddrForm(f => ({ ...f, firstName: e.target.value }))} />
                    <input placeholder="Last Name *" required value={addrForm.lastName} onChange={e => setAddrForm(f => ({ ...f, lastName: e.target.value }))} />
                    <input placeholder="Phone" value={addrForm.phone} onChange={e => setAddrForm(f => ({ ...f, phone: e.target.value }))} />
                    <input placeholder="Address Line 1 *" required className="acct__addr-full" value={addrForm.addressLine1} onChange={e => setAddrForm(f => ({ ...f, addressLine1: e.target.value }))} />
                    <input placeholder="Address Line 2" className="acct__addr-full" value={addrForm.addressLine2} onChange={e => setAddrForm(f => ({ ...f, addressLine2: e.target.value }))} />
                    <input placeholder="City *" required value={addrForm.city} onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))} />
                    <input placeholder="Postal Code *" required value={addrForm.postalCode} onChange={e => setAddrForm(f => ({ ...f, postalCode: e.target.value }))} />
                    <input placeholder="Country" value={addrForm.country} onChange={e => setAddrForm(f => ({ ...f, country: e.target.value }))} />
                    <label className="acct__addr-default">
                      <input type="checkbox" checked={addrForm.isDefault} onChange={e => setAddrForm(f => ({ ...f, isDefault: e.target.checked }))} />
                      Set as default
                    </label>
                  </div>
                  <div className="acct__addr-actions">
                    <button type="submit" className="btn btn--gradient btn--sm">Save</button>
                    <button type="button" className="btn btn--solid btn--sm" onClick={() => setAddingAddr(false)}>Cancel</button>
                  </div>
                </form>
              )}

              <div className="acct__addr-list">
                {addresses.map(addr => (
                  <div key={addr.id} className="acct__addr-card">
                    <div className="acct__addr-type">
                      <span className="material-symbols-outlined">{addr.type === 'shipping' ? 'local_shipping' : 'receipt'}</span>
                      {addr.type}
                      {addr.isDefault && <span className="acct__addr-badge">Default</span>}
                    </div>
                    <p className="acct__addr-name">{addr.firstName} {addr.lastName}</p>
                    <p className="acct__addr-line">{addr.addressLine1}</p>
                    {addr.addressLine2 && <p className="acct__addr-line">{addr.addressLine2}</p>}
                    <p className="acct__addr-line">{addr.postalCode} {addr.city}, {addr.country}</p>
                    {addr.phone && <p className="acct__addr-phone">{addr.phone}</p>}
                    <button className="acct__addr-remove" onClick={() => removeAddress(addr.id)} title="Remove">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Wishlist ── */}
          {tab === 'wishlist' && (
            <div className="acct__tab">
              <h2 className="acct__tab-title">My Wishlist</h2>
              {wishlistProducts.length === 0 ? (
                <div className="acct__empty">
                  <span className="material-symbols-outlined">favorite_border</span>
                  <p>Your wishlist is empty.</p>
                  <Link to="/products" className="btn btn--solid">Discover Products</Link>
                </div>
              ) : (
                <div className="acct__wishlist-grid">
                  {wishlistProducts.map(product => (
                    <div key={product.slug} className="acct__wish-card">
                      <Link to={`/product/${product.slug}`} className="acct__wish-img">
                        <img src={product.images?.[0] || product.img} alt={product.name} />
                      </Link>
                      <div className="acct__wish-info">
                        <Link to={`/product/${product.slug}`} className="acct__wish-name">{product.name}</Link>
                        <div className="acct__wish-meta">
                          <StarRating rating={product.rating} />
                          <span className="acct__wish-price">
                            ${product.price}
                            {product.originalPrice && <s>${product.originalPrice}</s>}
                          </span>
                        </div>
                        <span className="acct__wish-material">{product.material}</span>
                      </div>
                      <button className="acct__wish-remove" onClick={() => toggleWishlist(product.slug)} title="Remove from wishlist">
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Profile ── */}
          {tab === 'profile' && (
            <div className="acct__tab">
              <h2 className="acct__tab-title">Personal Information</h2>
              {editMode ? (
                <form className="acct__profile-form" onSubmit={saveProfile}>
                  <div className="auth__row">
                    <div className="auth__field">
                      <label>First Name</label>
                      <div className="auth__input-wrap">
                        <input value={profileForm.firstName} onChange={e => setProfileForm(f => ({ ...f, firstName: e.target.value }))} />
                      </div>
                    </div>
                    <div className="auth__field">
                      <label>Last Name</label>
                      <div className="auth__input-wrap">
                        <input value={profileForm.lastName} onChange={e => setProfileForm(f => ({ ...f, lastName: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                  <div className="auth__field">
                    <label>Phone</label>
                    <div className="auth__input-wrap">
                      <input value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                  </div>
                  <div className="acct__profile-actions">
                    <button type="submit" className="btn btn--gradient btn--sm">Save Changes</button>
                    <button type="button" className="btn btn--solid btn--sm" onClick={() => setEditMode(false)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="acct__profile-info">
                  <div className="acct__profile-row">
                    <span className="acct__profile-label">First Name</span>
                    <span className="acct__profile-val">{user.firstName}</span>
                  </div>
                  <div className="acct__profile-row">
                    <span className="acct__profile-label">Last Name</span>
                    <span className="acct__profile-val">{user.lastName}</span>
                  </div>
                  <div className="acct__profile-row">
                    <span className="acct__profile-label">Email</span>
                    <span className="acct__profile-val">{user.email}</span>
                  </div>
                  <div className="acct__profile-row">
                    <span className="acct__profile-label">Phone</span>
                    <span className="acct__profile-val">{user.phone || '—'}</span>
                  </div>
                  <div className="acct__profile-row">
                    <span className="acct__profile-label">Role</span>
                    <span className="acct__profile-val" style={{ textTransform: 'capitalize' }}>{user.role}</span>
                  </div>
                  <div className="acct__profile-row">
                    <span className="acct__profile-label">Last Login</span>
                    <span className="acct__profile-val">{formatDate(user.lastLoginAt)}</span>
                  </div>
                  <button className="btn btn--solid btn--sm pd__add-cart" onClick={startEditProfile}>
                    <span className="material-symbols-outlined">edit</span> Edit Profile
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Account;
