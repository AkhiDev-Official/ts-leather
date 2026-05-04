import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeCartItem, updateCartItem, clearCart } from '../store/slices/cartSlice';
import './Cart.css';

function formatCurrency(n) {
  return '€' + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 15;

function CartItem({ item }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  function setQty(qty) {
    if (qty < 1) return;
    dispatch(updateCartItem({ id: item.id, changes: { quantity: qty } }));
  }

  return (
    <div className="cart-item">
      <div className="cart-item__img-wrap">
        {item.image
          ? <img src={item.image} alt={item.product_name} loading="lazy" />
          : <div className="cart-item__img-placeholder">
              <span className="material-symbols-outlined">shopping_bag</span>
            </div>
        }
      </div>

      <div className="cart-item__body">
        <div className="cart-item__top">
          <div>
            <h3 className="cart-item__name">{item.product_name}</h3>
            <div className="cart-item__meta">
              {item.color && <span>{t('cart.color')}: {item.color}</span>}
              {item.size && <span>{t('cart.size')}: {item.size}</span>}
              {item.customization_summary && (
                <span className="cart-item__custom-tag">
                  <span className="material-symbols-outlined">brush</span>
                  {t('cart.customized')}
                </span>
              )}
            </div>
          </div>
          <button
            className="cart-item__remove"
            onClick={() => dispatch(removeCartItem(item.id))}
            aria-label={t('cart.remove')}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="cart-item__bottom">
          <div className="cart-item__qty">
            <button onClick={() => setQty(item.quantity - 1)} aria-label="−">−</button>
            <span>{item.quantity}</span>
            <button onClick={() => setQty(item.quantity + 1)} aria-label="+">+</button>
          </div>
          <span className="cart-item__price">
            {formatCurrency(item.unit_price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const items = useSelector(s => s.cart.items);

  const subtotal = items.reduce((acc, i) => acc + i.unit_price * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : items.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping;
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <main className="cart-page">
      {/* Hero */}
      <section className="page-hero page-hero--sm">
        <div className="page-hero__bg">
          <img src="/assets/leather.jpg" alt="Leather texture" />
        </div>
        <div className="page-hero__content">
          <span className="label">{t('cart.label')}</span>
          <h1 className="page-hero__title">
            {t('cart.title_1')} <em>{t('cart.title_2')}</em>
          </h1>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="pd__breadcrumb container">
        <Link to="/">{t('cart.home')}</Link>
        <span className="material-symbols-outlined">chevron_right</span>
        <span className="pd__breadcrumb-current">{t('cart.title_1')} {t('cart.title_2')}</span>
      </nav>

      {items.length === 0 ? (
        /* Empty state */
        <div className="container cart-page__empty">
          <span className="material-symbols-outlined cart-page__empty-icon">shopping_bag</span>
          <h2 className="cart-page__empty-title">{t('cart.empty_title')}</h2>
          <p className="cart-page__empty-desc">{t('cart.empty_desc')}</p>
          <Link to="/products" className="btn btn--gradient">{t('cart.browse')}</Link>
        </div>
      ) : (
        <section className="section section--dark">
          <div className="container cart-page__layout">

            {/* Items column */}
            <div className="cart-page__items">
              <div className="cart-page__items-header">
                <h2 className="cart-page__items-title">
                  {t('cart.item', { count: itemCount })}
                </h2>
                <button
                  className="cart-page__clear"
                  onClick={() => dispatch(clearCart())}
                >
                  <span className="material-symbols-outlined">delete_sweep</span>
                  {t('cart.clear')}
                </button>
              </div>

              <div className="cart-page__list">
                {items.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              <Link to="/products" className="cart-page__continue">
                <span className="material-symbols-outlined">arrow_back</span>
                {t('cart.continue')}
              </Link>
            </div>

            {/* Summary column */}
            <aside className="cart-page__summary">
              <div className="cart-page__summary-card">
                <h2 className="cart-page__summary-title">{t('cart.subtotal')}</h2>

                {/* Shipping progress bar */}
                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <div className="cart-page__shipping-progress">
                    <div className="cart-page__shipping-bar">
                      <div
                        className="cart-page__shipping-fill"
                        style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                      />
                    </div>
                    <p className="cart-page__shipping-hint">{t('cart.shipping_threshold')}</p>
                  </div>
                )}

                <div className="cart-page__summary-rows">
                  <div className="cart-page__summary-row">
                    <span>{t('cart.subtotal')}</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="cart-page__summary-row">
                    <span>{t('cart.shipping')}</span>
                    <span className={shipping === 0 ? 'cart-page__free' : ''}>
                      {shipping === 0 ? t('cart.shipping_free') : formatCurrency(shipping)}
                    </span>
                  </div>
                </div>

                <div className="cart-page__summary-total">
                  <span>{t('cart.total')}</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                <button className="btn btn--gradient cart-page__checkout">
                  <span className="material-symbols-outlined">lock</span>
                  {t('cart.checkout')}
                </button>

                <div className="cart-page__trust">
                  <span className="material-symbols-outlined">verified_user</span>
                  <span>Secure checkout · SSL encrypted</span>
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}
    </main>
  );
}

export default Cart;