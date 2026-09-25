export interface ProductSpecification {
  key: string;
  value: string;
}

export interface DbProduct {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  short_description: string;
  description: string;
  image_url: string;
  price_range?: string;
  specifications: ProductSpecification[];
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbTestimonial {
  id: string;
  customer_name: string;
  company: string;
  designation: string;
  profile_image_url?: string;
  testimonial: string;
  rating: number; // 1 to 5
  youtube_url?: string;
  youtube_video_id?: string;
  embed_url?: string;
  thumbnail_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type PromotionVideoSize = "wide" | "standard" | "compact" | "tall";

export interface DbPromotionVideo {
  id: string;
  title: string;
  youtube_url: string;
  youtube_video_id: string;
  thumbnail_url: string;
  embed_url: string;
  description: string;
  size?: PromotionVideoSize; // "wide" (21:9) | "standard" (16:9) | "compact" (16:10) | "tall" (4:3)
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type EnquiryStatus = "NEW" | "CONTACTED" | "IN_PROGRESS" | "CONVERTED" | "CLOSED";

export interface EnquiryMessage {
  id: string;
  enquiry_id: string;
  sender: "CUSTOMER" | "ADMIN";
  sender_name: string;
  sender_email: string;
  message: string;
  is_internal?: boolean; // True for internal staff notes
  timestamp: string;
  delivery_status?: "PENDING" | "SENT" | "FAILED" | "DELIVERED";
  email_message_id?: string;
  error_message?: string;
}

export interface DbEnquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  company?: string;
  product_id?: string;
  subject?: string;
  message: string;
  source?: string; // e.g. "Home Page Contact", "Contact Page RFQ", "Product Catalog Modal"
  status: EnquiryStatus;
  created_at: string;
  updated_at: string;
  notes?: string;
  conversation?: EnquiryMessage[];
  last_reply_at?: string;
  unread_by_admin?: boolean;
  email_delivery_status?: "SENT" | "FAILED" | "PENDING";
}

export interface DbGalleryImage {
  id: string;
  url: string;
  caption: string;
  category: "depots" | "equipment" | "delivery" | "field" | "products" | "other";
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminMediaAsset {

  id: string;
  url: string;
  publicId?: string;
  name: string;
  sizeBytes?: number;
  format?: string;
  createdAt: string;
}

export interface AdminSettings {
  companyName: string;
  phone: string;
  phoneRaw: string;
  email: string;
  address: string;
  whatsappNumber: string;
  googleMapsUrl: string;
}

// Aliases for unified naming
export type AdminProduct = DbProduct;
export type AdminTestimonial = DbTestimonial;
export type AdminPromotionVideo = DbPromotionVideo;
export type AdminEnquiry = DbEnquiry;
