import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Navbar.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "flag-icons/css/flag-icons.min.css";

const NAV_LINKS = [
  { label: "Men", cat: "men" },
  { label: "Women", cat: "women" },
  { label: "Kids", cat: "kids" },
  { label: "Wallets", cat: "wallets" },
  { label: "Customize", cat: "customize" },
];

const SEASON_LINKS = [
  { label: "Winter", slug: "winter", icon: "ac_unit" },
  { label: "Spring", slug: "spring", icon: "local_florist" },
  { label: "Summer", slug: "summer", icon: "wb_sunny" },
  { label: "Autumn", slug: "autumn", icon: "eco" },
];

const MQ = "(max-width: 768px)";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MQ).matches);
  const [mobileTab, setMobileTab] = useState("shop"); // "shop" | "account"
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const toggleLang = () => {
    const next = i18n.language === "en" ? "fr" : "en";
    i18n.changeLanguage(next);
    localStorage.setItem("lang", next);
  };

  useEffect(() => {
    const mql = window.matchMedia(MQ);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setCollectionsOpen(false);
    setAccountOpen(false);
  }, [location.pathname, location.search]);

  // Lock scroll when fullscreen menu is open (doesn't work...)
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const currentCat = new URLSearchParams(location.search).get("cat");
  const currentSeason = location.pathname.startsWith("/collection/")
    ? location.pathname.split("/").pop()
    : null;

  function handleCatClick(cat) {
    navigate(`/products?cat=${cat}`);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  const cartCount = useSelector((s) =>
    s.cart.items.reduce((acc, i) => acc + i.quantity, 0),
  );

  const hoverOpen = useCallback(
    (setter) => {
      if (!isMobile)
        return {
          onMouseEnter: () => setter(true),
          onMouseLeave: () => setter(false),
        };
      return {};
    },
    [isMobile],
  );

  return (
    <nav className={`navbar${menuOpen ? " menu-open" : ""}`}>
      <div className="navbar__inner">
        <button
          className={`navbar__burger${menuOpen ? " open" : ""}`}
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <Link
          to="/"
          className="navbar__logo"
          onClick={() => setMenuOpen(false)}
        >
          <img src="/assets/logo_new.jpg" alt="TS Leather Logo" />
        </Link>

        <div className={`navbar__links${menuOpen ? " open" : ""}`}>
          {/* Tab switcher — only on mobile */}
          {isMobile && (
            <div className="navbar__tabs">
              <button
                className={`navbar__tab${mobileTab === "shop" ? " active" : ""}`}
                onClick={() => setMobileTab("shop")}
              >
                <span className="material-symbols-outlined">storefront</span>
                {t("nav.shop") /* or just "Shop" */}
              </button>
              <button
                className={`navbar__tab${mobileTab === "account" ? " active" : ""}`}
                onClick={() => setMobileTab("account")}
              >
                <span className="material-symbols-outlined icon--filled">
                  {isAdmin ? "admin_panel_settings" : "person"}
                </span>
                {isAdmin ? t("nav.admin_panel") : t("nav.account") /* or "Account" */}
              </button>
            </div>
          )}

          {/* SHOP TAB CONTENT */}
          {(!isMobile || mobileTab === "shop") && (
            <>
              {/* Collections dropdown */}
              <div className="navbar__dropdown" {...hoverOpen(setCollectionsOpen)}>
                <button
                  className={`navbar__dropdown-trigger${currentSeason ? " active" : ""}${collectionsOpen ? " expanded" : ""}`}
                  onClick={() => setCollectionsOpen((o) => !o)}
                  aria-expanded={collectionsOpen}
                >
                  {t("nav.collections")}
                  <span className="material-symbols-outlined navbar__dropdown-arrow">
                    expand_more
                  </span>
                </button>
                <div
                  className={`navbar__dropdown-menu${collectionsOpen ? " open" : ""}`}
                >
                  {SEASON_LINKS.map(({ slug, icon }) => (
                    <Link
                      key={slug}
                      to={`/collection/${slug}`}
                      className={`navbar__dropdown-item${currentSeason === slug ? " active" : ""}`}
                    >
                      <span className="material-symbols-outlined navbar__dropdown-icon">
                        {icon}
                      </span>
                      {t("nav." + slug)}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Nav links */}
              {NAV_LINKS.map(({ cat }) => (
                <a
                  key={cat}
                  href={`/products?cat=${cat}`}
                  className={currentCat === cat ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCatClick(cat);
                  }}
                >
                  {t("nav." + cat)}
                </a>
              ))}
            </>
          )}

          {/* ACCOUNT TAB CONTENT (mobile only) */}
          {isMobile && mobileTab === "account" && (
            <div className="navbar__mobile-account">
              {isAuthenticated ? (
                <>
                  {/* <div className="navbar__mobile-account-header">
                    <span className="material-symbols-outlined icon--filled">person</span>
                    <span>{user.firstName} {user.lastName}</span>
                  </div> */}

                  {/* Regular user links */}
                  {!isAdmin && (
                    <>
                      <Link to="/account?tab=overview" className="navbar__mobile-account-link" onClick={() => setMenuOpen(false)}>
                        <span className="material-symbols-outlined">dashboard</span>
                        {t("nav.overview")}
                      </Link>
                      <Link to="/account?tab=orders" className="navbar__mobile-account-link" onClick={() => setMenuOpen(false)}>
                        <span className="material-symbols-outlined">receipt_long</span>
                        {t("nav.my_orders")}
                      </Link>
                      <Link to="/account?tab=wishlist" className="navbar__mobile-account-link" onClick={() => setMenuOpen(false)}>
                        <span className="material-symbols-outlined">favorite</span>
                        {t("nav.wishlist")}
                      </Link>
                      <Link to="/account?tab=addresses" className="navbar__mobile-account-link" onClick={() => setMenuOpen(false)}>
                        <span className="material-symbols-outlined">location_on</span>
                        {t("nav.addresses")}
                      </Link>
                      <Link to="/account?tab=profile" className="navbar__mobile-account-link" onClick={() => setMenuOpen(false)}>
                        <span className="material-symbols-outlined">person</span>
                        {t("nav.profile")}
                      </Link>
                    </>
                  )}

                  {/* Admin links */}
                  {isAdmin && (
                    <>
                      <Link to="/admin?tab=dashboard" className="navbar__mobile-account-link navbar__mobile-account-link--admin" onClick={() => setMenuOpen(false)}>
                        <span className="material-symbols-outlined">dashboard</span>
                        {t("nav.dashboard")}
                      </Link>
                      <Link to="/admin?tab=orders" className="navbar__mobile-account-link navbar__mobile-account-link--admin" onClick={() => setMenuOpen(false)}>
                        <span className="material-symbols-outlined">orders</span>
                        {t("nav.orders")}
                      </Link>
                      <Link to="/admin?tab=products" className="navbar__mobile-account-link navbar__mobile-account-link--admin" onClick={() => setMenuOpen(false)}>
                        <span className="material-symbols-outlined">inventory_2</span>
                        {t("nav.products")}
                      </Link>
                      <Link to="/admin?tab=customers" className="navbar__mobile-account-link navbar__mobile-account-link--admin" onClick={() => setMenuOpen(false)}>
                        <span className="material-symbols-outlined">people</span>
                        {t("nav.customers")}
                      </Link>
                      <Link to="/admin?tab=reviews" className="navbar__mobile-account-link navbar__mobile-account-link--admin" onClick={() => setMenuOpen(false)}>
                        <span className="material-symbols-outlined">reviews</span>
                        {t("nav.reviews")}
                      </Link>
                      <Link to="/admin?tab=discounts" className="navbar__mobile-account-link navbar__mobile-account-link--admin" onClick={() => setMenuOpen(false)}>
                        <span className="material-symbols-outlined">local_offer</span>
                        {t("nav.discounts")}
                      </Link>
                      <Link to="/admin?tab=settings" className="navbar__mobile-account-link navbar__mobile-account-link--admin" onClick={() => setMenuOpen(false)}>
                        <span className="material-symbols-outlined">settings</span>
                        {t("nav.settings")}
                      </Link>
                    </>
                  )}

                  <button className="navbar__mobile-account-link navbar__mobile-account-link--logout" onClick={() => { setMenuOpen(false); handleLogout(); }}>
                    <span className="material-symbols-outlined">logout</span>
                    {t("nav.sign_out")}
                  </button>
                </>
              ) : (
                <Link to="/login" className="navbar__mobile-account-link navbar__mobile-account-link--login" onClick={() => setMenuOpen(false)}>
                  <span className="material-symbols-outlined">login</span>
                  {t("nav.sign_in")}
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="navbar__actions">
          <button className="navbar__lang-btn" onClick={toggleLang} aria-label="Change language">
            <span className={`fi fi-${i18n.language === "en" ? "gb" : "fr"}`} />
          </button>

          <Link to="/cart" className="navbar__cart-btn" aria-label="Cart">
            <span className="material-symbols-outlined icon--filled">
              shopping_bag
            </span>
            {cartCount > 0 && (
              <span className="navbar__cart-badge">{cartCount}</span>
            )}
          </Link>

          {/* Account */}
          <div
            className="navbar__dropdown navbar__account-dropdown"
            {...hoverOpen(setAccountOpen)}
          >
            <button
              className={`navbar__account-btn ${isAuthenticated ? "logged-in" : ""}`}
              aria-label="Account"
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/login");
                  setMenuOpen(false);
                } else if (isAdmin) {
                  navigate("/admin");
                  setAccountOpen(false);
                } else {
                  navigate("/account");
                  setAccountOpen(false);
                }
              }}
            >
              <span
                className={`material-symbols-outlined${isAuthenticated ? " icon--filled" : ""}`}
              >
                person
              </span>
              {isAuthenticated && <span className="navbar__account-dot" />}
            </button>
            {isAuthenticated && !isAdmin && (
              <div
                className={`navbar__dropdown-menu navbar__account-menu${accountOpen ? " open" : ""}`}
              >
                <div className="navbar__account-header">
                  <span className="navbar__account-name">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="navbar__account-email">{user.email}</span>
                </div>
                <Link
                  to="/account?tab=overview"
                  className="navbar__dropdown-item"
                >
                  <span className="material-symbols-outlined navbar__dropdown-icon">
                    dashboard
                  </span>
                  {t("nav.overview")}
                </Link>
                <Link
                  to="/account?tab=orders"
                  className="navbar__dropdown-item"
                >
                  <span className="material-symbols-outlined navbar__dropdown-icon">
                    receipt_long
                  </span>
                  {t("nav.my_orders")}
                </Link>
                <Link
                  to="/account?tab=wishlist"
                  className="navbar__dropdown-item"
                >
                  <span className="material-symbols-outlined navbar__dropdown-icon">
                    favorite
                  </span>
                  {t("nav.wishlist")}
                </Link>
                <Link
                  to="/account?tab=addresses"
                  className="navbar__dropdown-item"
                >
                  <span className="material-symbols-outlined navbar__dropdown-icon">
                    location_on
                  </span>
                  {t("nav.addresses")}
                </Link>
                <Link
                  to="/account?tab=profile"
                  className="navbar__dropdown-item"
                >
                  <span className="material-symbols-outlined navbar__dropdown-icon">
                    person
                  </span>
                  {t("nav.profile")}
                </Link>
                <button
                  className="navbar__dropdown-item navbar__dropdown-item--logout"
                  onClick={handleLogout}
                >
                  <span className="material-symbols-outlined navbar__dropdown-icon">
                    logout
                  </span>
                  {t("nav.sign_out")}
                </button>
              </div>
            )}
            {isAuthenticated && isAdmin && (
              <div
                className={`navbar__dropdown-menu navbar__account-menu${accountOpen ? " open" : ""}`}
              >
                <Link
                  to="/admin"
                  className="navbar__dropdown-item navbar__dropdown-item--admin"
                >
                  <span className="material-symbols-outlined navbar__dropdown-icon">
                    admin_panel_settings
                  </span>
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
