import DOMPurify from 'isomorphic-dompurify';

/**
 * Renders the final HTML invitation by replacing placeholders with actual data.
 * @param template The HTML template string with {{placeholder}} tags
 * @param data The event data object
 * @returns Sanitized HTML string
 */
export function renderInvitation(template: string, data: Record<string, any>): string {
  let rendered = template;

  // Replace all placeholders
  Object.keys(data).forEach((key) => {
    const value = data[key] || '';
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, String(value));
  });

  // Basic cleanup for any remaining placeholders
  rendered = rendered.replace(/{{[a-zA-Z0-9_]+}}/g, '');

  return DOMPurify.sanitize(rendered, {
    ADD_TAGS: ['style', 'link', 'iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'rel', 'href'],
    FORCE_BODY: true,
  });
}

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV/${year}${month}${day}/${random}`;
}

export function generateUniqueSlug(base: string): string {
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const random = Math.random().toString(36).substring(2, 7);
  return `${slug}-${random}`;
}
