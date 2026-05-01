import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useMemo, useState } from 'react';
import { PRODUCTS } from '../../data/products';
import { StarRating } from './Products';
import './Season.css';

const SEASON_ORDER = ['winter', 'spring', 'summer', 'autumn'];

const SEASON_DATA = {
  winter: {
    title: 'Winter',
    subtitle: 'Embrace the Cold',
    desc: 'Crafted for the harshest elements. Rich, heavy leathers lined with warmth — pieces that shield you in style when the frost bites.',
    hero: '/assets/winter.jpg',
    icon: 'ac_unit',
    quote: '"In the depth of winter, I finally learned that within me there lay an invincible summer." — Albert Camus',
    effect: 'snow',
  },
  spring: {
    title: 'Spring',
    subtitle: 'Renewal in Leather',
    desc: 'Lighter silhouettes and softer hides. Our spring collection celebrates rebirth with supple nappa and airy designs that move with you.',
    hero: '/assets/spring.jpg',
    icon: 'local_florist',
    quote: '"Spring adds new life and new beauty to all that is." — Jessica Harrelson',
    effect: 'petals',
  },
  summer: {
    title: 'Summer',
    subtitle: 'Sun-Kissed Craft',
    desc: 'Perforated lambskin, breathable suede, coastal silhouettes. Summer demands leather that lives under open skies and golden light.',
    hero: '/assets/summer.jpg',
    icon: 'wb_sunny',
    quote: '"And so with the sunshine and the great bursts of leaves, I had that familiar conviction that life was beginning over again." — F. Scott Fitzgerald',
    effect: 'shimmer',
  },
  autumn: {
    title: 'Autumn',
    subtitle: 'The Harvest Edit',
    desc: 'Deep cognacs, rugged steerhide, heritage cuts. Autumn is where leather feels most at home — warm, earthy, and endlessly timeless.',
    hero: '/assets/fall.jpg',
    icon: 'eco',
    quote: '"Autumn is a second spring where every leaf is a flower." — Albert Camus',
    effect: 'leaves',
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ── SVG ── */

function Snowflake({ size = 12 }) {
  const r = size / 2;
  const arms = 6;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {Array.from({ length: arms }, (_, i) => {
        const angle = (i * 360) / arms;
        return (
          <line
            key={i}
            x1={r}
            y1={r}
            x2={r + r * 0.85 * Math.cos((angle * Math.PI) / 180)}
            y2={r + r * 0.85 * Math.sin((angle * Math.PI) / 180)}
            stroke="rgba(200,220,255,0.8)"
            strokeWidth={0.8}
            strokeLinecap="round"
          />
        );
      })}
      <circle cx={r} cy={r} r={1} fill="rgba(220,240,255,0.9)" />
    </svg>
  );
}

function Petal({ size = 18, color = 'rgba(255,180,200,0.7)' }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 20 28" fill="none">
      <path
        d="M10 0 C14 6, 18 12, 18 18 C18 24, 14 28, 10 28 C6 28, 2 24, 2 18 C2 12, 6 6, 10 0Z"
        fill={color}
      />
      <path
        d="M10 4 C10 4, 10 24, 10 24"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={0.5}
      />
    </svg>
  );
}

function Leaf({ size = 22, color = '#C47A3A' }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 24 30" fill="none">
      <path
        d="M12 0 C16 5, 22 10, 22 17 C22 24, 17 28, 12 30 C7 28, 2 24, 2 17 C2 10, 8 5, 12 0Z"
        fill={color}
        opacity={0.85}
      />
      <path d="M12 2 L12 28" stroke="rgba(0,0,0,0.2)" strokeWidth={0.6} />
      <path d="M12 10 L7 14" stroke="rgba(0,0,0,0.15)" strokeWidth={0.4} />
      <path d="M12 14 L17 18" stroke="rgba(0,0,0,0.15)" strokeWidth={0.4} />
      <path d="M12 18 L6 22" stroke="rgba(0,0,0,0.15)" strokeWidth={0.4} />
    </svg>
  );
}

/* ── Particle generator ── */

function genParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 6 + Math.random() * 8,
    size: 0.6 + Math.random() * 0.8,
    drift: -30 + Math.random() * 60,
    opacity: 0.2 + Math.random() * 0.5,
  }));
}

/* ── Seasonal Particle Components ── */

function SnowEffect() {
  const particles = useMemo(() => genParticles(35), []);
  return (
    <div className="season-fx" aria-hidden="true">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="season-fx__item"
          style={{ left: `${p.x}%`, scale: p.size }}
          initial={{ y: '-5vh', x: 0, opacity: 0 }}
          animate={{
            y: '105vh',
            x: [0, p.drift * 0.5, -p.drift * 0.3, p.drift * 0.4, 0],
            opacity: [0, p.opacity, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Snowflake size={10 + p.size * 8} />
        </motion.div>
      ))}
      <div className="season-fx__frost" />
    </div>
  );
}

function PetalEffect() {
  const particles = useMemo(() => genParticles(25), []);
  const colors = ['rgba(255,182,193,0.6)', 'rgba(255,200,210,0.5)', 'rgba(255,160,180,0.5)', 'rgba(255,220,225,0.45)'];
  return (
    <div className="season-fx" aria-hidden="true">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="season-fx__item"
          style={{ left: `${p.x}%`, scale: p.size }}
          initial={{ y: '-8vh', rotate: 0, opacity: 0 }}
          animate={{
            y: '108vh',
            x: [0, p.drift, -p.drift * 0.6, p.drift * 0.8, -p.drift * 0.3],
            rotate: [0, 120, 200, 300, 420],
            opacity: [0, p.opacity, p.opacity, p.opacity * 0.8, 0],
          }}
          transition={{
            duration: p.duration * 1.2,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Petal size={12 + p.size * 10} color={colors[p.id % colors.length]} />
        </motion.div>
      ))}
      <div className="season-fx__bloom season-fx__bloom--spring" />
    </div>
  );
}

function ShimmerEffect() {
  const rays = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: i * 45,
    delay: i * 0.4,
    width: 1 + Math.random() * 2,
  })), []);
  const motes = useMemo(() => genParticles(20), []);
  return (
    <div className="season-fx" aria-hidden="true">
      <div className="season-fx__rays">
        {rays.map(r => (
          <motion.div
            key={r.id}
            className="season-fx__ray"
            style={{
              transform: `rotate(${r.angle}deg)`,
              width: `${r.width}px`,
            }}
            animate={{ opacity: [0.02, 0.08, 0.02] }}
            transition={{ duration: 4, delay: r.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
      {motes.map(p => (
        <motion.div
          key={p.id}
          className="season-fx__mote"
          style={{ left: `${p.x}%`, top: `${20 + Math.random() * 60}%` }}
          animate={{
            y: [0, -20, 5, -15, 0],
            x: [0, p.drift * 0.3, -p.drift * 0.2, p.drift * 0.15, 0],
            opacity: [0, p.opacity * 0.6, p.opacity, p.opacity * 0.5, 0],
            scale: [0.5, 1, 0.8, 1.1, 0.5],
          }}
          transition={{
            duration: p.duration * 1.5,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      <div className="season-fx__bloom season-fx__bloom--summer" />
    </div>
  );
}

function LeavesEffect() {
  const particles = useMemo(() => genParticles(20), []);
  const leafColors = ['#C47A3A', '#A85D28', '#D4943C', '#8B5E34', '#B06830'];
  return (
    <div className="season-fx" aria-hidden="true">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="season-fx__item"
          style={{ left: `${p.x}%`, scale: p.size }}
          initial={{ y: '-10vh', rotateX: 0, rotateZ: 0, opacity: 0 }}
          animate={{
            y: '110vh',
            x: [0, p.drift, -p.drift * 0.7, p.drift * 0.5, -p.drift * 0.3],
            rotateZ: [0, 80, 170, 280, 380],
            rotateX: [0, 30, -20, 40, -10, 0],
            opacity: [0, p.opacity, p.opacity, p.opacity * 0.7, 0],
          }}
          transition={{
            duration: p.duration * 1.3,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Leaf
            size={14 + p.size * 12}
            color={leafColors[p.id % leafColors.length]}
          />
        </motion.div>
      ))}
      <div className="season-fx__bloom season-fx__bloom--autumn" />
    </div>
  );
}

function SeasonEffects({ effect }) {
  switch (effect) {
    case 'snow': return <SnowEffect />;
    case 'petals': return <PetalEffect />;
    case 'shimmer': return <ShimmerEffect />;
    case 'leaves': return <LeavesEffect />;
    default: return null;
  }
}

function SeasonNav({ current }) {
  const idx = SEASON_ORDER.indexOf(current);
  const prev = idx > 0 ? SEASON_ORDER[idx - 1] : null;
  const next = idx < SEASON_ORDER.length - 1 ? SEASON_ORDER[idx + 1] : null;
  return (
    <nav className="season-nav">
      {prev ? (
        <Link to={`/collection/${prev}`} className="season-nav__link season-nav__link--prev">
          <span className="material-symbols-outlined">arrow_back</span>
          <span>{SEASON_DATA[prev].title}</span>
        </Link>
      ) : <span />}
      <div className="season-nav__dots">
        {SEASON_ORDER.map(s => (
          <Link
            key={s}
            to={`/collection/${s}`}
            className={`season-nav__dot ${s === current ? 'active' : ''}`}
            aria-label={SEASON_DATA[s].title}
          />
        ))}
      </div>
      {next ? (
        <Link to={`/collection/${next}`} className="season-nav__link season-nav__link--next">
          <span>{SEASON_DATA[next].title}</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      ) : <span />}
    </nav>
  );
}

function Season({ seasonKey }) {
  const data = SEASON_DATA[seasonKey];
  const allProducts = useMemo(() => PRODUCTS.filter(p => p.season === seasonKey), [seasonKey]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [filterCat, setFilterCat] = useState('all');
  const [filterLeather, setFilterLeather] = useState('all');
  const [sort, setSort] = useState('featured');

  const categories = useMemo(() => ['all', ...new Set(allProducts.map(p => p.cat))], [allProducts]);
  const leathers = useMemo(() => ['all', ...new Set(allProducts.map(p => p.leather))], [allProducts]);

  const products = useMemo(() => {
    let result = allProducts;
    if (filterCat !== 'all') result = result.filter(p => p.cat === filterCat);
    if (filterLeather !== 'all') result = result.filter(p => p.leather === filterLeather);
    const sorted = [...result];
    switch (sort) {
      case 'price-asc': return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
      case 'rating': return sorted.sort((a, b) => b.rating - a.rating);
      case 'featured': default: return sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [allProducts, filterCat, filterLeather, sort]);

  return (
    <main className={`season-page season-page--${seasonKey}`} key={seasonKey}>
      {/* parallax */}
      <section className="season-hero" ref={heroRef}>
        <motion.div className="season-hero__bg" style={{ y: heroY }}>
          <img src={data.hero} alt={`${data.title} Collection`} />
        </motion.div>
        <div className="season-hero__overlay" />
        <SeasonEffects effect={data.effect} />
        <motion.div
          className="season-hero__content"
          style={{ opacity: heroOpacity }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="season-hero__icon material-symbols-outlined"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 150 }}
          >
            {data.icon}
          </motion.span>
          <motion.span
            className="label"
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {data.title} Collection
          </motion.span>
          <motion.h1
            className="season-hero__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {data.subtitle.split(' ').slice(0, -1).join(' ')}{' '}
            <em>{data.subtitle.split(' ').slice(-1)}</em>
          </motion.h1>
          <motion.p
            className="season-hero__desc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {data.desc}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link to="/products" className="btn btn--gradient">View All Products</Link>
          </motion.div>
        </motion.div>
      </section>

      <SeasonNav current={seasonKey} />

      <section className="section section--dark">
        <div className="container">
          <motion.h2
            className="section__title--center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {data.title} <em>Essentials</em>
          </motion.h2>
          <motion.div
            className="section__divider"
            initial={{ width: 0 }}
            whileInView={{ width: '3rem' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          <div className="season-filters">
            <div className="season-filters__group">
              <label>Category</label>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                {categories.map(c => (
                  <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="season-filters__group">
              <label>Leather</label>
              <select value={filterLeather} onChange={e => setFilterLeather(e.target.value)}>
                {leathers.map(l => (
                  <option key={l} value={l}>{l === 'all' ? 'All Leathers' : l.charAt(0).toUpperCase() + l.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="season-filters__group">
              <label>Sort by</label>
              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
            <span className="season-filters__count">{products.length} item{products.length !== 1 ? 's' : ''}</span>
          </div>

          <motion.div
            className="products products--season"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Link to={`/product/${p.slug}`} className="product-card">
                  <div className="product-card__img-wrap">
                    <img className="product-card__img" src={p.img} alt={p.name} loading="lazy" />
                    <span className="product-card__badge">{p.cat}</span>
                    {p.discount > 0 && <span className="product-card__discount">-{p.discount}%</span>}
                    {p.isFeatured && <span className="product-card__featured">Best Seller</span>}
                    <button className="product-card__cart" aria-label="Add to cart" onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                  </div>
                  <div className="product-card__meta">
                    <div>
                      <h3 className="product-card__name">{p.name}</h3>
                      <p className="product-card__material">{p.material}</p>
                      <StarRating rating={p.rating} count={p.reviewCount} />
                    </div>
                    <div className="product-card__pricing">
                      {p.originalPrice && <span className="product-card__original">${p.originalPrice.toLocaleString()}</span>}
                      <span className="product-card__price">${p.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="product-card__foot">
                    <span className={`stock ${p.stock === 0 ? 'stock--out' : p.stock <= 5 ? 'stock--low' : 'stock--in'}`}>
                      {p.stock === 0 ? 'Out of Stock' : p.stock <= 5 ? `Only ${p.stock} left` : 'In Stock'}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <motion.section
        className="quote section--elevated"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <motion.span
          className="material-symbols-outlined quote__icon"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          {data.icon}
        </motion.span>
        <motion.blockquote
          className="quote__text"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {data.quote}
        </motion.blockquote>
      </motion.section>
    </main>
  );
}

export function Winter()  { return <Season seasonKey="winter" />; }
export function Spring()  { return <Season seasonKey="spring" />; }
export function Summer()  { return <Season seasonKey="summer" />; }
export function Autumn()  { return <Season seasonKey="autumn" />; }
