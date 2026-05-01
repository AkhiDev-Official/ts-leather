import { PRODUCTS } from './products';
import { DEMO_ADDRESSES } from './mockUsers';

const p = (slug) => PRODUCTS.find(pr => pr.slug === slug);

// ── Orders for AuthContext (format complet avec adresses objects) ──
export function buildMockOrders() {
  return [
    {
      id: 'ord-001', orderNumber: 'TS-2026-001847', userId: 'u-001',
      customerEmail: 'test@mail.com', customerFirstName: 'Test', customerLastName: 'Client',
      status: 'delivered', paymentStatus: 'paid', shippingStatus: 'delivered',
      currency: 'EUR', subtotalAmount: 1250, customizationAmount: 0,
      discountAmount: 187.50, shippingAmount: 0, taxAmount: 212.50, totalAmount: 1275,
      orderedAt: '2026-02-14T09:22:00Z', paidAt: '2026-02-14T09:23:00Z',
      shippedAt: '2026-02-18T14:00:00Z', deliveredAt: '2026-02-21T11:30:00Z',
      shippingAddress: DEMO_ADDRESSES[0], billingAddress: DEMO_ADDRESSES[1],
      items: [{
        id: 'oi-001', productName: 'The Aviator Jacket', productSlug: 'the-aviator-jacket',
        variantSku: 'TSL-AVI-COG-L', sizeLabel: 'L', color: 'Cognac',
        quantity: 1, unitPrice: 1250, customizationPrice: 0, discountAmount: 187.50, taxAmount: 212.50, totalAmount: 1275,
        image: p('the-aviator-jacket')?.images?.[0] || '/assets/jacket.jpg',
      }],
      payment: { provider: 'stripe', status: 'paid', amount: 1275, paymentMethod: 'Visa •••• 4242', paidAt: '2026-02-14T09:23:00Z' },
      shipment: { carrier: 'Colissimo', trackingNumber: 'CC123456789FR', trackingUrl: '#', shippingMethod: 'Express', status: 'delivered', shippedAt: '2026-02-18T14:00:00Z', deliveredAt: '2026-02-21T11:30:00Z' },
      statusHistory: [
        { status: 'pending',   date: '2026-02-14T09:22:00Z', note: 'Order placed' },
        { status: 'confirmed', date: '2026-02-14T09:23:00Z', note: 'Payment confirmed via Stripe' },
        { status: 'processing',date: '2026-02-15T08:00:00Z', note: 'Preparing your order' },
        { status: 'shipped',   date: '2026-02-18T14:00:00Z', note: 'Shipped via Colissimo Express' },
        { status: 'delivered', date: '2026-02-21T11:30:00Z', note: 'Delivered — signed by M. Client' },
      ],
    },
    {
      id: 'ord-002', orderNumber: 'TS-2026-002134', userId: 'u-001',
      customerEmail: 'test@mail.com', customerFirstName: 'Test', customerLastName: 'Client',
      status: 'shipped', paymentStatus: 'paid', shippingStatus: 'shipped',
      currency: 'EUR', subtotalAmount: 1520, customizationAmount: 56,
      discountAmount: 0, shippingAmount: 0, taxAmount: 315.20, totalAmount: 1891.20,
      customerNote: 'Please wrap separately.',
      orderedAt: '2026-04-10T16:45:00Z', paidAt: '2026-04-10T16:46:00Z',
      shippedAt: '2026-04-14T09:30:00Z', deliveredAt: null,
      shippingAddress: DEMO_ADDRESSES[0], billingAddress: DEMO_ADDRESSES[1],
      items: [
        { id: 'oi-002', productName: 'The Bespoke Messenger', productSlug: 'the-bespoke-messenger', variantSku: 'TSL-BSP-COG-OS', sizeLabel: 'One Size', color: 'Cognac', quantity: 1, unitPrice: 980, customizationPrice: 56, discountAmount: 0, taxAmount: 207.20, totalAmount: 1243.20, image: p('the-bespoke-messenger')?.images?.[0] || '/assets/custom.jpg', customizationSummary: { leather_color: 'Cognac', hardware: 'Antiqued Brass', monogram: 'M.D.' } },
        { id: 'oi-003', productName: 'The Monogram Clutch',   productSlug: 'the-monogram-clutch',   variantSku: 'TSL-MON-BLK-OS', sizeLabel: 'One Size', color: 'Black',  quantity: 1, unitPrice: 540, customizationPrice: 0,  discountAmount: 0, taxAmount: 108,    totalAmount: 648,     image: p('the-monogram-clutch')?.images?.[0]   || '/assets/custom.jpg' },
      ],
      payment: { provider: 'paypal', status: 'paid', amount: 1891.20, paymentMethod: 'PayPal (Test.d@gmail.com)', paidAt: '2026-04-10T16:46:00Z' },
      shipment: { carrier: 'DHL Express', trackingNumber: 'DHL1234567890', trackingUrl: '#', shippingMethod: 'Express International', status: 'in_transit', shippedAt: '2026-04-14T09:30:00Z', deliveredAt: null },
      statusHistory: [
        { status: 'pending',   date: '2026-04-10T16:45:00Z', note: 'Order placed' },
        { status: 'confirmed', date: '2026-04-10T16:46:00Z', note: 'Payment confirmed via PayPal' },
        { status: 'processing',date: '2026-04-11T08:15:00Z', note: 'Custom monogram in progress' },
        { status: 'shipped',   date: '2026-04-14T09:30:00Z', note: 'Shipped via DHL Express' },
      ],
    },
    {
      id: 'ord-003', orderNumber: 'TS-2026-002501', userId: 'u-001',
      customerEmail: 'test@mail.com', customerFirstName: 'Test', customerLastName: 'Client',
      status: 'processing', paymentStatus: 'paid', shippingStatus: 'preparing',
      currency: 'EUR', subtotalAmount: 515, customizationAmount: 0,
      discountAmount: 51.50, shippingAmount: 15, taxAmount: 95.70, totalAmount: 574.20,
      orderedAt: '2026-04-25T11:10:00Z', paidAt: '2026-04-25T11:11:00Z',
      shippedAt: null, deliveredAt: null,
      shippingAddress: DEMO_ADDRESSES[2], billingAddress: DEMO_ADDRESSES[1],
      items: [
        { id: 'oi-004', productName: 'The Classic Zip Wallet', productSlug: 'the-classic-zip-wallet', variantSku: 'TSL-CZW-COG-OS', sizeLabel: 'One Size', color: 'Cognac', quantity: 1, unitPrice: 145, customizationPrice: 0, discountAmount: 14.50, taxAmount: 26.10, totalAmount: 156.60, image: p('the-classic-zip-wallet')?.images?.[0] || '/assets/wallet.png' },
        { id: 'oi-005', productName: 'The Alpine Gloves',      productSlug: 'the-alpine-gloves',      variantSku: 'TSL-ALP-BLK-M',  sizeLabel: 'M',        color: 'Black',  quantity: 1, unitPrice: 195, customizationPrice: 0, discountAmount: 19.50, taxAmount: 35.10, totalAmount: 210.60, image: p('the-alpine-gloves')?.images?.[0]      || '/assets/winter.jpg' },
        { id: 'oi-006', productName: 'The Riviera Belt',       productSlug: 'the-riviera-belt',       variantSku: 'TSL-RIV-TAN-90', sizeLabel: '90cm',     color: 'Tan',    quantity: 1, unitPrice: 175, customizationPrice: 0, discountAmount: 17.50, taxAmount: 34.50, totalAmount: 207,    image: p('the-riviera-belt')?.images?.[0]       || '/assets/summer.jpg' },
      ],
      payment: { provider: 'stripe', status: 'paid', amount: 574.20, paymentMethod: 'Mastercard •••• 8888', paidAt: '2026-04-25T11:11:00Z' },
      shipment: null,
      statusHistory: [
        { status: 'pending',   date: '2026-04-25T11:10:00Z', note: 'Order placed' },
        { status: 'confirmed', date: '2026-04-25T11:11:00Z', note: 'Payment confirmed via Stripe' },
        { status: 'processing',date: '2026-04-25T14:00:00Z', note: 'Your items are being prepared' },
      ],
    },
    {
      id: 'ord-004', orderNumber: 'TS-2025-000412', userId: 'u-001',
      customerEmail: 'test@mail.com', customerFirstName: 'Test', customerLastName: 'Client',
      status: 'cancelled', paymentStatus: 'refunded', shippingStatus: 'pending',
      currency: 'EUR', subtotalAmount: 620, customizationAmount: 0,
      discountAmount: 0, shippingAmount: 0, taxAmount: 124, totalAmount: 744,
      orderedAt: '2025-12-20T14:30:00Z', paidAt: '2025-12-20T14:31:00Z',
      shippedAt: null, deliveredAt: null,
      shippingAddress: DEMO_ADDRESSES[0], billingAddress: DEMO_ADDRESSES[1],
      items: [{
        id: 'oi-007', productName: 'The Spring Tote', productSlug: 'the-spring-tote',
        variantSku: 'TSL-SPT-IVR-OS', sizeLabel: 'One Size', color: 'Ivory',
        quantity: 1, unitPrice: 620, customizationPrice: 0, discountAmount: 0, taxAmount: 124, totalAmount: 744,
        image: p('the-spring-tote')?.images?.[0] || '/assets/spring.jpg',
      }],
      payment: { provider: 'stripe', status: 'refunded', amount: 744, paymentMethod: 'Visa •••• 4242', paidAt: '2025-12-20T14:31:00Z' },
      shipment: null,
      statusHistory: [
        { status: 'pending',   date: '2025-12-20T14:30:00Z', note: 'Order placed' },
        { status: 'confirmed', date: '2025-12-20T14:31:00Z', note: 'Payment confirmed' },
        { status: 'cancelled', date: '2025-12-22T09:00:00Z', note: 'Cancelled at customer request — full refund issued' },
      ],
    },
  ];
}

// ── Orders pour Admin (format simplifié avec adresses strings) ──
export const MOCK_ORDERS_ADMIN = [
  { id: 'ord-001', orderNumber: 'TS-2026-001847', customer: { name: 'Test Client', email: 'test@mail.com' }, status: 'delivered', paymentStatus: 'paid', shippingStatus: 'delivered', items: [{ name: 'The Aviator Jacket', quantity: 1, unitPrice: 1250, image: p('the-aviator-jacket')?.images?.[0] || '/assets/jacket.jpg' }], subtotal: 1250, discount: 187.50, shipping: 0, tax: 212.50, total: 1275, orderedAt: '2026-02-14T09:22:00Z', paymentMethod: 'Visa •••• 4242', trackingNumber: 'CC123456789FR', shippingAddress: '24 Rue du Faubourg Saint-Honoré, 75008 Paris, France', billingAddress: '24 Rue du Faubourg Saint-Honoré, 75008 Paris, France', statusHistory: [{ status: 'pending', date: '2026-02-14T09:22:00Z', note: 'Order placed' }, { status: 'confirmed', date: '2026-02-14T09:23:00Z', note: 'Payment confirmed via Stripe' }, { status: 'processing', date: '2026-02-15T08:00:00Z', note: 'Preparing your order' }, { status: 'shipped', date: '2026-02-18T14:00:00Z', note: 'Shipped via Colissimo Express' }, { status: 'delivered', date: '2026-02-21T11:30:00Z', note: 'Delivered — signed by M. Client' }], adminNote: '' },
  { id: 'ord-002', orderNumber: 'TS-2026-002134', customer: { name: 'Test Client', email: 'test@mail.com' }, status: 'shipped', paymentStatus: 'paid', shippingStatus: 'shipped', items: [{ name: 'The Bespoke Messenger', quantity: 1, unitPrice: 980, image: p('the-bespoke-messenger')?.images?.[0] || '/assets/custom.jpg' }, { name: 'The Monogram Clutch', quantity: 1, unitPrice: 540, image: p('the-monogram-clutch')?.images?.[0] || '/assets/custom.jpg' }], subtotal: 1520, discount: 0, shipping: 0, tax: 315.20, total: 1891.20, orderedAt: '2026-04-10T16:45:00Z', paymentMethod: 'PayPal', trackingNumber: 'DHL1234567890', shippingAddress: '24 Rue du Faubourg Saint-Honoré, 75008 Paris, France', billingAddress: '24 Rue du Faubourg Saint-Honoré, 75008 Paris, France', statusHistory: [{ status: 'pending', date: '2026-04-10T16:45:00Z', note: 'Order placed' }, { status: 'confirmed', date: '2026-04-10T16:46:00Z', note: 'Payment confirmed via PayPal' }, { status: 'processing', date: '2026-04-11T08:15:00Z', note: 'Custom monogram in progress' }, { status: 'shipped', date: '2026-04-14T09:30:00Z', note: 'Shipped via DHL Express' }], adminNote: 'Customer requested separate wrapping.' },
  { id: 'ord-003', orderNumber: 'TS-2026-002501', customer: { name: 'Test Client', email: 'test@mail.com' }, status: 'processing', paymentStatus: 'paid', shippingStatus: 'preparing', items: [{ name: 'The Classic Zip Wallet', quantity: 1, unitPrice: 145, image: p('the-classic-zip-wallet')?.images?.[0] || '/assets/wallet.png' }, { name: 'The Alpine Gloves', quantity: 1, unitPrice: 195, image: p('the-alpine-gloves')?.images?.[0] || '/assets/winter.jpg' }, { name: 'The Riviera Belt', quantity: 1, unitPrice: 175, image: p('the-riviera-belt')?.images?.[0] || '/assets/summer.jpg' }], subtotal: 515, discount: 51.50, shipping: 15, tax: 95.70, total: 574.20, orderedAt: '2026-04-25T11:10:00Z', paymentMethod: 'Mastercard •••• 8888', trackingNumber: null, shippingAddress: '15 Avenue des Champs-Élysées, 75001 Paris, France', billingAddress: '24 Rue du Faubourg Saint-Honoré, 75008 Paris, France', statusHistory: [{ status: 'pending', date: '2026-04-25T11:10:00Z', note: 'Order placed' }, { status: 'confirmed', date: '2026-04-25T11:11:00Z', note: 'Payment confirmed via Stripe' }, { status: 'processing', date: '2026-04-25T14:00:00Z', note: 'Your items are being prepared' }], adminNote: '' },
  { id: 'ord-004', orderNumber: 'TS-2025-000412', customer: { name: 'Test Client', email: 'test@mail.com' }, status: 'cancelled', paymentStatus: 'refunded', shippingStatus: 'pending', items: [{ name: 'The Spring Tote', quantity: 1, unitPrice: 620, image: p('the-spring-tote')?.images?.[0] || '/assets/spring.jpg' }], subtotal: 620, discount: 0, shipping: 0, tax: 124, total: 744, orderedAt: '2025-12-20T14:30:00Z', paymentMethod: 'Visa •••• 4242', trackingNumber: null, shippingAddress: '24 Rue du Faubourg Saint-Honoré, 75008 Paris, France', billingAddress: '24 Rue du Faubourg Saint-Honoré, 75008 Paris, France', statusHistory: [{ status: 'pending', date: '2025-12-20T14:30:00Z', note: 'Order placed' }, { status: 'confirmed', date: '2025-12-20T14:31:00Z', note: 'Payment confirmed' }, { status: 'cancelled', date: '2025-12-22T09:00:00Z', note: 'Cancelled at customer request — full refund issued' }], adminNote: 'Customer changed mind, full refund processed.' },
  { id: 'ord-005', orderNumber: 'TS-2026-002600', customer: { name: 'Marie Dupont', email: 'marie.dupont@email.fr' }, status: 'pending', paymentStatus: 'pending', shippingStatus: 'pending', items: [{ name: 'The Shearling Coat', quantity: 1, unitPrice: 1890, image: p('the-shearling-coat')?.images?.[0] || '/assets/winter.jpg' }], subtotal: 1890, discount: 0, shipping: 0, tax: 378, total: 2268, orderedAt: '2026-04-27T08:15:00Z', paymentMethod: 'Pending', trackingNumber: null, shippingAddress: '8 Rue de Rivoli, 75004 Paris, France', billingAddress: '8 Rue de Rivoli, 75004 Paris, France', statusHistory: [{ status: 'pending', date: '2026-04-27T08:15:00Z', note: 'Awaiting payment confirmation' }], adminNote: '' },
  { id: 'ord-006', orderNumber: 'TS-2026-002610', customer: { name: 'Marie Dupont', email: 'marie.dupont@email.fr' }, status: 'confirmed', paymentStatus: 'paid', shippingStatus: 'pending', items: [{ name: 'The Explorer Backpack', quantity: 1, unitPrice: 890, image: p('the-explorer-backpack')?.images?.[0] || '/assets/fall.jpg' }, { name: 'The Cognac Belt', quantity: 1, unitPrice: 165, image: p('the-cognac-belt')?.images?.[0] || '/assets/fall.jpg' }], subtotal: 1055, discount: 158.25, shipping: 0, tax: 179.35, total: 1076.10, orderedAt: '2026-04-26T19:00:00Z', paymentMethod: 'Visa •••• 1234', trackingNumber: null, shippingAddress: '8 Rue de Rivoli, 75004 Paris, France', billingAddress: '8 Rue de Rivoli, 75004 Paris, France', statusHistory: [{ status: 'pending', date: '2026-04-26T19:00:00Z', note: 'Order placed' }, { status: 'confirmed', date: '2026-04-26T19:01:00Z', note: 'Payment confirmed via Stripe' }], adminNote: '' },
  { id: 'ord-007', orderNumber: 'TS-2026-002450', customer: { name: 'Jean Martin', email: 'jean.martin@email.fr' }, status: 'delivered', paymentStatus: 'paid', shippingStatus: 'delivered', items: [{ name: 'The Moto Heritage', quantity: 1, unitPrice: 950, image: p('the-moto-heritage')?.images?.[0] || '/assets/jacket.jpg' }], subtotal: 950, discount: 0, shipping: 0, tax: 190, total: 1140, orderedAt: '2026-03-05T10:30:00Z', paymentMethod: 'Mastercard •••• 5678', trackingNumber: 'LP987654321FR', shippingAddress: '22 Boulevard Haussmann, 75009 Paris, France', billingAddress: '22 Boulevard Haussmann, 75009 Paris, France', statusHistory: [{ status: 'pending', date: '2026-03-05T10:30:00Z', note: 'Order placed' }, { status: 'confirmed', date: '2026-03-05T10:31:00Z', note: 'Payment confirmed' }, { status: 'processing', date: '2026-03-06T09:00:00Z', note: 'Preparing order' }, { status: 'shipped', date: '2026-03-08T14:00:00Z', note: 'Shipped via La Poste' }, { status: 'delivered', date: '2026-03-11T16:20:00Z', note: 'Delivered' }], adminNote: '' },
  { id: 'ord-008', orderNumber: 'TS-2026-002620', customer: { name: 'Sophie Bernard', email: 'sophie.bernard@email.fr' }, status: 'processing', paymentStatus: 'paid', shippingStatus: 'preparing', items: [{ name: 'The Pastel Satchel', quantity: 1, unitPrice: 540, image: p('the-pastel-satchel')?.images?.[0] || '/assets/spring.jpg' }], subtotal: 540, discount: 54, shipping: 15, tax: 100.20, total: 601.20, orderedAt: '2026-04-27T11:00:00Z', paymentMethod: 'Apple Pay', trackingNumber: null, shippingAddress: '5 Place Bellecour, 69002 Lyon, France', billingAddress: '5 Place Bellecour, 69002 Lyon, France', statusHistory: [{ status: 'pending', date: '2026-04-27T11:00:00Z', note: 'Order placed' }, { status: 'confirmed', date: '2026-04-27T11:01:00Z', note: 'Payment confirmed via Apple Pay' }, { status: 'processing', date: '2026-04-27T14:00:00Z', note: 'Preparing order' }], adminNote: '' },
];