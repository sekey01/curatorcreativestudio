import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  setDoc,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Order, OrderStatus, PortfolioImage, Comment, PortfolioCategory, PricingConfig } from '../types';

// ── Portfolio ──────────────────────────────────────────────────────────────

export function subscribeToPortfolio(
  onData: (images: PortfolioImage[]) => void,
  category?: PortfolioCategory,
): Unsubscribe {
  const col = collection(db, 'portfolio');
  const q = category
    ? query(col, where('category', '==', category), orderBy('createdAt', 'desc'))
    : query(col, orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snap) => {
    const images = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PortfolioImage));
    onData(images);
  });
}

export function subscribeToRecentPortfolio(
  onData: (images: PortfolioImage[]) => void,
  limitCount = 6,
): Unsubscribe {
  const col = collection(db, 'portfolio');
  const q = query(col, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const images = snap.docs
      .slice(0, limitCount)
      .map((d) => ({ id: d.id, ...d.data() } as PortfolioImage));
    onData(images);
  });
}

export async function addPortfolioImage(
  data: Omit<PortfolioImage, 'id' | 'createdAt'>,
): Promise<string> {
  const ref = await addDoc(collection(db, 'portfolio'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deletePortfolioImage(id: string): Promise<void> {
  await deleteDoc(doc(db, 'portfolio', id));
}

// ── Comments ───────────────────────────────────────────────────────────────

export function subscribeToComments(
  imageId: string,
  onData: (comments: Comment[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, 'comments'),
    where('imageId', '==', imageId),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, (snap) => {
    const comments = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Comment));
    onData(comments);
  });
}

export function subscribeToRecentComments(
  onData: (comments: Comment[]) => void,
  limitCount = 5,
): Unsubscribe {
  const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const comments = snap.docs
      .slice(0, limitCount)
      .map((d) => ({ id: d.id, ...d.data() } as Comment));
    onData(comments);
  });
}

export async function addComment(
  data: Omit<Comment, 'id' | 'createdAt'>,
): Promise<void> {
  await addDoc(collection(db, 'comments'), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// ── Orders ─────────────────────────────────────────────────────────────────

export function subscribeToOrders(onData: (orders: Order[]) => void): Unsubscribe {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
    onData(orders);
  });
}

export async function addOrder(data: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const ref = await addDoc(collection(db, 'orders'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await updateDoc(doc(db, 'orders', id), { status });
}

// ── Pricing ────────────────────────────────────────────────────────────────

const PRICING_DOC = doc(db, 'settings', 'pricing');

export function subscribeToPricing(onData: (pricing: PricingConfig | null) => void): Unsubscribe {
  return onSnapshot(PRICING_DOC, (snap) => {
    onData(snap.exists() ? (snap.data() as PricingConfig) : null);
  });
}

export async function savePricing(pricing: PricingConfig): Promise<void> {
  await setDoc(PRICING_DOC, pricing);
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function formatTimestamp(ts: Timestamp | undefined): string {
  if (!ts) return '—';
  return ts.toDate().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
