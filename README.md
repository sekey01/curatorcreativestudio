# Curator Creative Studio

A full-stack web application for a creative services business in Ghana. Built with React, TypeScript, Vite, Firebase, and Tailwind CSS.

## Features

- **Public site**: Home, Portfolio/Gallery, Order forms, Contact
- **Gallery** with category filtering, masonry layout, lightbox, and real-time comments
- **Order system**: 4 service types — Photoshoot Booking, Frame/Print, Shirt Printing, Gifts & Merch
- **Admin panel**: Protected dashboard, order management, gallery uploader with drag-and-drop
- Real-time Firestore listeners throughout
- Firebase Storage for portfolio images
- Firebase Auth (email/password) for admin access

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Firebase v11 (Firestore, Auth, Storage)
- React Router v6
- Lucide React icons
- React Hot Toast

---

## Setup Instructions

### 1. Install dependencies

```bash
cd curatorcreativestudio
npm install
```

### 2. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable the following services:
   - **Firestore Database** (start in production mode)
   - **Firebase Storage** (start in production mode)
   - **Authentication** → Enable **Email/Password** provider

### 3. Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your Firebase project credentials (found in Project Settings → General → Your apps → Firebase SDK snippet):

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 4. Set up Firestore Security Rules

In Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /portfolio/{imageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /comments/{commentId} {
      allow read, create: if true;
      allow update, delete: if request.auth != null;
    }
    match /orders/{orderId} {
      allow create: if true;
      allow read, update: if request.auth != null;
    }
  }
}
```

### 5. Set up Firebase Storage Rules

In Firebase Console → Storage → Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /portfolio/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 6. Create the first admin account

Firebase Auth does not allow public registration in this app. Create the admin account manually:

1. Go to Firebase Console → Authentication → Users
2. Click **Add user**
3. Enter an email and strong password
4. This account can now log in at `/admin/login`

### 7. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 8. Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── admin/       # OrderRow, ImageUploader, StatusBadge
│   ├── gallery/     # ImageCard, ImageModal, CommentSection
│   ├── layout/      # Navbar, Footer, AdminLayout
│   ├── order/       # PhotoshootForm, FrameForm, ShirtForm, GiftForm
│   └── ui/          # Button, Input, Select, Chip, Badge, Modal, Skeleton, Textarea
├── context/
│   └── AuthContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useComments.ts
│   ├── useOrders.ts
│   └── usePortfolio.ts
├── lib/
│   ├── firebase.ts
│   ├── firestore.ts
│   └── storage.ts
├── pages/
│   ├── Home.tsx
│   ├── Gallery.tsx
│   ├── Order.tsx
│   ├── Contact.tsx
│   └── admin/
│       ├── Login.tsx
│       ├── Dashboard.tsx
│       ├── Orders.tsx
│       └── GalleryManager.tsx
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

---

## Firestore Data Model

### `portfolio/{imageId}`
```json
{
  "title": "Birthday Photoshoot",
  "category": "Photoshoots",
  "imageUrl": "https://firebasestorage...",
  "storagePath": "portfolio/1234_image.jpg",
  "createdAt": "<Timestamp>"
}
```

### `comments/{commentId}`
```json
{
  "imageId": "<portfolioImageId>",
  "name": "Kwame",
  "message": "Amazing work!",
  "createdAt": "<Timestamp>"
}
```

### `orders/{orderId}`
```json
{
  "name": "Ama Mensah",
  "phone": "+233551234567",
  "orderType": "photoshoot",
  "status": "pending",
  "createdAt": "<Timestamp>"
}
```

---

## WhatsApp

The WhatsApp number used throughout is `+233553767177`.
To update it, search `wa.me/233553767177` and replace across the codebase.
