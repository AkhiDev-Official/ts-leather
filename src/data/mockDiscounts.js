export const MOCK_DISCOUNTS = [
  { id: 'd-001', code: 'WELCOME15', name: 'Welcome Discount', type: 'percentage',  value: 15, minOrder: 100,  maxDiscount: 200,  usageLimit: 500,  usedCount: 234, startsAt: '2026-01-01', endsAt: '2026-12-31', isActive: true  },
  { id: 'd-002', code: 'LEATHER50', name: 'Leather Month',    type: 'fixed_amount',value: 50, minOrder: 300,  maxDiscount: null, usageLimit: 100,  usedCount: 67,  startsAt: '2026-04-01', endsAt: '2026-04-30', isActive: true  },
  { id: 'd-003', code: 'VIP25',     name: 'VIP Exclusive',    type: 'percentage',  value: 25, minOrder: 500,  maxDiscount: 400,  usageLimit: 50,   usedCount: 12,  startsAt: '2026-01-01', endsAt: null,         isActive: true  },
  { id: 'd-004', code: 'SUMMER10',  name: 'Summer Sale',      type: 'percentage',  value: 10, minOrder: null, maxDiscount: 100,  usageLimit: 1000, usedCount: 845, startsAt: '2025-06-01', endsAt: '2025-09-30', isActive: false },
];

export const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];