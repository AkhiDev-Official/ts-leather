import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { StarRating } from '../Products';
import { addToCart } from '../../../store/slices/cartSlice';
import { setProduct, clearProduct } from '../../../store/slices/productSlice';
import { useAuth } from '../../../components/AuthContext';
import './ProductDetail.css';

const REVIEWER_NAMES = ['Marie D.', 'Thomas L.', 'Sophie M.', 'Antoine R.', 'Camille B.', 'Hugo P.', 'Emma V.', 'Lucas G.', 'Léa F.', 'Nathan C.', 'Chloé K.', 'Maxime J.'];
const REVIEW_TEXTS = [
  'Exceptional quality. The leather is incredibly soft and the stitching is flawless.',
  'Beautiful craftsmanship. Looks even better in person than in the photos.',
  'Perfect fit and stunning design. Worth every euro invested.',
  'The quality of the leather is outstanding. You can truly feel the premium.',
  'Bought this as a gift and they absolutely loved it. Premium packaging too.',
  'Five years later and it still looks brand new. A true investment piece.',
  'The color is rich and deep. Patina is developing beautifully over time.',
  'Incredible attention to detail. The edge painting is perfection.',
  'Comfortable from day one, no break-in period needed. Highly recommend.',
  'Second purchase from TS Fashion. Never disappointed with the quality.',
  'The leather smell alone is worth it. Genuine artisan craftsmanship.',
  'Received so many compliments already. Feels luxurious and looks timeless.',
];

function generateReviews(productId, count) {
  const seed = productId * 17;
  return Array.from({ length: Math.min(count, 8) }, (_, i) => ({
    id: `r-${productId}-${i}`,
    name: REVIEWER_NAMES[(seed + i * 7) % REVIEWER_NAMES.length],
    rating: Math.min(5, Math.max(3, Math.round(3.8 + ((seed + i * 13) % 12) / 10))),
    comment: REVIEW_TEXTS[(seed + i * 3) % REVIEW_TEXTS.length],
    date: new Date(2026, 3, 1 - i * 18 - ((seed + i) % 25)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    verified: (seed + i) % 3 !== 0,
  }));
}

function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.slug === slug);

  const [mainImg, setMainImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('description');

  const reviews = useMemo(
    () => (product ? generateReviews(product.id, product.reviewCount) : []),
    [product]
  );

  useEffect(() => {
    setProduct(product);
    return () => clearProduct();
  }, [product]);

  if (!product) {
    return (
      <main className="pd">
        <div className="container pd__not-found">
          <span className="material-symbols-outlined" style={{ fontSize: '3rem', opacity: 0.3 }}>search_off</span>
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn btn--solid">Back to Products</Link>
        </div>
      </main>
    );
  }

  const images = product.images || [product.img];
  const outOfStock = product.stock === 0;

  return (
    <main className="pd">
      <nav className="pd__breadcrumb container">
        <Link to="/">Home</Link>
        <span className="material-symbols-outlined">chevron_right</span>
        <Link to="/products">Products</Link>
        <span className="material-symbols-outlined">chevron_right</span>
        <span className="pd__breadcrumb-current">{product.name}</span>
      </nav>

      {/* Product Hero */}
      <section className="pd__hero container">
        {/* Gallery */}
        <div className="pd__gallery">
          <div className="pd__thumbs">
            {images.map((src, i) => (
              <button
                key={i}
                className={`pd__thumb ${i === mainImg ? 'active' : ''}`}
                onClick={() => setMainImg(i)}
              >
                <img src={src} alt={`${product.name} view ${i + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
          <div className="pd__main-img">
            <img src={images[mainImg]} alt={product.name} />
            {product.discount > 0 && <span className="pd__sale-badge">-{product.discount}%</span>}
            {product.isFeatured && <span className="pd__featured-badge">Best Seller</span>}
          </div>
        </div>

        {/* Info */}
        <div className="pd__info">
          <span className="pd__cat">{product.cat} · {product.season} collection</span>
          <h1 className="pd__name">{product.name}</h1>
          <div className="pd__rating-row">
            <StarRating rating={product.rating} count={product.reviewCount} size="md" />
            <span className="pd__sold">{product.soldCount} sold</span>
          </div>
          <p className="pd__short-desc">{product.shortDesc}</p>

          {/* Price */}
          <div className="pd__price-block">
            {product.originalPrice && (
              <span className="pd__original-price">${product.originalPrice.toLocaleString()}</span>
            )}
            <span className="pd__price">${product.price.toLocaleString()}</span>
            {product.discount > 0 && (
              <span className="pd__save">Save {product.discount}%</span>
            )}
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="pd__option-group">
              <label className="pd__option-label">
                Color: <strong>{selectedColor || product.color}</strong>
              </label>
              <div className="pd__colors">
                {product.colors.map(c => (
                  <button
                    key={c}
                    className={`pd__color-btn ${(selectedColor || product.color) === c ? 'active' : ''}`}
                    onClick={() => setSelectedColor(c)}
                    title={c}
                  >
                    <span className="pd__color-swatch" data-color={c.toLowerCase().replace(/\s/g, '-')} />
                    <span className="pd__color-name">{c}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'One Size' && (
            <div className="pd__option-group">
              <label className="pd__option-label">Size:</label>
              <div className="pd__sizes">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    className={`pd__size-btn ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Cart */}
          <div className="pd__actions">
            <div className="pd__qty">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={outOfStock}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} disabled={outOfStock}>+</button>
            </div>
            <button
              className={`btn btn--gradient pd__add-cart ${outOfStock ? 'disabled' : ''}`}
              disabled={outOfStock}
              onClick={() => {
                if (outOfStock) return;
                dispatch(addToCart({
                  product_id: product.id,
                  product_variant_id: `${product.id}-${(selectedColor || product.color).toLowerCase().replace(/\s/g, '-')}-${(selectedSize || product.sizes?.[0] || 'os').toLowerCase()}`,
                  product_name: product.name,
                  quantity,
                  unit_price: product.price,
                  currency: 'EUR',
                  customization_summary: null,
                }));
              }}
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              {outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              className="pd__wishlist"
              aria-label="Add to wishlist"
              onClick={() => toggleWishlist(product.slug)}
            >
              <span className="material-symbols-outlined">
                {wishlist.includes(product.slug) ? 'favorite' : 'favorite_border'}
              </span>
            </button>
          </div>

          {/* Customize CTA */}
          {product.isCustomizable && (
            <Link to={`/customize/${product.slug}`} className="btn btn--solid pd__customize-cta">
              <span className="material-symbols-outlined">brush</span>
              Customize This Product
            </Link>
          )}

          {/* Stock */}
          <div className="pd__stock-row">
            {outOfStock ? (
              <span className="stock stock--out">Currently out of stock</span>
            ) : product.stock <= 5 ? (
              <span className="stock stock--low">⚡ Only {product.stock} left — order soon</span>
            ) : (
              <span className="stock stock--in">✓ In stock — ready to ship</span>
            )}
          </div>

          {/* Quick details */}
          <div className="pd__quick-details">
            <div className="pd__detail-item">
              <span className="material-symbols-outlined">palette</span>
              <span>Leather: {product.material}</span>
            </div>
            <div className="pd__detail-item">
              <span className="material-symbols-outlined">local_shipping</span>
              <span>Free shipping over $500</span>
            </div>
            <div className="pd__detail-item">
              <span className="material-symbols-outlined">undo</span>
              <span>30-day returns</span>
            </div>
            {product.isCustomizable && (
              <div className="pd__detail-item pd__detail-item--accent">
                <span className="material-symbols-outlined">brush</span>
                <span>Customizable — make it yours</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tabs: Description, Care, Reviews */}
      <section className="pd__tabs-section container">
        <div className="pd__tab-bar">
          <button className={`pd__tab ${tab === 'description' ? 'active' : ''}`} onClick={() => setTab('description')}>Description</button>
          <button className={`pd__tab ${tab === 'care' ? 'active' : ''}`} onClick={() => setTab('care')}>Care Instructions</button>
          <button className={`pd__tab ${tab === 'reviews' ? 'active' : ''}`} onClick={() => setTab('reviews')}>
            Reviews ({product.reviewCount})
          </button>
        </div>

        <div className="pd__tab-content">
          {tab === 'description' && (
            <div className="pd__description">
              <p>{product.description}</p>
              <ul className="pd__specs">
                <li><strong>Material:</strong> {product.material}</li>
                <li><strong>Leather Type:</strong> {product.leather}</li>
                <li><strong>Color:</strong> {product.color}</li>
                <li><strong>Season:</strong> {product.season.charAt(0).toUpperCase() + product.season.slice(1)} Collection</li>
                {product.isCustomizable && <li><strong>Customization:</strong> Available — monogram, color, hardware</li>}
              </ul>
            </div>
          )}

          {tab === 'care' && (
            <div className="pd__care">
              <p>{product.careInstructions}</p>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="pd__reviews">
              <div className="pd__reviews-summary">
                <div className="pd__reviews-avg">
                  <span className="pd__reviews-big">{product.rating}</span>
                  <div>
                    <StarRating rating={product.rating} size="lg" />
                    <span className="pd__reviews-total">{product.reviewCount} reviews</span>
                  </div>
                </div>
              </div>
              <div className="pd__reviews-list">
                {reviews.map(r => (
                  <div className="pd__review" key={r.id}>
                    <div className="pd__review-header">
                      <div>
                        <strong className="pd__review-name">{r.name}</strong>
                        {r.verified && <span className="pd__review-verified">✓ Verified Purchase</span>}
                      </div>
                      <span className="pd__review-date">{r.date}</span>
                    </div>
                    <StarRating rating={r.rating} size="sm" />
                    <p className="pd__review-text">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      <section className="section section--dark">
        <div className="container">
          <h2 className="section__title--center">You May Also <em>Like</em></h2>
          <div className="section__divider" />
          <div className="products products--catalog" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {products
              .filter(p => p.season === product.season && p.id !== product.id)
              .slice(0, 3)
              .map(p => (
                <Link to={`/product/${p.slug}`} className="product-card" key={p.id}>
                  <div className="product-card__img-wrap">
                    <img className="product-card__img" src={p.img} alt={p.name} loading="lazy" />
                    <span className="product-card__badge">{p.cat}</span>
                    {p.discount > 0 && <span className="product-card__discount">-{p.discount}%</span>}
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
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetail;
