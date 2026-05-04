import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Home.css';

const SEASONS = [
  { partKey: 'home.season_part_1', nameKey: 'home.season_winter', slug: 'winter', img: '/assets/winter.jpg' },
  { partKey: 'home.season_part_2', nameKey: 'home.season_spring', slug: 'spring', img: '/assets/spring.jpg' },
  { partKey: 'home.season_part_3', nameKey: 'home.season_summer', slug: 'summer', img: '/assets/summer.jpg' },
  { partKey: 'home.season_part_4', nameKey: 'home.season_autumn', slug: 'autumn', img: '/assets/fall.jpg' },
];

const ESSENTIALS = [
  { name: 'The Aviator Jacket', slug: 'the-aviator-jacket', material: 'Burnished Calfskin', price: '$1,250', img: '/assets/jacket.jpg' },
  { name: 'The Minimalist Bifold', slug: 'the-minimalist-bifold', material: 'Full Grain Nappa', price: '$180', img: '/assets/wallet.png' },
  { name: 'The Moto Heritage', slug: 'the-moto-heritage', material: 'Steerhide Leather', price: '$950', img: '/assets/jacket.jpg' },
];

const STEP_KEYS = ['home.step_1', 'home.step_2', 'home.step_3'];

function Home() {
  const { t } = useTranslation();
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg">
          <img src="/assets/jacket_main_full.jpg" alt="Signature Leather Jacket" />
        </div>
        <div className="hero__content">
          <span className="label">{t('home.hero_label')}</span>
          <h1 className="hero__title">
            {t('home.hero_title_1')}<br /><em>{t('home.hero_title_2')}</em>
          </h1>
          <Link to="/products" className="btn btn--gradient">{t('home.hero_cta')}</Link>
        </div>
        <div className="hero__stamp">{t('home.hero_stamp')}</div>
      </section>

      {/* Seasonal Collections */}
      <section className="section section--dark">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">
              {t('home.seasons_title_1')}<br /><em>{t('home.seasons_title_2')}</em>
            </h2>
            <p className="section__desc">{t('home.seasons_desc')}</p>
          </div>
          <div className="seasons">
            {SEASONS.map(({ partKey, nameKey, slug, img }) => (
              <Link to={`/collection/${slug}`} className="season-card" key={slug}>
                <img className="season-card__img" src={img} alt={`${t(nameKey)} Collection`} />
                <div className="season-card__overlay" />
                <div className="season-card__info">
                  <span className="season-card__part">{t(partKey)}</span>
                  <h3 className="season-card__name">{t(nameKey)}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Iconic Essentials */}
      <section className="section section--deep">
        <div className="container">
          <h2 className="section__title--center">{t('home.essentials_title_1')} <em>{t('home.essentials_title_2')}</em></h2>
          <div className="section__divider" />
          <div className="products">
            {ESSENTIALS.map(({ name, slug, material, price, img }) => (
              <Link to={`/product/${slug}`} className="product-card" key={name}>
                <div className="product-card__img-wrap">
                  <img className="product-card__img" src={img} alt={name} />
                  <button className="product-card__cart" aria-label={t('home.add_to_cart')} onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
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
              <span className="label">{t('home.custom_label')}</span>
              <h2 className="section__title">
                {t('home.custom_title_1')}<br /><em>{t('home.custom_title_2')}</em>
              </h2>
              <p className="custom__text">{t('home.custom_text')}</p>
              <div className="steps">
                {STEP_KEYS.map((key, i) => (
                  <div className="step" key={i}>
                    <div className="step__number">{String(i + 1).padStart(2, '0')}</div>
                    <span className="step__text">{t(key)}</span>
                  </div>
                ))}
              </div>
              <Link to="/customize/the-bespoke-messenger" className="btn btn--solid">{t('home.custom_cta')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Quote */}
      <section className="quote section--elevated">
        <span className="material-symbols-outlined quote__icon">format_quote</span>
        <blockquote className="quote__text">{t('home.quote_text')}</blockquote>
        <p className="quote__author">{t('home.quote_author')}</p>
      </section>
    </main>
  );
}

export default Home;
