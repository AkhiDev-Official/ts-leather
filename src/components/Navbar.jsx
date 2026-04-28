import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Men', cat: 'men' },
  { label: 'Women', cat: 'women' },
  { label: 'Kids', cat: 'kids' },
  { label: 'Wallets', cat: 'wallets' },
  { label: 'Customize', cat: 'customize' },
];

const SEASON_LINKS = [
  { label: 'Winter', slug: 'winter', icon: 'ac_unit' },
  { label: 'Spring', slug: 'spring', icon: 'local_florist' },
  { label: 'Summer', slug: 'summer', icon: 'wb_sunny' },
  { label: 'Autumn', slug: 'autumn', icon: 'eco' },
];

const MQ = '(max-width: 768px)';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MQ).matches);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const mql = window.matchMedia(MQ);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setCollectionsOpen(false);
    setAccountOpen(false);
  }, [location.pathname, location.search]);

  // Lock scroll when fullscreen menu is open (doesn't work...)
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const currentCat = new URLSearchParams(location.search).get('cat');
  const currentSeason = location.pathname.startsWith('/collection/')
    ? location.pathname.split('/').pop()
    : null;

  function handleCatClick(cat) {
    navigate(`/products?cat=${cat}`);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  const hoverOpen = useCallback((setter) => {
    if (!isMobile) return { onMouseEnter: () => setter(true), onMouseLeave: () => setter(false) };
    return {};
  }, [isMobile]);

  return (
    <nav className={`navbar${menuOpen ? ' menu-open' : ''}`}>
      <div className="navbar__inner">
        <button
          className={`navbar__burger${menuOpen ? ' open' : ''}`}
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>

        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <img src="/assets/logo_new.jpg" alt="TS Leather Logo" />
        </Link>

        <div className={`navbar__links${menuOpen ? ' open' : ''}`}>
          {/* Collections */}
          <div className="navbar__dropdown" {...hoverOpen(setCollectionsOpen)}>
            <button
              className={`navbar__dropdown-trigger${currentSeason ? ' active' : ''}${collectionsOpen ? ' expanded' : ''}`}
              onClick={() => setCollectionsOpen(o => !o)}
              aria-expanded={collectionsOpen}
            >
              Collections
              <span className="material-symbols-outlined navbar__dropdown-arrow">expand_more</span>
            </button>
            <div className={`navbar__dropdown-menu${collectionsOpen ? ' open' : ''}`}>
              {SEASON_LINKS.map(({ label, slug, icon }) => (
                <Link
                  key={slug}
                  to={`/collection/${slug}`}
                  className={`navbar__dropdown-item${currentSeason === slug ? ' active' : ''}`}
                >
                  <span className="material-symbols-outlined navbar__dropdown-icon">{icon}</span>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {NAV_LINKS.map(({ label, cat }) => (
            <a
              key={cat}
              href={`/products?cat=${cat}`}
              className={currentCat === cat ? 'active' : ''}
              onClick={e => { e.preventDefault(); handleCatClick(cat); }}
            >
              {label}
            </a>
          ))}

          {/* Account */}
          {isMobile && isAuthenticated && (
            <div className="navbar__mobile-account">
              <div className="navbar__mobile-account-header">
                <span className="material-symbols-outlined icon--filled">person</span>
                <span>{user.firstName} {user.lastName}</span>
              </div>
              {!isAdmin && (
                <>
                  <Link to="/account" className="navbar__mobile-account-link" onClick={() => setMenuOpen(false)}>
                    <span className="material-symbols-outlined">dashboard</span> My Account
                  </Link>
                  <Link to="/account" className="navbar__mobile-account-link" onClick={() => setMenuOpen(false)}>
                    <span className="material-symbols-outlined">receipt_long</span> My Orders
                  </Link>
                  <Link to="/account" className="navbar__mobile-account-link" onClick={() => setMenuOpen(false)}>
                    <span className="material-symbols-outlined">favorite</span> Wishlist
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin" className="navbar__mobile-account-link navbar__mobile-account-link--admin" onClick={() => setMenuOpen(false)}>
                  <span className="material-symbols-outlined">admin_panel_settings</span> Admin Panel
                </Link>
              )}
              <button className="navbar__mobile-account-link navbar__mobile-account-link--logout" onClick={() => { setMenuOpen(false); handleLogout(); }}>
                <span className="material-symbols-outlined">logout</span> Sign Out
              </button>
            </div>
          )}
          {isMobile && !isAuthenticated && (
            <div className="navbar__mobile-account">
              <Link to="/login" className="navbar__mobile-account-link navbar__mobile-account-link--login" onClick={() => setMenuOpen(false)}>
                <span className="material-symbols-outlined">login</span> Sign In
              </Link>
            </div>
          )}
        </div>

        <div className="navbar__actions">
          <button aria-label="Cart">
            <span className="material-symbols-outlined icon--filled">shopping_bag</span>
          </button>

          {/* Account */}
          <div className="navbar__dropdown navbar__account-dropdown" {...hoverOpen(setAccountOpen)}>
            <button
              className={`navbar__account-btn ${isAuthenticated ? 'logged-in' : ''}`}
              aria-label="Account"
              onClick={() => {
                if (!isAuthenticated) { navigate('/login'); setMenuOpen(false); }
                else if(isAdmin) { navigate('/admin'); setAccountOpen(false); }
                else { navigate('/account'); setAccountOpen(false); }
              }}
            >
              <span className={`material-symbols-outlined${isAuthenticated ? ' icon--filled' : ''}`}>person</span>
              {isAuthenticated && <span className="navbar__account-dot" />}
            </button>
            {isAuthenticated && !isAdmin && (
              <div className={`navbar__dropdown-menu navbar__account-menu${accountOpen ? ' open' : ''}`}>
                <div className="navbar__account-header">
                  <span className="navbar__account-name">{user.firstName} {user.lastName}</span>
                  <span className="navbar__account-email">{user.email}</span>
                </div>
                <Link to="/account" className="navbar__dropdown-item">
                  <span className="material-symbols-outlined navbar__dropdown-icon">dashboard</span>
                  Dashboard
                </Link>
                <Link to="/account" className="navbar__dropdown-item">
                  <span className="material-symbols-outlined navbar__dropdown-icon">receipt_long</span>
                  My Orders
                </Link>
                <Link to="/account" className="navbar__dropdown-item">
                  <span className="material-symbols-outlined navbar__dropdown-icon">favorite</span>
                  Wishlist
                </Link>
                <button className="navbar__dropdown-item navbar__dropdown-item--logout" onClick={handleLogout}>
                  <span className="material-symbols-outlined navbar__dropdown-icon">logout</span>
                  Sign Out
                </button>
              </div>
            )}
            {isAuthenticated && isAdmin && (
              <div className={`navbar__dropdown-menu navbar__account-menu${accountOpen ? ' open' : ''}`}>
                <Link to="/admin" className="navbar__dropdown-item navbar__dropdown-item--admin">
                  <span className="material-symbols-outlined navbar__dropdown-icon">admin_panel_settings</span>
                  Admin Panel
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
