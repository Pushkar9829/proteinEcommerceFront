export const ROLE_NAV = [
  { to: '/admin', label: 'Today', roles: ['*'] },
  { to: '/admin/products', label: 'Products', roles: ['product'] },
  { to: '/admin/categories', label: 'Categories', roles: ['product'] },
  { to: '/admin/inventory', label: 'Inventory', roles: ['product', 'warehouse'] },
  { to: '/admin/orders', label: 'Orders', roles: ['orders', 'warehouse'] },
  { to: '/admin/shipping', label: 'Shipping', roles: ['orders', 'warehouse'] },
  { to: '/admin/banners', label: 'Banners', roles: ['marketing', 'product'] },
  { to: '/admin/cms', label: 'CMS', roles: ['marketing', 'product'] },
  { to: '/admin/testimonials', label: 'Testimonials', roles: ['marketing', 'product'] },
  { to: '/admin/offers', label: 'Offers', roles: ['marketing'] },
  { to: '/admin/customers', label: 'Customers', roles: ['orders', 'support'] },
  { to: '/admin/reviews', label: 'Reviews', roles: ['support'] },
  { to: '/admin/support', label: 'Support', roles: ['support'] },
  { to: '/admin/returns', label: 'Returns', roles: ['support', 'orders'] },
  { to: '/admin/reports', label: 'Reports', roles: ['*'] },
  { to: '/admin/templates', label: 'Templates', roles: ['marketing'] },
  { to: '/admin/audit', label: 'Audit', roles: ['owner'] },
  { to: '/admin/settings', label: 'Settings', roles: ['owner'] },
  { to: '/admin/staff', label: 'Staff', roles: ['owner'] },
];

export function navForRole(role) {
  if (role === 'owner') return ROLE_NAV;
  if (role === 'manager') return ROLE_NAV.filter((i) => !i.roles.includes('owner') || i.roles.includes('*'));
  return ROLE_NAV.filter((i) => i.roles.includes('*') || i.roles.includes(role));
}
