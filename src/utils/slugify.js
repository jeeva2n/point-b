// src/utils/slugify.js

export const slugify = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
};

export const findProductBySlug = (products, slug) => {
  if (!products || !slug) return null;
  
  return products.find(product => {
    const productSlug = slugify(product.name);
    return productSlug === slug;
  });
};