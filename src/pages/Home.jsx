import { Link } from 'react-router-dom';
import './Home.css';

const SEASONS = [
  { part: 'Part I', name: 'Winter', slug: 'winter', img: '/assets/winter.jpg' },
  { part: 'Part II', name: 'Spring', slug: 'spring', img: '/assets/spring.jpg' },
  { part: 'Part III', name: 'Summer', slug: 'summer', img: '/assets/summer.jpg' },
  { part: 'Part IV', name: 'Autumn', slug: 'autumn', img: '/assets/fall.jpg' },
];

const ESSENTIALS = [
  { name: 'The Aviator Jacket', slug: 'the-aviator-jacket', material: 'Burnished Calfskin', price: '$1,250', img: '/assets/jacket.jpg' },
  { name: 'The Minimalist Bifold', slug: 'the-minimalist-bifold', material: 'Full Grain Nappa', price: '$180', img: '/assets/wallet.png' },
  { name: 'The Moto Heritage', slug: 'the-moto-heritage', material: 'Steerhide Leather', price: '$950', img: '/assets/jacket.jpg' },
];

const STEPS = [
  { num: '01', text: 'Select your preferred leather type and color.' },
  { num: '02', text: 'Configure your custom options and details.' },
  { num: '03', text: 'Artisan craftsmanship brings your vision to life.' },
];

function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg">
          <img src="/assets/jacket_main_full.jpg" alt="Signature Leather Jacket" />
        </div>
        <div className="hero__content">
          <span className="label">TS Fashion Original Leather</span>
          <h1 className="hero__title">
            Precision in<br /><em>Every Stitch</em>
          </h1>
          <Link to="/products" className="btn btn--gradient">Shop The Collection</Link>
        </div>
        <div className="hero__stamp">Established XXXX — Tremblay, France</div>
      </section>

      {/* Seasonal Collections */}
      <section className="section section--dark">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">
              Seasonal<br /><em>Collections</em>
            </h2>
            <p className="section__desc">
              From timeless classics to contemporary designs, our collections elevate your style
              and provide lasting quality.
            </p>
          </div>
          <div className="seasons">
            {SEASONS.map(({ part, name, slug, img }) => (
              <Link to={`/collection/${slug}`} className="season-card" key={name}>
                <img className="season-card__img" src={img} alt={`${name} Collection`} />
                <div className="season-card__overlay" />
                <div className="season-card__info">
                  <span className="season-card__part">{part}</span>
                  <h3 className="season-card__name">{name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Iconic Essentials */}
      <section className="section section--deep">
        <div className="container">
          <h2 className="section__title--center">Iconic <em>Essentials</em></h2>
          <div className="section__divider" />
          <div className="products">
            {ESSENTIALS.map(({ name, slug, material, price, img }) => (
              <Link to={`/product/${slug}`} className="product-card" key={name}>
                <div className="product-card__img-wrap">
                  <img className="product-card__img" src={img} alt={name} />
                  <button className="product-card__cart" aria-label="Add to cart" onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                  </button>
                </div>
                <div className="product-card__meta">
                  <div>
                    <h3 className="product-card__name">{name}</h3>
                    <p className="product-card__material">{material}</p>
                  </div>
                  <span className="product-card__price">{price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Art of Customization */}
      <section className="section section--dark">
        <div className="container">
          <div className="custom">
            <div className="custom__visual">
              <div className="custom__corner corner--top" />
              <img className="custom__img" src="/assets/custom.jpg" alt="Artisan crafting leather" />
              <div className="custom__corner corner--bottom" />
            </div>
            <div className="custom__content">
              <span className="label">Crafted For You</span>
              <h2 className="section__title">
                The Art of<br /><em>Customization</em>
              </h2>
              <p className="custom__text">
                Experience bespoke leather goods crafted by skilled artisans. From monogramming to full custom designs,
                we bring your vision to life with precision and craftsmanship.
              </p>
              <div className="steps">
                {STEPS.map(({ num, text }) => (
                  <div className="step" key={num}>
                    <div className="step__number">{num}</div>
                    <span className="step__text">{text}</span>
                  </div>
                ))}
              </div>
              <Link to="/customize/the-bespoke-messenger" className="btn btn--solid">Begin Your Design</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Quote */}
      <section className="quote section--elevated">
        <span className="material-symbols-outlined quote__icon">format_quote</span>
        <blockquote className="quote__text">
          "Luxury is not about consumption. It is about the preservation of craft and the story of the maker."
        </blockquote>
        <p className="quote__author">Tahir &amp; Sheila — Founder &amp; CEO</p>
      </section>
    </main>
  );
}

export default Home;
