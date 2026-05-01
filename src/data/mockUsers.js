export const DEMO_USER = {
  id: 'u-001',
  email: 'test@mail.com',
  firstName: 'Test',
  lastName: 'Client',
  phone: '+33 6 00 00 00 00',
  role: 'customer',
  isActive: true,
  emailVerifiedAt: '2025-11-15T10:30:00Z',
  lastLoginAt: '2026-04-26T18:45:00Z',
  createdAt: '2025-11-15T10:30:00Z',
  password: 'test123!',
};

export const ADMIN_USER = {
  id: 'u-admin',
  email: 'admin@mail.com',
  firstName: 'Admin',
  lastName: 'TS',
  phone: '+33 1 00 00 00 00',
  role: 'admin',
  isActive: true,
  emailVerifiedAt: '2025-01-01T00:00:00Z',
  lastLoginAt: '2026-04-27T08:00:00Z',
  createdAt: '2025-01-01T00:00:00Z',
  password: 'admin123!',
};

export const DEMO_ADDRESSES = [
  { id: 'addr-001', userId: 'u-001', type: 'shipping', firstName: 'Test', lastName: 'Client', phone: '+33 6 00 00 00 00', addressLine1: '24 Rue du Faubourg Saint-Honoré', addressLine2: 'Apt 3B', city: 'Paris', postalCode: '75008', country: 'France', isDefault: true },
  { id: 'addr-002', userId: 'u-001', type: 'billing',  firstName: 'Test', lastName: 'Client', phone: '+33 6 00 00 00 00', addressLine1: '24 Rue du Faubourg Saint-Honoré', addressLine2: 'Apt 3B', city: 'Paris', postalCode: '75008', country: 'France', isDefault: true },
  { id: 'addr-003', userId: 'u-001', type: 'shipping', firstName: 'Test', lastName: 'Client', phone: '+33 6 00 00 00 00', addressLine1: '15 Avenue des Champs-Élysées', addressLine2: null,     city: 'Paris', postalCode: '75001', country: 'France', isDefault: false },
];

export const DEMO_WISHLIST = [
  'the-shearling-coat',
  'the-explorer-backpack',
  'the-moto-heritage',
  'the-suede-weekender',
];