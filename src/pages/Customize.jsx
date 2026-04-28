import { useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from './Products';
import './Customize.css';

const CUSTOM_OPTIONS = {
  13: [
    {
      id: 'co-13-1', code: 'leather_color', name: 'Leather Color', type: 'color',
      description: 'Select the primary calfskin color for your messenger bag.',
      isRequired: true, priceType: 'none', priceAmount: 0, position: 1,
      values: [
        { value: 'cognac', label: 'Cognac', hex: '#8B5E3C' },
        { value: 'black', label: 'Black', hex: '#2A2A2A' },
        { value: 'dark-brown', label: 'Dark Brown', hex: '#3E2A1A' },
        { value: 'burgundy', label: 'Burgundy', hex: '#6B1C2A' },
        { value: 'navy', label: 'Navy', hex: '#1A2844' },
        { value: 'olive', label: 'Olive', hex: '#556B2F' },
      ],
    },
    {
      id: 'co-13-2', code: 'hardware_finish', name: 'Hardware Finish', type: 'select',
      description: 'Choose the finish for buckles, zippers, and clasps.',
      isRequired: true, priceType: 'none', priceAmount: 0, position: 2,
      values: [
        { value: 'brass', label: 'Antiqued Brass' },
        { value: 'silver', label: 'Brushed Silver' },
        { value: 'gunmetal', label: 'Gunmetal Black' },
        { value: 'gold', label: 'Polished Gold', surcharge: 45 },
      ],
    },
    {
      id: 'co-13-3', code: 'strap_style', name: 'Strap Style', type: 'select',
      description: 'Select the shoulder strap configuration.',
      isRequired: true, priceType: 'none', priceAmount: 0, position: 3,
      values: [
        { value: 'classic', label: 'Classic Adjustable' },
        { value: 'padded', label: 'Padded Wide Strap', surcharge: 35 },
        { value: 'chain', label: 'Leather & Chain', surcharge: 65 },
      ],
    },
    {
      id: 'co-13-4', code: 'lining', name: 'Interior Lining', type: 'select',
      description: 'Choose the fabric for the interior lining.',
      isRequired: false, priceType: 'none', priceAmount: 0, position: 4,
      values: [
        { value: 'cotton', label: 'Cotton Canvas (Default)' },
        { value: 'suede', label: 'Microsuede', surcharge: 40 },
        { value: 'silk', label: 'Italian Silk', surcharge: 85 },
      ],
    },
    {
      id: 'co-13-5', code: 'monogram', name: 'Monogram Text', type: 'text',
      description: 'Add your initials or name (hot-stamped in gold foil). Leave blank to skip.',
      isRequired: false, priceType: 'per_character', priceAmount: 8, position: 5,
      minLength: 0, maxLength: 12,
    },
    {
      id: 'co-13-6', code: 'monogram_position', name: 'Monogram Position', type: 'select',
      description: 'Where should the monogram be placed?',
      isRequired: false, priceType: 'none', priceAmount: 0, position: 6,
      dependsOn: 'monogram',
      values: [
        { value: 'front-flap', label: 'Front Flap (Center)' },
        { value: 'front-corner', label: 'Front Flap (Bottom Right)' },
        { value: 'interior', label: 'Interior Pocket' },
      ],
    },
    {
      id: 'co-13-7', code: 'gift_wrap', name: 'Gift Wrapping', type: 'boolean',
      description: 'Premium gift box with ribbon and a handwritten card.',
      isRequired: false, priceType: 'fixed', priceAmount: 25, position: 7,
    },
  ],
  15: [
    {
      id: 'co-15-1', code: 'leather_color', name: 'Lambskin Color', type: 'color',
      description: 'Select the primary lambskin color for your clutch.',
      isRequired: true, priceType: 'none', priceAmount: 0, position: 1,
      values: [
        { value: 'black', label: 'Black', hex: '#2A2A2A' },
        { value: 'burgundy', label: 'Burgundy', hex: '#6B1C2A' },
        { value: 'gold', label: 'Gold', hex: '#C49B38' },
        { value: 'ivory', label: 'Ivory', hex: '#E8DFD0' },
        { value: 'blush', label: 'Blush', hex: '#D4A0A0' },
      ],
    },
    {
      id: 'co-15-2', code: 'hardware_finish', name: 'Hardware Finish', type: 'select',
      description: 'Choose the finish for the clasp and zipper.',
      isRequired: true, priceType: 'none', priceAmount: 0, position: 2,
      values: [
        { value: 'gold', label: 'Polished Gold' },
        { value: 'silver', label: 'Brushed Silver' },
        { value: 'gunmetal', label: 'Gunmetal Black' },
      ],
    },
    {
      id: 'co-15-3', code: 'monogram', name: 'Monogram Text', type: 'text',
      description: 'Add your initials (hot-stamped on the front flap). Leave blank to skip.',
      isRequired: false, priceType: 'per_character', priceAmount: 10, position: 3,
      minLength: 0, maxLength: 6,
    },
    {
      id: 'co-15-4', code: 'monogram_font', name: 'Monogram Font', type: 'select',
      description: 'Choose the typography for your monogram.',
      isRequired: false, priceType: 'none', priceAmount: 0, position: 4,
      dependsOn: 'monogram',
      values: [
        { value: 'serif', label: 'Classic Serif' },
        { value: 'script', label: 'Elegant Script' },
        { value: 'block', label: 'Modern Block' },
      ],
    },
    {
      id: 'co-15-5', code: 'wrist_strap', name: 'Wrist Strap', type: 'boolean',
      description: 'Add a removable leather wrist strap.',
      isRequired: false, priceType: 'fixed', priceAmount: 30, position: 5,
    },
    {
      id: 'co-15-6', code: 'lining', name: 'Interior Lining', type: 'select',
      description: 'Choose the lining for the interior.',
      isRequired: false, priceType: 'none', priceAmount: 0, position: 6,
      values: [
        { value: 'suede', label: 'Suede (Default)' },
        { value: 'silk', label: 'Silk', surcharge: 55 },
      ],
    },
    {
      id: 'co-15-7', code: 'gift_wrap', name: 'Gift Wrapping', type: 'boolean',
      description: 'Premium gift box with ribbon and a handwritten card.',
      isRequired: false, priceType: 'fixed', priceAmount: 25, position: 7,
    },
  ],
};

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
          <h2>Product Not Available for Customization</h2>
          <p>This product cannot be customized, or the URL is invalid.</p>
          <Link to="/products" className="btn btn--solid">Browse Products</Link>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="cust">
        <div className="container cust__success">
          <span className="material-symbols-outlined cust__success-icon">task_alt</span>
          <h2>Your Custom Order is Confirmed</h2>
          <p>Our artisans will begin crafting your personalized <strong>{product.name}</strong>. You'll receive a confirmation email with estimated delivery.</p>
          <div className="cust__success-actions">
            <Link to={`/product/${product.slug}`} className="btn btn--solid">Back to Product</Link>
            <Link to="/products" className="btn btn--gradient">Continue Shopping</Link>
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
        <span className="pd__breadcrumb-current">Customize</span>
      </nav>

      <div className="cust__layout container">
        <div className="cust__preview">
          <div className="cust__preview-img">
            <img src={product.images?.[0] || product.img} alt={product.name} />
            <div className="cust__preview-overlay">
              <span className="material-symbols-outlined">brush</span>
              <span>Live Preview</span>
            </div>
          </div>

          {/* Summary card */}
          <div className="cust__summary">
            <h3 className="cust__summary-title">Your Configuration</h3>
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
                  display = val ? 'Yes' : 'No';
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
                <span>Base Price</span>
                <span>${product.price.toLocaleString()}</span>
              </div>
              {customizationPrice > 0 && (
                <div>
                  <span>Customization</span>
                  <span>+${customizationPrice.toLocaleString()}</span>
                </div>
              )}
              <div className="cust__summary-grand">
                <span>Total</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="cust__configurator">
          <div className="cust__header">
            <span className="label">Customize</span>
            <h1 className="cust__title">{product.name}</h1>
            <p className="cust__subtitle">Design your one-of-a-kind piece, step by step.</p>
          </div>

          <Steps options={visibleOptions} selections={selections} current={step} onGo={setStep} />

          {currentOpt && (
            <div className="cust__option" key={currentOpt.id}>
              <div className="cust__option-header">
                <h3 className="cust__option-name">
                  {currentOpt.name}
                  {currentOpt.isRequired && <span className="cust__req">Required</span>}
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
                        <span>{(selections[currentOpt.code] || '').length}/{currentOpt.maxLength} characters</span>
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
                        {selections[currentOpt.code] ? 'Yes' : 'No'}
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
              Previous
            </button>
            {isLast ? (
              <button
                className="btn btn--gradient cust__nav-btn cust__nav-btn--submit"
                disabled={!allRequiredFilled}
                onClick={() => setSubmitted(true)}
              >
                <span className="material-symbols-outlined">check</span>
                Confirm — ${totalPrice.toLocaleString()}
              </button>
            ) : (
              <button
                className="btn btn--gradient cust__nav-btn"
                onClick={() => setStep(s => Math.min(visibleOptions.length - 1, s + 1))}
              >
                Next
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
