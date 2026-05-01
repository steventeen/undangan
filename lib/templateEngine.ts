import { EventData } from '../types';

/**
 * Render HTML template with dynamic data
 */
export function renderInvitation(templateHtml: string, eventData: Partial<EventData>): string {
  if (!templateHtml) return '';

  const placeholders: Record<string, string> = {
    '{{nama_pria}}': eventData.groom_name || 'Nama Pria',
    '{{nama_wanita}}': eventData.bride_name || 'Nama Wanita',
    '{{tanggal}}': eventData.event_date || 'Tanggal',
    '{{waktu}}': eventData.event_time || 'Waktu',
    '{{alamat}}': eventData.venue || 'Alamat Venue',
    '{{link_maps}}': eventData.maps_link || '#',
    '{{story}}': eventData.story || 'Kisah cinta kami...',
    '{{nomor_whatsapp}}': eventData.whatsapp_number || '',
  };

  let renderedHtml = templateHtml;

  for (const [key, value] of Object.entries(placeholders)) {
    // Avoid XSS for normal text but allow links to work in href.
    // In a real production system, sanitize HTML specifically.
    const safeValue = value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // For maps_link and whatsapp_number which might be in href attributes, 
    // we should use the raw string.
    const finalValue = (key === '{{link_maps}}' || key === '{{nomor_whatsapp}}') ? value : safeValue;
    
    const regex = new RegExp(key, 'g');
    renderedHtml = renderedHtml.replace(regex, finalValue);
  }

  return renderedHtml;
}

/**
 * Generate a unique slug based on groom and bride names
 */
export function generateUniqueSlug(groom: string, bride: string): string {
  const sanitize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const base = `${sanitize(groom)}-${sanitize(bride)}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}-${randomSuffix}`;
}

/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const year = new Date().getFullYear();
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `INV/${year}/${randomPart}`;
}

/**
 * Validate if all required placeholders are present in the HTML template
 */
export function validatePlaceholders(html: string, requiredPlaceholders: string[]): boolean {
  if (!html) return false;
  
  for (const placeholder of requiredPlaceholders) {
    if (!html.includes(placeholder)) {
      return false;
    }
  }
  return true;
}
