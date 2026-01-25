
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '') 
    .replace(/(\s+)/g, '-') 
    .replace(/-+/g, '-') 
    .replace(/^-+|-+$/g, ''); 
};

/**
 * Định dạng ngày tháng (Ví dụ: 2026-01-22 -> 22/01/2026)
 * Hỗ trợ cả Unix timestamp (number) và date string
 */
export const formatDate = (dateInput: string | number): string => {
  let date: Date;
  
  if (typeof dateInput === 'number') {
    // Unix timestamp (seconds) - convert to milliseconds
    date = new Date(dateInput * 1000);
  } else {
    date = new Date(dateInput);
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  return date.toLocaleDateString('vi-VN');
};