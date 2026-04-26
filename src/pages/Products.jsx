import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Products.css';

const PRODUCTS = [
  { id: 1, name: 'The Aviator Jacket', cat: 'men', season: 'winter', leather: 'calfskin', price: 1250, material: 'Burnished Calfskin', img: '/assets/jacket.png' },
  { id: 2, name: 'The Minimalist Bifold', cat: 'wallets', season: 'spring', leather: 'nappa', price: 180, material: 'Full Grain Nappa', img: '/assets/wallet.png' },
  { id: 3, name: 'The Moto Heritage', cat: 'men', season: 'autumn', leather: 'steerhide', price: 950, material: 'Steerhide Leather', img: '/assets/jacket.png' },
  { id: 4, name: 'The Spring Tote', cat: 'women', season: 'spring', leather: 'nappa', price: 620, material: 'Soft Nappa Leather', img: '/assets/spring.png' },
  { id: 5, name: 'The Classic Zip Wallet', cat: 'wallets', season: 'autumn', leather: 'calfskin', price: 145, material: 'Burnished Calfskin', img: '/assets/wallet.png' },
  { id: 6, name: 'The Summer Gloves', cat: 'men', season: 'summer', leather: 'lambskin', price: 220, material: 'Perforated Lambskin', img: '/assets/summer.png' },
  { id: 7, name: 'The Explorer Backpack', cat: 'men', season: 'autumn', leather: 'steerhide', price: 890, material: 'Rugged Steerhide', img: '/assets/fall.png' },
  { id: 8, name: 'The Cognac Belt', cat: 'men', season: 'autumn', leather: 'calfskin', price: 165, material: 'Burnished Calfskin', img: '/assets/fall.png' },
  { id: 9, name: 'The Kids Bomber', cat: 'kids', season: 'winter', leather: 'lambskin', price: 420, material: 'Soft Lambskin', img: '/assets/jacket.png' },
  { id: 10, name: 'The Suede Weekender', cat: 'women', season: 'summer', leather: 'suede', price: 750, material: 'Italian Suede', img: '/assets/summer.png' },
  { id: 11, name: 'The Cardholder Slim', cat: 'wallets', season: 'spring', leather: 'nappa', price: 95, material: 'Full Grain Nappa', img: '/assets/wallet.png' },
  { id: 12, name: 'The Heritage Duffle', cat: 'men', season: 'winter', leather: 'steerhide', price: 1100, material: 'Steerhide Leather', img: '/assets/winter.png' },
  { id: 13, name: 'The Bespoke Messenger', cat: 'customize', season: 'spring', leather: 'calfskin', price: 980, material: 'Custom Calfskin', img: '/assets/custom.png' },
  { id: 14, name: 'The Kids Travel Wallet', cat: 'kids', season: 'summer', leather: 'nappa', price: 75, material: 'Soft Nappa', img: '/assets/wallet.png' },
  { id: 15, name: 'The Monogram Clutch', cat: 'customize', season: 'autumn', leather: 'lambskin', price: 540, material: 'Custom Lambskin', img: '/assets/custom.png' },
  { id: 16, name: 'The Riding Jacket', cat: 'women', season: 'autumn', leather: 'steerhide', price: 1180, material: 'Steerhide Leather', img: '/assets/jacket.png' },
  { id: 17, name: 'The Zip-Around Wallet', cat: 'wallets', season: 'winter', leather: 'calfskin', price: 210, material: 'Burnished Calfskin', img: '/assets/wallet.png' },
  { id: 18, name: 'The Kids Crossbody', cat: 'kids', season: 'spring', leather: 'suede', price: 145, material: 'Italian Suede', img: '/assets/spring.png' },
];

const FILTER_GROUPS = [
  {
    name: 'cat', title: 'Category',
    options: ['men', 'women', 'kids', 'wallets', 'customize'],
  },
  {
    name: 'season', title: 'Season',
    options: ['winter', 'spring', 'summer', 'autumn'],
  },
  {
    name: 'leather', title: 'Leather',
    options: ['calfskin', 'nappa', 'steerhide', 'lambskin', 'suede'],
  },
  {
    name: 'price', title: 'Price',
    options: ['0-200', '200-500', '500-1000', '1000+'],
    labels: { '0-200': 'Under $200', '200-500': '$200 – $500', '500-1000': '$500 – $1,000', '1000+': 'Over $1,000' },
  },
];

function matchesPrice(price, range) {
  if (range === '0-200') return price < 200;
  if (range === '200-500') return price >= 200 && price < 500;
  if (range === '500-1000') return price >= 500 && price < 1000;
  if (range === '1000+') return price >= 1000;
  return false;
}

function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const catParam = new URLSearchParams(location.search).get('cat');

  // filters: { cat: Set, season: Set, leather: Set, price: Set }
  const [filters, setFilters] = useState(() => {
    const init = {};
    FILTER_GROUPS.forEach(g => { init[g.name] = new Set(); });
    if (catParam) init['cat'] = new Set([catParam]);
    return init;
  });

  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync URL cat param into filter on route change
  useEffect(() => {
    setFilters(prev => {
      const next = { ...prev };
      FILTER_GROUPS.forEach(g => { next[g.name] = new Set(); });
      if (catParam) next['cat'] = new Set([catParam]);
      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catParam]);

  function toggleFilter(group, value) {
    setFilters(prev => {
      const set = new Set(prev[group]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...prev, [group]: set };
    });
  }

  function removeTag(group, value) {
    setFilters(prev => {
      const set = new Set(prev[group]);
      set.delete(value);
      return { ...prev, [group]: set };
    });
  }

  function reset() {
    const cleared = {};
    FILTER_GROUPS.forEach(g => { cleared[g.name] = new Set(); });
    setFilters(cleared);
    setSearch('');
    navigate('/products');
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PRODUCTS.filter(p => {
      if (q && !p.name.toLowerCase().includes(q) && !p.material.toLowerCase().includes(q)) return false;
      for (const g of FILTER_GROUPS) {
        const active = filters[g.name];
        if (active.size === 0) continue;
        if (g.name === 'price') {
          if (![...active].some(r => matchesPrice(p.price, r))) return false;
        } else {
          if (!active.has(p[g.name])) return false;
        }
      }
      return true;
    });
  }, [filters, search]);

  // Build active tags list
  const activeTags = [];
  FILTER_GROUPS.forEach(g => {
    filters[g.name].forEach(v => {
      const label = g.labels ? g.labels[v] : v;
      activeTags.push({ group: g.name, value: v, label });
    });
  });
  if (search.trim()) {
    activeTags.push({ group: '_search', value: search, label: `"${search}"` });
  }

  return (
    <main>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero__bg">
          <img src="/assets/leather.png" alt="Leather texture" />
        </div>
        <div className="page-hero__content">
          <span className="label">Our Collection</span>
          <h1 className="page-hero__title">All <em>Products</em></h1>
        </div>
      </section>

      {/* Toolbar */}
      <section className="toolbar">
        <div className="container">
          <div className="toolbar__inner">
            <div className="toolbar__search">
              <span className="material-symbols-outlined toolbar__search-icon">search</span>
              <input
                type="text"
                className="toolbar__input"
                placeholder="Search leather goods..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="toolbar__meta">
              <span className="toolbar__count">
                {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              </span>
              <button className="toolbar__reset" onClick={reset}>
                <span className="material-symbols-outlined">filter_list_off</span>
                Clear
              </button>
            </div>
          </div>

          {activeTags.length > 0 && (
            <div className="toolbar__tags">
              {activeTags.map(({ group, value, label }) => (
                <button
                  key={`${group}-${value}`}
                  className="tag"
                  onClick={() => group === '_search' ? setSearch('') : removeTag(group, value)}
                >
                  {label}
                  <span className="material-symbols-outlined tag__x">close</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Catalog */}
      <section className="section section--dark">
        <div className="container">
          <div className="catalog">
            {/* Sidebar */}
            <aside className={`filters${sidebarOpen ? ' open' : ''}`}>
              <button className="filters__close" onClick={() => setSidebarOpen(false)} aria-label="Close filters">
                <span className="material-symbols-outlined">close</span>
              </button>

              {FILTER_GROUPS.map(group => (
                <div className="filter-group" key={group.name}>
                  <h3 className="filter-group__title">{group.title}</h3>
                  <div className="filter-group__options">
                    {group.options.map(opt => (
                      <label className="filter-opt" key={opt}>
                        <input
                          type="checkbox"
                          checked={filters[group.name].has(opt)}
                          onChange={() => toggleFilter(group.name, opt)}
                        />
                        <span>{group.labels ? group.labels[opt] : opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </aside>

            {/* Main grid */}
            <div className="catalog__main">
              <button className="catalog__filter-btn" onClick={() => setSidebarOpen(true)}>
                <span className="material-symbols-outlined">tune</span>
                Filters
              </button>

              {filtered.length === 0 ? (
                <div className="catalog__empty">
                  <span className="material-symbols-outlined catalog__empty-icon">search_off</span>
                  <p className="catalog__empty-text">No products match your filters.</p>
                  <button className="btn btn--solid" onClick={reset}>Clear Filters</button>
                </div>
              ) : (
                <div className="products products--catalog">
                  {filtered.map(p => (
                    <div className="product-card" key={p.id}>
                      <div className="product-card__img-wrap">
                        <img className="product-card__img" src={p.img} alt={p.name} />
                        <span className="product-card__badge">{p.cat}</span>
                        <button className="product-card__cart" aria-label="Add to cart">
                          <span className="material-symbols-outlined">add_shopping_cart</span>
                        </button>
                      </div>
                      <div className="product-card__meta">
                        <div>
                          <h3 className="product-card__name">{p.name}</h3>
                          <p className="product-card__material">{p.material}</p>
                        </div>
                        <span className="product-card__price">${p.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Products;
