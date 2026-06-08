import { Timestamp } from 'firebase/firestore';

export type OrderType = 'photoshoot' | 'frame' | 'shirt' | 'gift';
export type OrderStatus = 'pending' | 'in_progress' | 'completed';

export type PortfolioCategory =
  | 'Photoshoots'
  | 'Frames & Prints'
  | 'Shirt Printing'
  | 'Gifts & Merch';

// ── Portfolio ──────────────────────────────────────────────────────────────

export interface PortfolioImage {
  id: string;
  title: string;
  description: string;
  category: PortfolioCategory;
  imageUrl: string;
  storagePath: string;
  createdAt: Timestamp;
}

// ── Comments ───────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  imageId: string;
  name: string;
  message: string;
  createdAt: Timestamp;
}

// ── Orders ─────────────────────────────────────────────────────────────────

export interface BaseOrder {
  id: string;
  name: string;
  phone: string;
  orderType: OrderType;
  status: OrderStatus;
  createdAt: Timestamp;
  additionalNotes?: string;
}

export interface PhotoshootOrder extends BaseOrder {
  orderType: 'photoshoot';
  occasionType: string;
  eventDate: string;
  eventLocation: string;
}

export type FrameType =
  | 'Foreign Frame'
  | 'Local Frame'
  | 'Wooden Frame'
  | 'Canvas Art'
  | 'Pencil Art'
  | 'Customized Clock'
  | 'Citation'
  | 'Certificate';

export type FrameSize =
  | '8×10'
  | '10×12'
  | '12×16'
  | '16×20'
  | '20×24'
  | '24×30';

export type EdgeType = 'No Edge' | 'With Edge';
export type LaminationType = 'Crystal' | 'Glossy' | '3D' | 'Canvas' | 'None';

export interface FrameOrder extends BaseOrder {
  orderType: 'frame';
  frameType: FrameType;
  size: FrameSize;
  edgeType: EdgeType;
  lamination: LaminationType;
  quantity: number;
  expressDelivery: boolean;
}

export type PrintMethod = 'Embroidery' | 'DTF (Direct to Fabric)' | 'Sublimation' | 'Screen Printing';
export type ShirtItemType = 'Plain T-Shirt' | 'Lacoste' | 'Jersey' | 'Lab Coat' | 'Apron' | 'Tote Bag';

export interface ShirtOrder extends BaseOrder {
  orderType: 'shirt';
  printMethods: PrintMethod[];
  itemTypes: ShirtItemType[];
  quantity: number;
  sizesNeeded: string;
  designDescription: string;
}

export type GiftProductType =
  | 'Magic Mug'
  | 'Plain Mug'
  | 'Key Holder'
  | 'Name Tag'
  | 'Plaque/Award'
  | '3D Signage'
  | 'Custom Hand Fan'
  | 'Custom Pillow'
  | 'UV Diary'
  | 'UV Water Bottle';

export interface GiftOrder extends BaseOrder {
  orderType: 'gift';
  productTypes: GiftProductType[];
  quantity: number;
  neededByDate: string;
  customizationDetails: string;
}

export type Order = PhotoshootOrder | FrameOrder | ShirtOrder | GiftOrder;

// ── Auth ───────────────────────────────────────────────────────────────────

export interface AdminUser {
  uid: string;
  email: string | null;
}
