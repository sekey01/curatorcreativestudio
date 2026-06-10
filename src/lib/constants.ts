import type {
  FrameType,
  FrameSize,
  EdgeType,
  LaminationType,
  PrintMethod,
  ShirtItemType,
  GiftProductType,
  OccasionType,
} from '../types';

export const FRAME_TYPES: FrameType[] = [
  'Foreign Frame',
  'Local Frame',
  'Wooden Frame',
  'Canvas Art',
  'Pencil Art',
  'Customized Clock',
  'Citation',
  'Certificate',
];

export const FRAME_SIZES: FrameSize[] = ['8×10', '10×12', '12×16', '16×20', '20×24', '24×30'];

export const EDGE_TYPES: EdgeType[] = ['No Edge', 'With Edge'];

export const LAMINATION_TYPES: LaminationType[] = ['Crystal', 'Glossy', '3D', 'Canvas', 'None'];

export const PRINT_METHODS: PrintMethod[] = ['Embroidery', 'DTF (Direct to Fabric)', 'Sublimation', 'Screen Printing'];

export const SHIRT_ITEM_TYPES: ShirtItemType[] = ['Plain T-Shirt', 'Lacoste', 'Jersey', 'Lab Coat', 'Apron', 'Tote Bag'];

export const GIFT_PRODUCT_TYPES: GiftProductType[] = [
  'Magic Mug',
  'Plain Mug',
  'Key Holder',
  'Name Tag',
  'Plaque/Award',
  '3D Signage',
  'Custom Hand Fan',
  'Custom Pillow',
  'UV Diary',
  'UV Water Bottle',
];

export const OCCASION_TYPES: OccasionType[] = ['Birthday', 'Wedding', 'Party', 'Funeral', 'Ceremony', 'Other'];
