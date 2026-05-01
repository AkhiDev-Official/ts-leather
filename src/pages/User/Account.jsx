import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { StarRating } from '../Products/Products';
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
  const { logout, updateProfile, addresses, addAddress, removeAddress, wishlist, toggleWishlist } = useAuth();
  const { t } = useTranslation();
  const user = useSelector((s) => s.user.user);
  const isAuthenticated = useSelector((s) => !!s.user.user);
  const orders = useSelector((s) => s.orders.list);
  const products = useSelector((s) => s.products.list);
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
    () => wishlist.map(slug => products.find(p => p.slug === slug)).filter(Boolean),
    [wishlist, products]
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
            <span className="acct__member-since">{t('account.member_since', { date: formatDate(user.createdAt) })}</span>
          </div>
          <nav className="acct__nav">
            {TABS.map(tabItem => (
              <button
                key={tabItem.key}
                className={`acct__nav-item ${tab === tabItem.key ? 'active' : ''}`}
                onClick={() => setTab(tabItem.key)}
              >
                <span className={`material-symbols-outlined${tab === tabItem.key ? ' icon--filled' : ''}`}>{tabItem.icon}</span>
                {t('account.tab_' + tabItem.key)}
              </button>
            ))}
            <button className="acct__nav-item acct__nav-item--logout" onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span>
              {t('account.sign_out')}
            </button>
          </nav>
        </aside>

        <section className="acct__main">

          {tab === 'overview' && (
            <div className="acct__tab">
              <h2 className="acct__tab-title">
                {t('account.welcome_back', { name: user.firstName })}
                <span className="material-symbols-outlined">waving_hand</span>
              </h2>

              <div className="acct__stats">
                <div className="acct__stat-card">
                  <span className="material-symbols-outlined">receipt_long</span>
                  <div>
                    <span className="acct__stat-num">{orders.length}</span>
                    <span className="acct__stat-label">{t('account.stat_orders')}</span>
                  </div>
                </div>
                <div className="acct__stat-card">
                  <span className="material-symbols-outlined">favorite</span>
                  <div>
                    <span className="acct__stat-num">{wishlist.length}</span>
                    <span className="acct__stat-label">{t('account.stat_wishlist')}</span>
                  </div>
                </div>
                <div className="acct__stat-card">
                  <span className="material-symbols-outlined">location_on</span>
                  <div>
                    <span className="acct__stat-num">{addresses.length}</span>
                    <span className="acct__stat-label">{t('account.stat_addresses')}</span>
                  </div>
                </div>
                <div className="acct__stat-card">
                  <span className="material-symbols-outlined">payments</span>
                  <div>
                    <span className="acct__stat-num">{formatCurrency(orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.totalAmount, 0))}</span>
                    <span className="acct__stat-label">{t('account.stat_total_spent')}</span>
                  </div>
                </div>
              </div>

              {/* Recent orders */}
              <h3 className="acct__section-title">{t('account.recent_orders')}</h3>
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
              <h2 className="acct__tab-title">{t('account.order_history')}</h2>
              {orders.length === 0 ? (
                <div className="acct__empty">
                  <span className="material-symbols-outlined">receipt_long</span>
                  <p>{t('account.no_orders')}</p>
                  <Link to="/products" className="btn btn--solid">{t('account.start_shopping')}</Link>
                </div>
              ) : (
                <div className="acct__orders-full">
                  {orders.map(order => (
                    <Link key={order.id} to={`/order/${order.orderNumber}`} className="acct__order-row">
                      <div className="acct__order-row-main">
                        <div className="acct__order-row-left">
                          <span className="acct__order-num">{order.orderNumber}</span>
                          <span className="acct__order-date">{formatDate(order.orderedAt)}</span>
                          <span className="acct__order-item-count">{t('account.items', { count: order.items.length })}</span>
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
                <h2 className="acct__tab-title">{t('account.my_addresses')}</h2>
                <button className="btn btn--solid btn--sm cust__nav-btn" onClick={() => setAddingAddr(true)}>
                  <span className="material-symbols-outlined">add</span> {t('account.add_address')}
                </button>
              </div>

              {addingAddr && (
                <form className="acct__addr-form" onSubmit={handleAddAddress}>
                  <h3>{t('account.new_address')}</h3>
                  <div className="acct__addr-grid">
                    <select value={addrForm.type} onChange={e => setAddrForm(f => ({ ...f, type: e.target.value }))}>
                      <option value="shipping">{t('account.addr_type_shipping')}</option>
                      <option value="billing">{t('account.addr_type_billing')}</option>
                    </select>
                    <input placeholder={t('account.addr_first_name') + ' *'} required value={addrForm.firstName} onChange={e => setAddrForm(f => ({ ...f, firstName: e.target.value }))} />
                    <input placeholder={t('account.addr_last_name') + ' *'} required value={addrForm.lastName} onChange={e => setAddrForm(f => ({ ...f, lastName: e.target.value }))} />
                    <input placeholder={t('account.addr_phone')} value={addrForm.phone} onChange={e => setAddrForm(f => ({ ...f, phone: e.target.value }))} />
                    <input placeholder={t('account.addr_line1') + ' *'} required className="acct__addr-full" value={addrForm.addressLine1} onChange={e => setAddrForm(f => ({ ...f, addressLine1: e.target.value }))} />
                    <input placeholder={t('account.addr_line2')} className="acct__addr-full" value={addrForm.addressLine2} onChange={e => setAddrForm(f => ({ ...f, addressLine2: e.target.value }))} />
                    <input placeholder={t('account.addr_city') + ' *'} required value={addrForm.city} onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))} />
                    <input placeholder={t('account.addr_postal') + ' *'} required value={addrForm.postalCode} onChange={e => setAddrForm(f => ({ ...f, postalCode: e.target.value }))} />
                    <input placeholder={t('account.addr_country')} value={addrForm.country} onChange={e => setAddrForm(f => ({ ...f, country: e.target.value }))} />
                    <label className="acct__addr-default">
                      <input type="checkbox" checked={addrForm.isDefault} onChange={e => setAddrForm(f => ({ ...f, isDefault: e.target.checked }))} />
                      {t('account.addr_set_default')}
                    </label>
                  </div>
                  <div className="acct__addr-actions">
                    <button type="submit" className="btn btn--gradient btn--sm">{t('account.save')}</button>
                    <button type="button" className="btn btn--solid btn--sm" onClick={() => setAddingAddr(false)}>{t('account.cancel')}</button>
                  </div>
                </form>
              )}

              <div className="acct__addr-list">
                {addresses.map(addr => (
                  <div key={addr.id} className="acct__addr-card">
                    <div className="acct__addr-type">
                      <span className="material-symbols-outlined">{addr.type === 'shipping' ? 'local_shipping' : 'receipt'}</span>
                      {addr.type}
                      {addr.isDefault && <span className="acct__addr-badge">{t('account.addr_default_badge')}</span>}
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
              <h2 className="acct__tab-title">{t('account.my_wishlist')}</h2>
              {wishlistProducts.length === 0 ? (
                <div className="acct__empty">
                  <span className="material-symbols-outlined">favorite_border</span>
                  <p>{t('account.empty_wishlist')}</p>
                  <Link to="/products" className="btn btn--solid">{t('account.discover_products')}</Link>
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
              <h2 className="acct__tab-title">{t('account.personal_info')}</h2>
              {editMode ? (
                <form className="acct__profile-form" onSubmit={saveProfile}>
                  <div className="auth__row">
                    <div className="auth__field">
                      <label>{t('account.field_first_name')}</label>
                      <div className="auth__input-wrap">
                        <input value={profileForm.firstName} onChange={e => setProfileForm(f => ({ ...f, firstName: e.target.value }))} />
                      </div>
                    </div>
                    <div className="auth__field">
                      <label>{t('account.field_last_name')}</label>
                      <div className="auth__input-wrap">
                        <input value={profileForm.lastName} onChange={e => setProfileForm(f => ({ ...f, lastName: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                  <div className="auth__field">
                    <label>{t('account.field_phone')}</label>
                    <div className="auth__input-wrap">
                      <input value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                  </div>
                  <div className="acct__profile-actions">
                    <button type="submit" className="btn btn--gradient btn--sm">{t('account.save_changes')}</button>
                    <button type="button" className="btn btn--solid btn--sm" onClick={() => setEditMode(false)}>{t('account.cancel')}</button>
                  </div>
                </form>
              ) : (
                <div className="acct__profile-info">
                  <div className="acct__profile-row">
                    <span className="acct__profile-label">{t('account.field_first_name')}</span>
                    <span className="acct__profile-val">{user.firstName}</span>
                  </div>
                  <div className="acct__profile-row">
                    <span className="acct__profile-label">{t('account.field_last_name')}</span>
                    <span className="acct__profile-val">{user.lastName}</span>
                  </div>
                  <div className="acct__profile-row">
                    <span className="acct__profile-label">{t('account.field_email')}</span>
                    <span className="acct__profile-val">{user.email}</span>
                  </div>
                  <div className="acct__profile-row">
                    <span className="acct__profile-label">{t('account.field_phone')}</span>
                    <span className="acct__profile-val">{user.phone || '—'}</span>
                  </div>
                  <div className="acct__profile-row">
                    <span className="acct__profile-label">{t('account.field_role')}</span>
                    <span className="acct__profile-val" style={{ textTransform: 'capitalize' }}>{user.role}</span>
                  </div>
                  <div className="acct__profile-row">
                    <span className="acct__profile-label">{t('account.field_last_login')}</span>
                    <span className="acct__profile-val">{formatDate(user.lastLoginAt)}</span>
                  </div>
                  <button className="btn btn--solid btn--sm pd__add-cart" onClick={startEditProfile}>
                    <span className="material-symbols-outlined">edit</span> {t('account.edit_profile')}
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
