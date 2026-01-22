// Color Palette
export const COLORS = {
  // Primary color - Highlight
  PRIMARY: '#007ee1',
  
  // Error color
  ERROR: '#bc738c',
  
  // Background color
  BACKGROUND: '#f3f7fa',
} as const;

// Roles
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

// Post Status
export const POST_STATUS = {
  PUBLISHED: 'published',
  DRAFT: 'draft',
  PENDING: 'pending',
} as const;
