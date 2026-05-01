import { useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PRODUCTS } from '../../data/products';
import { CUSTOM_OPTIONS } from '../../data/customOptions';

/* ── Price calculator ── */
function calcCustomPrice(basePrice, options, selections) {
  let total = 0;
  for (const opt of options) {
    const val = selections[opt.code];
    if (!val || val === '' || val === false) continue;

    if (opt.priceType === 'fixed') {
      total += opt.priceAmount;
    } else if (opt.priceType === 'per_character' && typeof val === 'string') {
      total += val.length * opt.priceAmount;
    }

    if (opt.values) {
      const chosen = opt.values.find(v => v.value === val);
      if (chosen?.surcharge) total += chosen.surcharge;
    }
  }
  return basePrice + total;
}

/* ── Steps ── */
function Steps({ options, selections, current, onGo }) {
  return (
    <div className="cust__steps">
      {options.map((opt, i) => {
        const filled = !!selections[opt.code] && selections[opt.code] !== '';
        const isCurrent = i === current;
        const isDepHidden = opt.dependsOn && !selections[opt.dependsOn];
        if (isDepHidden) return null;
        return (
          <button
            key={opt.id}
            className={`cust__step ${isCurrent ? 'active' : ''} ${filled ? 'filled' : ''}`}
            onClick={() => onGo(i)}
          >
            <span className="cust__step-num">{i + 1}</span>
            <span className="cust__step-label">{opt.name}</span>
            {filled && <span className="material-symbols-outlined cust__step-check">check_circle</span>}
          </button>
        );
      })}
    </div>
  );
}

function Customize() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const product = PRODUCTS.find(p => p.slug === slug);

  const [selections, setSelections] = useState({});
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const options = useMemo(
    () => (product ? (CUSTOM_OPTIONS[product.id] || []) : []),
    [product]
  );

  const visibleOptions = useMemo(
    () => options.filter(o => !o.dependsOn || (selections[o.dependsOn] && selections[o.dependsOn] !== '')),
    [options, selections]
  );

  const totalPrice = useMemo(
    () => product ? calcCustomPrice(product.price, options, selections) : 0,
    [product, options, selections]
  );

  const customizationPrice = totalPrice - (product?.price || 0);

  const set = useCallback((code, value) => {
    setSelections(prev => ({ ...prev, [code]: value }));
  }, []);

  if (!product || !product.isCustomizable) {
    return (
      <main className="cust">
        <div className="container cust__not-found">
          <span className="material-symbols-outlined" style={{ fontSize: '3rem', opacity: 0.3 }}>block</span>
          <h2>{t('customize.not_available')}</h2>
          <p>{t('customize.not_available_desc')}</p>
          <Link to="/products" className="btn btn--solid">{t('customize.browse_products')}</Link>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="cust">
        <div className="container cust__success">
          <span className="material-symbols-outlined cust__success-icon">task_alt</span>
          <h2>{t('customize.confirmed_title')}</h2>
          <p>{t('customize.confirmed_desc', { name: product.name })}</p>
          <div className="cust__success-actions">
            <Link to={`/product/${product.slug}`} className="btn btn--solid">{t('customize.back_to_product')}</Link>
            <Link to="/products" className="btn btn--gradient">{t('customize.continue_shopping')}</Link>
          </div>
        </div>
      </main>
    );
  }

  const currentOpt = visibleOptions[step] || visibleOptions[0];
  const isLast = step >= visibleOptions.length - 1;
  const allRequiredFilled = options
    .filter(o => o.isRequired)
    .every(o => selections[o.code] && selections[o.code] !== '');

  return (
    <main className="cust">
      <nav className="pd__breadcrumb container">
        <Link to="/">Home</Link>
        <span className="material-symbols-outlined">chevron_right</span>
        <Link to={`/product/${product.slug}`}>{product.name}</Link>
        <span className="material-symbols-outlined">chevron_right</span>
        <span className="pd__breadcrumb-current">{t('customize.breadcrumb')}</span>
      </nav>

      <div className="cust__layout container">
        <div className="cust__preview">
          <div className="cust__preview-img">
            <img src={product.images?.[0] || product.img} alt={product.name} />
            <div className="cust__preview-overlay">
              <span className="material-symbols-outlined">brush</span>
              <span>{t('customize.live_preview')}</span>
            </div>
          </div>

          {/* Summary card */}
          <div className="cust__summary">
            <h3 className="cust__summary-title">{t('customize.your_config')}</h3>
            <div className="cust__summary-list">
              {options.map(opt => {
                const val = selections[opt.code];
                if (!val && val !== false) return (
                  <div className="cust__summary-row cust__summary-row--empty" key={opt.code}>
                    <span className="cust__summary-label">{opt.name}</span>
                    <span className="cust__summary-val">—</span>
                  </div>
                );
                let display = '';
                let price = '';
                if (opt.type === 'boolean') {
                  display = val ? t('customize.yes') : t('customize.no');
                  if (val && opt.priceAmount) price = `+$${opt.priceAmount}`;
                } else if (opt.type === 'text' || opt.type === 'textarea') {
                  display = val || '—';
                  if (val && opt.priceType === 'per_character') price = `+$${val.length * opt.priceAmount}`;
                } else if (opt.values) {
                  const chosen = opt.values.find(v => v.value === val);
                  display = chosen?.label || val;
                  if (chosen?.surcharge) price = `+$${chosen.surcharge}`;
                }
                return (
                  <div className="cust__summary-row" key={opt.code}>
                    <span className="cust__summary-label">{opt.name}</span>
                    <span className="cust__summary-val">{display}</span>
                    {price && <span className="cust__summary-price">{price}</span>}
                  </div>
                );
              })}
            </div>
              <div className="cust__summary-total">
              <div>
                <span>{t('customize.base_price')}</span>
                <span>${product.price.toLocaleString()}</span>
              </div>
              {customizationPrice > 0 && (
                <div>
                  <span>{t('customize.customization_label')}</span>
                  <span>+${customizationPrice.toLocaleString()}</span>
                </div>
              )}
              <div className="cust__summary-grand">
                <span>{t('customize.total')}</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="cust__configurator">
          <div className="cust__header">
            <span className="label">{t('customize.label')}</span>
            <h1 className="cust__title">{product.name}</h1>
            <p className="cust__subtitle">{t('customize.subtitle')}</p>
          </div>

          <Steps options={visibleOptions} selections={selections} current={step} onGo={setStep} />

          {currentOpt && (
            <div className="cust__option" key={currentOpt.id}>
              <div className="cust__option-header">
                <h3 className="cust__option-name">
                  {currentOpt.name}
                  {currentOpt.isRequired && <span className="cust__req">{t('customize.required')}</span>}
                </h3>
                <p className="cust__option-desc">{currentOpt.description}</p>
              </div>

              <div className="cust__option-body">
                {/* Color type */}
                {currentOpt.type === 'color' && (
                  <div className="cust__color-grid">
                    {currentOpt.values.map(v => (
                      <button
                        key={v.value}
                        className={`cust__color-chip ${selections[currentOpt.code] === v.value ? 'active' : ''}`}
                        onClick={() => set(currentOpt.code, v.value)}
                      >
                        <span className="cust__color-dot" style={{ background: v.hex }} />
                        <span className="cust__color-label">{v.label}</span>
                        {v.surcharge && <span className="cust__surcharge">+${v.surcharge}</span>}
                      </button>
                    ))}
                  </div>
                )}

                {/* Select type */}
                {currentOpt.type === 'select' && (
                  <div className="cust__select-grid">
                    {currentOpt.values.map(v => (
                      <button
                        key={v.value}
                        className={`cust__select-card ${selections[currentOpt.code] === v.value ? 'active' : ''}`}
                        onClick={() => set(currentOpt.code, v.value)}
                      >
                        <span className="cust__select-label">{v.label}</span>
                        {v.surcharge && <span className="cust__surcharge">+${v.surcharge}</span>}
                      </button>
                    ))}
                  </div>
                )}

                {/* Text type */}
                {(currentOpt.type === 'text' || currentOpt.type === 'textarea') && (
                  <div className="cust__text-input">
                    {currentOpt.type === 'text' ? (
                      <input
                        type="text"
                        className="cust__input"
                        placeholder={`Enter ${currentOpt.name.toLowerCase()}...`}
                        value={selections[currentOpt.code] || ''}
                        onChange={e => set(currentOpt.code, e.target.value.slice(0, currentOpt.maxLength || 50))}
                        maxLength={currentOpt.maxLength || 50}
                      />
                    ) : (
                      <textarea
                        className="cust__textarea"
                        placeholder={`Enter ${currentOpt.name.toLowerCase()}...`}
                        value={selections[currentOpt.code] || ''}
                        onChange={e => set(currentOpt.code, e.target.value.slice(0, currentOpt.maxLength || 200))}
                        rows={3}
                      />
                    )}
                    <div className="cust__text-meta">
                      {currentOpt.maxLength && (
                        <span>{t('customize.characters_count', { count: (selections[currentOpt.code] || '').length, max: currentOpt.maxLength })}</span>
                      )}
                      {currentOpt.priceType === 'per_character' && (
                        <span>${currentOpt.priceAmount}/character</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Bool type */}
                {currentOpt.type === 'boolean' && (
                  <div className="cust__toggle-wrap">
                    <button
                      className={`cust__toggle ${selections[currentOpt.code] ? 'active' : ''}`}
                      onClick={() => set(currentOpt.code, !selections[currentOpt.code])}
                    >
                      <span className="cust__toggle-track">
                        <span className="cust__toggle-thumb" />
                      </span>
                      <span className="cust__toggle-label">
                        {selections[currentOpt.code] ? t('customize.yes') : t('customize.no')}
                      </span>
                    </button>
                    {currentOpt.priceAmount > 0 && (
                      <span className="cust__toggle-price">+${currentOpt.priceAmount}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="cust__nav">
            <button
              className="btn btn--solid cust__nav-btn"
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <span className="material-symbols-outlined">arrow_back</span>
              {t('customize.previous')}
            </button>
            {isLast ? (
              <button
                className="btn btn--gradient cust__nav-btn cust__nav-btn--submit"
                disabled={!allRequiredFilled}
                onClick={() => setSubmitted(true)}
              >
                <span className="material-symbols-outlined">check</span>
                {t('customize.confirm', { price: totalPrice.toFixed(2) })}
              </button>
            ) : (
              <button
                className="btn btn--gradient cust__nav-btn"
                onClick={() => setStep(s => Math.min(visibleOptions.length - 1, s + 1))}
              >
                {t('customize.next')}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Customize;
