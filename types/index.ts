export type Plan = 'free' | 'pro' | 'premium';
export type EventCategory = 'wedding' | 'birthday' | 'seminar' | 'syukuran' | 'corporate' | 'memorial';
export type GuestStatus = 'pending' | 'sent' | 'clicked' | 'rsvp_yes' | 'rsvp_no';
export type AttendanceStatus = 'yes' | 'no' | 'maybe';
export type TransactionStatus = 'pending' | 'success' | 'failed' | 'refunded';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  plan_expires_at: string | null;
  referral_code: string;
  referred_by: string | null;
  invitation_quota: number;
  ai_credits: number;
  created_at: string;
  updated_at: string;
}

export interface InvitationSettings {
  music_url: string | null;
  music_autoplay: boolean;
  primary_color: string;
  font: string;
  language: 'id' | 'en';
  show_countdown: boolean;
  show_rsvp: boolean;
  show_guestbook: boolean;
  show_gift: boolean;
  viral_footer: boolean;
  cover_image?: string | null;
  couple_image?: string | null;
}

export interface InvitationSection {
  id: string;
  type: 'cover' | 'couple' | 'event' | 'gallery' | 'rsvp' | 'guestbook' | 'gift' | 'closing';
  enabled: boolean;
  order: number;
  data: Record<string, any>;
}

export interface Invitation {
  id: string;
  user_id: string;
  template_id: string | null;
  title: string;
  slug: string;
  category: EventCategory;
  is_published: boolean;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
  location_url: string | null;
  sections: InvitationSection[];
  settings: InvitationSettings;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Guest {
  id: string;
  invitation_id: string;
  name: string;
  phone: string | null;
  unique_token: string;
  status: GuestStatus;
  clicked_at: string | null;
  created_at: string;
}

export interface RSVP {
  id: string;
  invitation_id: string;
  guest_id: string | null;
  guest_name: string;
  phone: string | null;
  attendance: AttendanceStatus;
  guest_count: number;
  message: string | null;
  created_at: string;
}

export interface GuestbookEntry {
  id: string;
  invitation_id: string;
  name: string;
  message: string;
  created_at: string;
}

export interface Template {
  id: string;
  creator_id: string | null;
  name: string;
  description: string | null;
  category: EventCategory;
  is_premium: boolean;
  is_active: boolean;
  price: number;
  thumbnail_url: string | null;
  config_json: TemplateConfig;
  sold_count: number;
  created_at: string;
}

export interface TemplateConfig {
  theme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    font_heading: string;
    font_body: string;
  };
  animation: 'fade' | 'slide' | 'zoom' | 'none';
  layout: 'full-scroll' | 'split' | 'card' | 'parallax';
  sections: string[];
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'subscription' | 'template_purchase' | 'ai_credits';
  amount: number;
  status: TransactionStatus;
  payment_gateway: string | null;
  external_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

// Dashboard stats
export interface DashboardStats {
  total_invitations: number;
  total_views: number;
  total_rsvp: number;
  total_guests: number;
  rsvp_yes: number;
  rsvp_no: number;
  rsvp_maybe: number;
}
