import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Men', cat: 'men' },
  { label: 'Women', cat: 'women' },
  { label: 'Kids', cat: 'kids' },
  { label: 'Wallets', cat: 'wallets' },
  { label: 'Customize', cat: 'customize' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentCat = new URLSearchParams(location.search).get('cat');

  function handleCatClick(cat) {
    setMenuOpen(false);
    navigate(`/products?cat=${cat}`);
  }

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <button
          className={`navbar__burger${menuOpen ? ' open' : ''}`}
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <Link to="/" className="navbar__logo">
          <img src="/assets/logo_new.jpg" alt="TS Leather Logo" />
        </Link>

        <div className={`navbar__links${menuOpen ? ' open' : ''}`}>
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
        </div>

        <div className="navbar__actions">
          <button aria-label="Cart">
            <span className="material-symbols-outlined">shopping_cart</span>
          </button>
          <button aria-label="Account">
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
