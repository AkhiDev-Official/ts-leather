import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { useTranslation } from "react-i18next";
import "./Products.css";

const SORT_VALUES = ["featured", "newest", "price-asc", "price-desc", "rating", "bestselling"];

function sortProducts(products, sortBy) {
  const s = [...products];
  switch (sortBy) {
    case "price-asc":
      return s.sort((a, b) => a.price - b.price);
    case "price-desc":
      return s.sort((a, b) => b.price - a.price);
    case "rating":
      return s.sort((a, b) => b.rating - a.rating);
    case "bestselling":
      return s.sort((a, b) => b.soldCount - a.soldCount);
    case "newest":
      return s.sort((a, b) => b.id - a.id);
    case "featured":
    default:
      return s.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }
}

export function StarRating({ rating, count, size = "sm" }) {
  const pct = (rating / 5) * 100;
  return (
    <div className={`star-rating star-rating--${size}`}>
      <div className="star-rating__stars">
        <div className="star-rating__empty">★★★★★</div>
        <div className="star-rating__filled" style={{ width: `${pct}%` }}>
          ★★★★★
        </div>
      </div>
      {count != null && <span className="star-rating__count">({count})</span>}
    </div>
  );
}

const FILTER_GROUPS = [
  {
    name: "cat",
    title: "Category",
    options: ["men", "women", "kids", "wallets", "customize"],
  },
  {
    name: "season",
    title: "Season",
    options: ["winter", "spring", "summer", "autumn"],
  },
  {
    name: "leather",
    title: "Leather",
    options: ["calfskin", "nappa", "steerhide", "lambskin", "suede"],
  },
  {
    name: "price",
    title: "Price",
    options: ["0-200", "200-500", "500-1000", "1000+"],
    labels: {
      "0-200": "Under $200",
      "200-500": "$200 – $500",
      "500-1000": "$500 – $1,000",
      "1000+": "Over $1,000",
    },
  },
];

function matchesPrice(price, range) {
  if (range === "0-200") return price < 200;
  if (range === "200-500") return price >= 200 && price < 500;
  if (range === "500-1000") return price >= 500 && price < 1000;
  if (range === "1000+") return price >= 1000;
  return false;
}

function Products() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const catParam = new URLSearchParams(location.search).get("cat");

  const products = useSelector((s) => s.products.list);
  const dispatch = useDispatch();

  const [filters, setFilters] = useState(() => {
    const init = {};
    FILTER_GROUPS.forEach((g) => {
      init[g.name] = new Set();
    });
    if (catParam) init["cat"] = new Set([catParam]);
    return init;
  });

  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    setFilters((prev) => {
      const next = { ...prev };
      FILTER_GROUPS.forEach((g) => {
        next[g.name] = new Set();
      });
      if (catParam) next["cat"] = new Set([catParam]);
      return next;
    });
  }, [catParam]);

  function toggleFilter(group, value) {
    setFilters((prev) => {
      const set = new Set(prev[group]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...prev, [group]: set };
    });
  }

  function removeTag(group, value) {
    setFilters((prev) => {
      const set = new Set(prev[group]);
      set.delete(value);
      return { ...prev, [group]: set };
    });
  }

  function reset() {
    const cleared = {};
    FILTER_GROUPS.forEach((g) => {
      cleared[g.name] = new Set();
    });
    setFilters(cleared);
    setSearch("");
    navigate("/products");
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = products.filter((p) => {
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.material.toLowerCase().includes(q)
      )
        return false;
      for (const g of FILTER_GROUPS) {
        const active = filters[g.name];
        if (active.size === 0) continue;
        if (g.name === "price") {
          if (![...active].some((r) => matchesPrice(p.price, r))) return false;
        } else {
          if (!active.has(p[g.name])) return false;
        }
      }
      return true;
    });
    return sortProducts(result, sort);
  }, [filters, search, sort, products]);

  const activeTags = [];
  FILTER_GROUPS.forEach((g) => {
    filters[g.name].forEach((v) => {
      const label =
        g.name === "price" ? t(`products.price_${v}`) :
        (g.name === "cat" || g.name === "season") ? t(`nav.${v}`) :
        v.charAt(0).toUpperCase() + v.slice(1);
      activeTags.push({ group: g.name, value: v, label });
    });
  });
  if (search.trim()) {
    activeTags.push({ group: "_search", value: search, label: `"${search}"` });
  }

  return (
    <main>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero__bg">
          <img src="/assets/leather.jpg" alt="Leather texture" />
        </div>
        <div className="page-hero__content">
          <span className="label">{t('products.collection_label')}</span>
          <h1 className="page-hero__title">
            <em>{t('products.title')}</em>
          </h1>
        </div>
      </section>

      {/* Toolbar */}
      <section className="toolbar">
        <div className="container">
          <div className="toolbar__inner">
            <div className="toolbar__search">
              <span className="material-symbols-outlined toolbar__search-icon">
                search
              </span>
              <input
                type="text"
                className="toolbar__input"
                placeholder={t('products.search_placeholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="toolbar__meta">
              <span className="toolbar__count">
                {t('products.count', { count: filtered.length })}
              </span>
              <select
                className="toolbar__sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORT_VALUES.map((v) => (
                  <option key={v} value={v}>
                    {t('products.sort_' + v.replace(/-/g, '_'))}
                  </option>
                ))}
              </select>
              <button className="toolbar__reset" onClick={reset}>
                <span className="material-symbols-outlined">
                  filter_list_off
                </span>
                {t('products.clear')}
              </button>
            </div>
          </div>

          {activeTags.length > 0 && (
            <div className="toolbar__tags">
              {activeTags.map(({ group, value, label }) => (
                <button
                  key={`${group}-${value}`}
                  className="tag"
                  onClick={() =>
                    group === "_search"
                      ? setSearch("")
                      : removeTag(group, value)
                  }
                >
                  {label}
                  <span className="material-symbols-outlined tag__x">
                    close
                  </span>
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
            <aside className={`filters${sidebarOpen ? " open" : ""}`}>
              <button
                className="filters__close"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close filters"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              {FILTER_GROUPS.map((group) => (
                <div className="filter-group" key={group.name}>
                  <h3 className="filter-group__title">{t('products.filter_' + group.name)}</h3>
                  <div className="filter-group__options">
                    {group.options.map((opt) => (
                      <label className="filter-opt" key={opt}>
                        <input
                          type="checkbox"
                          checked={filters[group.name].has(opt)}
                          onChange={() => toggleFilter(group.name, opt)}
                        />
                        <span>
                          {group.name === "price" ? t(`products.price_${opt}`) :
                           (group.name === "cat" || group.name === "season") ? t(`nav.${opt}`) :
                           opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </aside>

            {/* Main grid */}
            <div className="catalog__main">
              <button
                className="catalog__filter-btn"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="material-symbols-outlined">tune</span>
                {t('products.filters')}
              </button>

              {filtered.length === 0 ? (
                <div className="catalog__empty">
                  <span className="material-symbols-outlined catalog__empty-icon">
                    search_off
                  </span>
                  <p className="catalog__empty-text">
                    {t('products.no_results')}
                  </p>
                  <button className="btn btn--solid" onClick={reset}>
                    {t('products.clear_filters')}
                  </button>
                </div>
              ) : (
                <div className="products products--catalog">
                  {filtered.map((p) => (
                    <Link
                      to={`/product/${p.slug}`}
                      className="product-card"
                      key={p.id}
                    >
                      <div className="product-card__img-wrap">
                        <img
                          className="product-card__img"
                          src={p.img}
                          alt={p.name}
                          loading="lazy"
                        />
                        <span className="product-card__badge">{p.cat}</span>
                        {p.discount > 0 && (
                          <span className="product-card__discount">
                            -{p.discount}%
                          </span>
                        )}
                        {p.isFeatured && (
                          <span className="product-card__featured">
                            {t('products.best_seller')}
                          </span>
                        )}
                        <button
                          className="product-card__cart"
                          aria-label={t('home.add_to_cart')}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            dispatch(
                              addToCart({
                                product_id: p.id,
                                product_variant_id: `${p.id}-default`,
                                product_name: p.name,
                                quantity: 1,
                                unit_price: p.price,
                                currency: "EUR",
                              }),
                            );
                          }}
                        >
                          <span className="material-symbols-outlined">
                            add_shopping_cart
                          </span>
                        </button>
                      </div>
                      <div className="product-card__meta">
                        <div>
                          <h3 className="product-card__name">{p.name}</h3>
                          <p className="product-card__material">{p.material}</p>
                          <StarRating rating={p.rating} count={p.reviewCount} />
                        </div>
                        <div className="product-card__pricing">
                          {p.originalPrice && (
                            <span className="product-card__original">
                              ${p.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span className="product-card__price">
                            ${p.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="product-card__foot">
                        <span
                          className={`stock ${p.stock === 0 ? "stock--out" : p.stock <= 5 ? "stock--low" : "stock--in"}`}
                        >
                          {p.stock === 0
                            ? t('products.out_of_stock')
                            : p.stock <= 5
                              ? t('products.only_left', { count: p.stock })
                              : t('products.in_stock')}
                        </span>
                        {p.isCustomizable && (
                          <span className="product-card__custom">
                            {t('products.customizable')}
                          </span>
                        )}
                      </div>
                    </Link>
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
