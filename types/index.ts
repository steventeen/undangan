export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail_url: string | null;
  html_template: string;
  css_custom: string | null;
  price: number;
  is_active: boolean;
  created_at: string;
}

export interface EventData {
  groom_name: string;
  bride_name: string;
  event_date: string;
  event_time: string;
  venue: string;
  maps_link: string;
  story: string;
  whatsapp_number: string;
}

export interface Order {
  id: string;
  order_number: string;
  template_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  event_data: EventData;
  unique_slug: string;
  payment_proof_url: string | null;
  payment_status: 'unpaid' | 'pending' | 'verified';
  design_status: 'pending' | 'generated' | 'failed';
  final_html_url: string | null;
  created_at: string;
  updated_at: string;
  template?: Template; // Optional joined relation
}
