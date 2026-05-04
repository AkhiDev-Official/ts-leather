import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./OrderDetail.css";

const STATUS_COLORS = {
  pending: "#C49B38",
  confirmed: "#5A9A6F",
  processing: "#6A8FD8",
  shipped: "#9B6AD8",
  delivered: "#4CAF50",
  cancelled: "#B44040",
  refunded: "#B44040",
};
const STATUS_ICONS = {
  pending: "hourglass_top",
  confirmed: "check_circle",
  processing: "precision_manufacturing",
  shipped: "local_shipping",
  delivered: "inventory_2",
  cancelled: "cancel",
  refunded: "currency_exchange",
};
const PAYMENT_ICONS = {
  stripe: "credit_card",
  paypal: "account_balance_wallet",
  bank_transfer: "account_balance",
};

function formatDate(iso, time = false) {
  if (!iso) return "—";
  const opts = { year: "numeric", month: "short", day: "numeric" };
  if (time) Object.assign(opts, { hour: "2-digit", minute: "2-digit" });
  return new Date(iso).toLocaleDateString("en-US", opts);
}
function formatCurrency(n) {
  return (
    "€" +
    Number(n)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}

function OrderDetail() {
  const { orderNumber } = useParams();
  const { t } = useTranslation();
  const orders = useSelector((s) => s.orders.list);
  const isAuthenticated = useSelector((s) => !!s.user.user);
  const navigate = useNavigate();

  const order = useMemo(
    () => orders.find((o) => o.orderNumber === orderNumber),
    [orders, orderNumber],
  );

  if (!isAuthenticated) {
    navigate("/login", { replace: true });
    return null;
  }

  if (!order) {
    return (
      <main className="odet">
        <div className="container odet__not-found">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "3rem", opacity: 0.3 }}
          >
            search_off
          </span>
          <h2>{t('order_detail.not_found')}</h2>
          <p>
            {t('order_detail.not_found_desc')} <strong>{orderNumber}</strong>
            .
          </p>
          <Link to="/account" className="btn btn--solid">
            {t('order_detail.back_to_account')}
          </Link>
        </div>
      </main>
    );
  }

  const isCancelled = order.status === "cancelled";

  return (
    <main className="odet">
      {/* Breadcrumb */}
      <nav className="pd__breadcrumb container">
        <Link to="/">{t('order_detail.home')}</Link>
        <span className="material-symbols-outlined">chevron_right</span>
        <Link to="/account">{t('order_detail.my_account')}</Link>
        <span className="material-symbols-outlined">chevron_right</span>
        <span className="pd__breadcrumb-current">{order.orderNumber}</span>
      </nav>

      <div className="container odet__layout">
        {/* Header */}
        <div className="odet__header">
          <div>
            <h1 className="odet__title">{t('order_detail.order_title', { number: order.orderNumber })}</h1>
            <span className="odet__date">
              {t('order_detail.placed', { date: formatDate(order.orderedAt, true) })}
            </span>
          </div>
          <span
            className="odet__status-badge"
            style={{
              background: STATUS_COLORS[order.status] + "18",
              color: STATUS_COLORS[order.status],
              borderColor: STATUS_COLORS[order.status] + "40",
            }}
          >
            <span className="material-symbols-outlined">
              {STATUS_ICONS[order.status]}
            </span>
            {order.status}
          </span>
        </div>

        {/* Timeline */}
        <section className="odet__timeline">
          <h3 className="odet__section-title">{t('order_detail.timeline')}</h3>
          <div className="odet__timeline-track">
            {order.statusHistory.map((step, i) => {
              const isLast = i === order.statusHistory.length - 1;
              const color = STATUS_COLORS[step.status] || "#C49B38";
              return (
                <div
                  key={i}
                  className={`odet__tl-step ${isLast ? "active" : ""}`}
                >
                  <div
                    className="odet__tl-dot"
                    style={{
                      background: color,
                      boxShadow: isLast ? `0 0 12px ${color}50` : "none",
                    }}
                  >
                    <span className="material-symbols-outlined">
                      {STATUS_ICONS[step.status] || "circle"}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      className="odet__tl-line"
                      style={{ background: color }}
                    />
                  )}
                  <div className="odet__tl-info">
                    <span className="odet__tl-status" style={{ color }}>
                      {step.status}
                    </span>
                    <span className="odet__tl-date">
                      {formatDate(step.date, true)}
                    </span>
                    <span className="odet__tl-note">{step.note}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="odet__grid">
          {/* Items */}
          <section className="odet__items">
            <h3 className="odet__section-title">
              {t('order_detail.items', { count: order.items.length })}
            </h3>
            {order.items.map((item) => (
              <div key={item.id} className="odet__item">
                <Link
                  to={`/product/${item.productSlug}`}
                  className="odet__item-img"
                >
                  <img src={item.image} alt={item.productName} />
                </Link>
                <div className="odet__item-info">
                  <Link
                    to={`/product/${item.productSlug}`}
                    className="odet__item-name"
                  >
                    {item.productName}
                  </Link>
                  <div className="odet__item-meta">
                    <span>{t('order_detail.sku', { sku: item.variantSku })}</span>
                    <span>
                      {item.color} • {item.sizeLabel}
                    </span>
                    <span>{t('order_detail.qty', { qty: item.quantity })}</span>
                  </div>
                  {item.customizationSummary && (
                    <div className="odet__item-custom">
                      <span className="material-symbols-outlined">brush</span>
                      {Object.entries(item.customizationSummary).map(
                        ([k, v]) => (
                          <span key={k} className="odet__item-custom-tag">
                            {k.replace(/_/g, " ")}: {v}
                          </span>
                        ),
                      )}
                    </div>
                  )}
                </div>
                <div className="odet__item-pricing">
                  <span className="odet__item-unit">
                    {formatCurrency(item.unitPrice)}
                  </span>
                  {item.customizationPrice > 0 && (
                    <span className="odet__item-cust">
                      +{formatCurrency(item.customizationPrice)} {t('order_detail.custom_label')}
                    </span>
                  )}
                  {item.discountAmount > 0 && (
                    <span className="odet__item-disc">
                      -{formatCurrency(item.discountAmount)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* Right column */}
          <div className="odet__aside">
            {/* Summary */}
            <div className="odet__card">
              <h3 className="odet__card-title">{t('order_detail.order_summary')}</h3>
              <div className="odet__summary-row">
                <span>{t('order_detail.subtotal')}</span>
                <span>{formatCurrency(order.subtotalAmount)}</span>
              </div>
              {order.customizationAmount > 0 && (
                <div className="odet__summary-row">
                  <span>{t('order_detail.customization')}</span>
                  <span>+{formatCurrency(order.customizationAmount)}</span>
                </div>
              )}
              {order.discountAmount > 0 && (
                <div className="odet__summary-row odet__summary-row--disc">
                  <span>{t('order_detail.discount')}</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="odet__summary-row">
                <span>{t('order_detail.shipping')}</span>
                <span>
                  {order.shippingAmount > 0
                    ? formatCurrency(order.shippingAmount)
                    : t('order_detail.free')}
                </span>
              </div>
              <div className="odet__summary-row">
                <span>{t('order_detail.tax_vat')}</span>
                <span>{formatCurrency(order.taxAmount)}</span>
              </div>
              <div className="odet__summary-total">
                <span>{t('order_detail.total')}</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="odet__card">
              <h3 className="odet__card-title">{t('order_detail.payment')}</h3>
              <div className="odet__pay-info">
                <span className="material-symbols-outlined">
                  {PAYMENT_ICONS[order.payment?.provider] || "credit_card"}
                </span>
                <div>
                  <span className="odet__pay-method">
                    {order.payment?.paymentMethod}
                  </span>
                  <span
                    className="odet__pay-status"
                    style={{
                      color:
                        order.paymentStatus === "paid"
                          ? "#4CAF50"
                          : order.paymentStatus === "refunded"
                            ? "#B44040"
                            : "#C49B38",
                    }}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping */}
            {order.shipment && (
              <div className="odet__card">
                <h3 className="odet__card-title">Shipping</h3>
                <div className="odet__ship-row">
                  <span>{t('order_detail.carrier')}</span>
                  <span>{order.shipment.carrier}</span>
                </div>
                <div className="odet__ship-row">
                  <span>{t('order_detail.method')}</span>
                  <span>{order.shipment.shippingMethod}</span>
                </div>
                <div className="odet__ship-row">
                  <span>{t('order_detail.tracking')}</span>
                  <span className="odet__tracking-num">
                    {order.shipment.trackingNumber}
                  </span>
                </div>
                <div className="odet__ship-row">
                  <span>{t('order_detail.status')}</span>
                  <span style={{ textTransform: "capitalize" }}>
                    {order.shipment.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            )}

            {/* Addresses */}
            <div className="odet__card">
              <h3 className="odet__card-title">{t('order_detail.shipping_address')}</h3>
              <p className="odet__addr">
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}
              </p>
              <p className="odet__addr">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p className="odet__addr">
                  {order.shippingAddress.addressLine2}
                </p>
              )}
              <p className="odet__addr">
                {order.shippingAddress.postalCode} {order.shippingAddress.city},{" "}
                {order.shippingAddress.country}
              </p>
            </div>

            {order.customerNote && (
              <div className="odet__card">
                <h3 className="odet__card-title">{t('order_detail.customer_note')}</h3>
                <p className="odet__note">{order.customerNote}</p>
              </div>
            )}
          </div>
        </div>

        <div className="odet__footer-actions">
          <Link to="/account" className="btn btn--solid">
            <span className="material-symbols-outlined">arrow_back</span>
            {t('order_detail.back_to_account')}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrderDetail;
