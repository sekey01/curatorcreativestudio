import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Frame, Shirt, Gift, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ImageCardSkeleton } from '../components/ui/Skeleton';
import { ImageModal } from '../components/gallery/ImageModal';
import { useRecentPortfolio } from '../hooks/usePortfolio';
import { useRecentComments } from '../hooks/useComments';
import { formatTimestamp } from '../lib/firestore';
import curatorCeoPhoto from '../assets/curatorceo.jpeg';
import type { PortfolioImage } from '../types';

const SERVICES = [
  {
    icon: Camera,
    title: 'Photoshoot Booking',
    description: 'Professional photography for birthdays, weddings, ceremonies, and every special moment.',
    tab: 'photoshoot',
  },
  {
    icon: Frame,
    title: 'Frame & Print Orders',
    description: 'Custom frames, canvas art, citations, certificates, and personalized clocks in premium finishes.',
    tab: 'frame',
  },
  {
    icon: Shirt,
    title: 'Shirt Printing',
    description: 'Embroidery, DTF, sublimation, and screen printing on t-shirts, jerseys, lab coats, and more.',
    tab: 'shirt',
  },
  {
    icon: Gift,
    title: 'Gifts & Merch',
    description: 'Magic mugs, custom pillows, plaques, 3D signage, hand fans, and unique personalized gifts.',
    tab: 'gift',
  },
];

/* ── Futuristic Camera–Person Scene ─────────────────────────────────────── */
function HeroScene() {
  return (
    <svg
      viewBox="0 0 480 490"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="glow-sm" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-md" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-lg" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="9" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        <radialGradient id="lens-grad" cx="38%" cy="38%" r="62%">
          <stop offset="0%"   style={{ stopColor: 'var(--svg-stroke-dim)',   stopOpacity: 1 }}/>
          <stop offset="55%"  style={{ stopColor: 'var(--svg-stroke-faint)', stopOpacity: 1 }}/>
          <stop offset="100%" style={{ stopColor: 'var(--svg-cam-bg)',       stopOpacity: 0.95 }}/>
        </radialGradient>

        <linearGradient id="cam-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   style={{ stopColor: 'var(--svg-cam-bg-alt)' }}/>
          <stop offset="100%" style={{ stopColor: 'var(--svg-cam-bg)' }}/>
        </linearGradient>

        <radialGradient id="flash-burst" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   style={{ stopColor: 'var(--svg-bright)', stopOpacity: 0.95 }}/>
          <stop offset="40%"  style={{ stopColor: 'var(--svg-bright)', stopOpacity: 0.4 }}/>
          <stop offset="100%" style={{ stopColor: 'var(--svg-bright)', stopOpacity: 0 }}/>
        </radialGradient>

        <linearGradient id="person-scan" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   style={{ stopColor: 'var(--svg-stroke-faint)', stopOpacity: 1 }}/>
          <stop offset="100%" style={{ stopColor: 'var(--svg-bright)',       stopOpacity: 0 }}/>
        </linearGradient>
      </defs>

      {/* Background ambient dots */}
      <circle cx="30"  cy="60"  r="1.2" fill="var(--svg-stroke)" opacity="0.25"><animate attributeName="opacity" values="0.25;0.6;0.25" dur="3.1s" repeatCount="indefinite"/></circle>
      <circle cx="200" cy="30"  r="1"   fill="var(--svg-stroke)" opacity="0.2"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="4.2s" repeatCount="indefinite"/></circle>
      <circle cx="52"  cy="400" r="1.5" fill="var(--svg-stroke)" opacity="0.2"><animate attributeName="opacity" values="0.2;0.55;0.2" dur="2.8s" repeatCount="indefinite"/></circle>
      <circle cx="245" cy="460" r="1"   fill="var(--svg-stroke)" opacity="0.15"><animate attributeName="opacity" values="0.15;0.4;0.15" dur="5s" repeatCount="indefinite"/></circle>
      <circle cx="460" cy="140" r="1.2" fill="var(--svg-stroke)" opacity="0.2"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="3.7s" repeatCount="indefinite"/></circle>
      <circle cx="455" cy="440" r="1"   fill="var(--svg-stroke)" opacity="0.15"><animate attributeName="opacity" values="0.15;0.35;0.15" dur="6s" repeatCount="indefinite"/></circle>

      {/* ═══ FLOATING CAMERA (centered around 120, 248) ═══════════════════ */}
      <g className="camera-float-anim">

        {/* Ambient halo */}
        <circle cx="120" cy="248" r="58" fill="var(--svg-fill-ghost)"/>
        <circle cx="120" cy="248" r="46" fill="var(--svg-fill-dim)"/>

        {/* Camera body */}
        <rect x="76" y="220" width="88" height="56" rx="8"
          fill="url(#cam-body)" stroke="var(--svg-stroke)" strokeWidth="1.6"
          filter="url(#glow-sm)"/>

        {/* Body etch lines */}
        <line x1="104" y1="220" x2="104" y2="276" stroke="var(--svg-stroke-faint)" strokeWidth="0.5"/>
        <line x1="136" y1="220" x2="136" y2="276" stroke="var(--svg-stroke-faint)" strokeWidth="0.5"/>
        <rect x="80" y="224" width="86" height="48" rx="6" fill="none" stroke="var(--svg-stroke-ghost)" strokeWidth="0.5"/>

        {/* Viewfinder bump */}
        <rect x="90" y="207" width="26" height="14" rx="4"
          fill="url(#cam-body)" stroke="var(--svg-stroke)" strokeWidth="1.2"/>
        <rect x="94" y="211" width="9" height="4" rx="1.5" fill="var(--svg-fill-med)"/>

        {/* Flash unit */}
        <rect x="124" y="208" width="16" height="8" rx="3"
          fill="var(--svg-cam-bg)" stroke="var(--svg-stroke)" strokeWidth="1">
          <animate attributeName="fill" values="var(--svg-cam-bg);rgba(255,248,200,0.4);var(--svg-cam-bg)" dur="10s" repeatCount="indefinite"/>
        </rect>

        {/* Shutter button */}
        <circle cx="164" cy="207" r="5.5" fill="var(--svg-cam-bg)" stroke="var(--svg-stroke)" strokeWidth="1.2"/>
        <circle cx="164" cy="207" r="3" fill="var(--svg-fill-med)"/>

        {/* Status LED */}
        <circle cx="158" cy="219" r="3.5" fill="var(--svg-bright)" filter="url(#glow-sm)">
          <animate attributeName="opacity" values="1;0.15;1" dur="1.4s" repeatCount="indefinite"/>
        </circle>

        {/* Lens housing */}
        <circle cx="120" cy="248" r="24" fill="var(--svg-cam-bg)" stroke="var(--svg-stroke)" strokeWidth="2"
          filter="url(#glow-sm)">
          <animate attributeName="r" values="24;25.5;24" dur="2.2s" repeatCount="indefinite"/>
        </circle>

        {/* Lens face */}
        <circle cx="120" cy="248" r="18" fill="url(#lens-grad)"/>

        {/* Inner aperture rings */}
        <circle cx="120" cy="248" r="12" fill="none" stroke="var(--svg-fill-med)" strokeWidth="1.2"/>
        <circle cx="120" cy="248" r="7"  fill="var(--svg-fill-slight)"/>

        {/* Lens reflection highlight */}
        <ellipse cx="112" cy="240" rx="5" ry="3" fill="var(--svg-fill-med)" transform="rotate(-28 112 240)"/>

        {/* Lens center iris */}
        <circle cx="120" cy="248" r="3" fill="var(--svg-bright)" filter="url(#glow-md)">
          <animate attributeName="r"       values="3;4.5;3"   dur="1.6s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.5;1"   dur="1.6s" repeatCount="indefinite"/>
        </circle>

        {/* Outer pulse ring */}
        <circle cx="120" cy="248" r="24" fill="none" stroke="var(--svg-stroke)" strokeWidth="1" opacity="0.35">
          <animate attributeName="r"       values="24;36;24"   dur="2.2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.35;0;0.35" dur="2.2s" repeatCount="indefinite"/>
        </circle>

        {/* Slower pulse ring */}
        <circle cx="120" cy="248" r="24" fill="none" stroke="var(--svg-stroke-dim)" strokeWidth="0.8" opacity="0.2">
          <animate attributeName="r"       values="24;44;24"    dur="3.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.2;0;0.2"   dur="3.5s" repeatCount="indefinite"/>
        </circle>

        {/* Orbit ring */}
        <ellipse cx="120" cy="248" rx="38" ry="9" fill="none"
          stroke="var(--svg-stroke-mid)" strokeWidth="1" strokeDasharray="3 7">
          <animateTransform attributeName="transform" type="rotate"
            from="0 120 248" to="360 120 248" dur="7s" repeatCount="indefinite"/>
        </ellipse>

        {/* HUD corner brackets */}
        <path d="M78,222 L78,232 M78,222 L88,222"   stroke="var(--svg-stroke)" strokeWidth="1"   fill="none" opacity="0.7"/>
        <path d="M162,222 L162,232 M162,222 L152,222" stroke="var(--svg-stroke)" strokeWidth="1" fill="none" opacity="0.7"/>
        <path d="M78,274 L78,264 M78,274 L88,274"   stroke="var(--svg-stroke)" strokeWidth="1"   fill="none" opacity="0.7"/>
        <path d="M162,274 L162,264 M162,274 L152,274" stroke="var(--svg-stroke)" strokeWidth="1" fill="none" opacity="0.7"/>

        {/* Camera data readout */}
        <text x="76" y="292" fontSize="6.5" fill="var(--svg-text)" fontFamily="monospace" opacity="0.9">FOCUS ● AUTO</text>
        <text x="76" y="303" fontSize="6.5" fill="var(--svg-text)" fontFamily="monospace" opacity="0.8">ISO 1600  1/500s</text>
        <text x="76" y="314" fontSize="6.5" fill="var(--svg-text)" fontFamily="monospace" opacity="0.7">f/2.8  RAW+JPEG</text>
      </g>

      {/* ═══ FLASH RAYS ════════════════════════════════════════════════════ */}
      <g className="flash-rays-anim">
        <circle cx="120" cy="248" r="50" fill="url(#flash-burst)" opacity="0.55"/>
        <circle cx="120" cy="248" r="28" fill="var(--svg-fill-med)"/>

        <line x1="145" y1="226" x2="265" y2="118" stroke="var(--svg-bright)" strokeWidth="2.2" opacity="0.8"/>
        <line x1="148" y1="248" x2="280" y2="192" stroke="var(--svg-bright)" strokeWidth="2.8" opacity="0.95"/>
        <line x1="145" y1="270" x2="265" y2="368" stroke="var(--svg-bright)" strokeWidth="2.2" opacity="0.8"/>
        <line x1="142" y1="234" x2="252" y2="98"  stroke="var(--svg-bright)" strokeWidth="1.4" opacity="0.5"/>
        <line x1="142" y1="262" x2="252" y2="395" stroke="var(--svg-bright)" strokeWidth="1.4" opacity="0.5"/>
        <line x1="148" y1="245" x2="290" y2="148" stroke="var(--svg-bright)" strokeWidth="1"   opacity="0.35"/>
        <line x1="148" y1="251" x2="290" y2="345" stroke="var(--svg-bright)" strokeWidth="1"   opacity="0.35"/>
      </g>

      {/* ═══ DOTTED CONNECTION LINES ════════════════════════════════════════ */}

      {/* Top fan line */}
      <path d="M 164,232 C 242,168 292,110 334,82"
        fill="none" stroke="var(--svg-stroke)" strokeWidth="1.3" strokeDasharray="5 4.5" opacity="0.65">
        <animate attributeName="stroke-dashoffset" from="9.5" to="0" dur="4s" repeatCount="indefinite"/>
      </path>

      {/* Middle line */}
      <path d="M 164,248 C 252,248 305,222 334,196"
        fill="none" stroke="var(--svg-stroke)" strokeWidth="1.9" strokeDasharray="5 4.5" opacity="0.9">
        <animate attributeName="stroke-dashoffset" from="9.5" to="0" dur="2.2s" repeatCount="indefinite"/>
      </path>

      {/* Bottom fan line */}
      <path d="M 164,264 C 242,312 292,362 334,374"
        fill="none" stroke="var(--svg-stroke)" strokeWidth="1.3" strokeDasharray="5 4.5" opacity="0.65">
        <animate attributeName="stroke-dashoffset" from="9.5" to="0" dur="4.8s" repeatCount="indefinite"/>
      </path>

      {/* ═══ LIGHT PARTICLES ════════════════════════════════════════════════ */}

      {/* Top path */}
      <circle r="3" fill="var(--svg-bright)" filter="url(#glow-sm)">
        <animateMotion dur="2.8s" repeatCount="indefinite"
          path="M 164,232 C 242,168 292,110 334,82"/>
        <animate attributeName="opacity" values="0;0.95;0.95;0" keyTimes="0;0.08;0.9;1" dur="2.8s" repeatCount="indefinite"/>
      </circle>
      <circle r="2" fill="var(--svg-bright)">
        <animateMotion dur="2.8s" begin="1.4s" repeatCount="indefinite"
          path="M 164,232 C 242,168 292,110 334,82"/>
        <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.08;0.9;1" dur="2.8s" begin="1.4s" repeatCount="indefinite"/>
      </circle>

      {/* Middle path */}
      <circle r="4.5" fill="var(--svg-bright)" filter="url(#glow-md)">
        <animateMotion dur="1.9s" repeatCount="indefinite"
          path="M 164,248 C 252,248 305,222 334,196"/>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.07;0.88;1" dur="1.9s" repeatCount="indefinite"/>
      </circle>
      <circle r="2.5" fill="var(--svg-bright)">
        <animateMotion dur="1.9s" begin="0.63s" repeatCount="indefinite"
          path="M 164,248 C 252,248 305,222 334,196"/>
        <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.07;0.88;1" dur="1.9s" begin="0.63s" repeatCount="indefinite"/>
      </circle>
      <circle r="3" fill="var(--svg-bright)">
        <animateMotion dur="1.9s" begin="1.26s" repeatCount="indefinite"
          path="M 164,248 C 252,248 305,222 334,196"/>
        <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.07;0.88;1" dur="1.9s" begin="1.26s" repeatCount="indefinite"/>
      </circle>

      {/* Bottom path */}
      <circle r="3" fill="var(--svg-bright)" filter="url(#glow-sm)">
        <animateMotion dur="3.2s" repeatCount="indefinite"
          path="M 164,264 C 242,312 292,362 334,374"/>
        <animate attributeName="opacity" values="0;0.95;0.95;0" keyTimes="0;0.08;0.9;1" dur="3.2s" repeatCount="indefinite"/>
      </circle>
      <circle r="2" fill="var(--svg-bright)">
        <animateMotion dur="3.2s" begin="1.6s" repeatCount="indefinite"
          path="M 164,264 C 242,312 292,362 334,374"/>
        <animate attributeName="opacity" values="0;0.75;0.75;0" keyTimes="0;0.08;0.9;1" dur="3.2s" begin="1.6s" repeatCount="indefinite"/>
      </circle>

      {/* ═══ PERSON WIREFRAME ═══════════════════════════════════════════════ */}
      <g>

        {/* Person scan glow backdrop */}
        <rect x="318" y="64" width="84" height="342" fill="url(#person-scan)" opacity="0.1" rx="4"/>

        {/* Scan line */}
        <rect x="318" y="64" width="84" height="2.5" fill="var(--svg-scan)" className="scan-line-anim"/>

        {/* Targeting HUD brackets */}
        <path d="M 318,64 L 318,80 M 318,64 L 334,64" stroke="var(--svg-stroke)" strokeWidth="1.8" fill="none">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite"/>
        </path>
        <path d="M 402,64 L 402,80 M 402,64 L 386,64" stroke="var(--svg-stroke)" strokeWidth="1.8" fill="none">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite"/>
        </path>
        <path d="M 318,406 L 318,390 M 318,406 L 334,406" stroke="var(--svg-stroke)" strokeWidth="1.8" fill="none">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite"/>
        </path>
        <path d="M 402,406 L 402,390 M 402,406 L 386,406" stroke="var(--svg-stroke)" strokeWidth="1.8" fill="none">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite"/>
        </path>

        {/* Center crosshair */}
        <line x1="354" y1="180" x2="366" y2="180" stroke="var(--svg-stroke)" strokeWidth="1" opacity="0.45"/>
        <line x1="360" y1="174" x2="360" y2="186" stroke="var(--svg-stroke)" strokeWidth="1" opacity="0.45"/>

        {/* HEAD */}
        <circle cx="360" cy="88" r="24"
          fill="var(--svg-fill-dim)" stroke="var(--svg-stroke)" strokeWidth="1.5"/>
        <circle cx="360" cy="88" r="16" fill="none" stroke="var(--svg-stroke-faint)" strokeWidth="0.5"/>
        <ellipse cx="352" cy="86" rx="3.5" ry="4" fill="none" stroke="var(--svg-stroke-dim)" strokeWidth="1"/>
        <ellipse cx="368" cy="86" rx="3.5" ry="4" fill="none" stroke="var(--svg-stroke-dim)" strokeWidth="1"/>
        <path d="M 354,97 Q 360,101 366,97" fill="none" stroke="var(--svg-stroke-dim)" strokeWidth="1" strokeLinecap="round"/>

        {/* Orbit targeting ring */}
        <circle cx="360" cy="88" r="32" fill="none"
          stroke="var(--svg-stroke-mid)" strokeWidth="1" strokeDasharray="2.5 6">
          <animateTransform attributeName="transform" type="rotate"
            from="0 360 88" to="360 360 88" dur="9s" repeatCount="indefinite"/>
        </circle>

        {/* NECK */}
        <line x1="360" y1="112" x2="360" y2="126" stroke="var(--svg-stroke-dim)" strokeWidth="2" strokeLinecap="round"/>

        {/* SHOULDERS */}
        <path d="M 330,128 Q 345,120 360,126 Q 375,120 390,128"
          fill="none" stroke="var(--svg-stroke-dim)" strokeWidth="1.5"/>

        {/* TORSO */}
        <path d="M 332,132 Q 360,124 388,132 L 384,224 Q 360,232 336,224 Z"
          fill="var(--svg-fill-dim)" stroke="var(--svg-stroke-dim)" strokeWidth="1.5"/>
        <line x1="360" y1="132" x2="360" y2="224" stroke="var(--svg-stroke-faint)" strokeWidth="0.5"/>
        <path d="M 348,128 L 356,138 L 364,128" fill="none" stroke="var(--svg-stroke-mid)" strokeWidth="0.8"/>

        {/* LEFT ARM */}
        <path d="M 334,148 Q 310,188 302,220"
          fill="none" stroke="var(--svg-stroke-dim)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="302" cy="220" r="5.5" fill="none" stroke="var(--svg-stroke-dim)" strokeWidth="1.2"/>

        {/* RIGHT ARM */}
        <path d="M 386,148 Q 410,188 418,220"
          fill="none" stroke="var(--svg-stroke-dim)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="418" cy="220" r="5.5" fill="none" stroke="var(--svg-stroke-dim)" strokeWidth="1.2"/>

        {/* LEFT LEG */}
        <path d="M 342,224 Q 336,286 330,344"
          fill="none" stroke="var(--svg-stroke-dim)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M 330,344 Q 322,356 314,360"
          fill="none" stroke="var(--svg-stroke-dim)" strokeWidth="1.5" strokeLinecap="round"/>

        {/* RIGHT LEG */}
        <path d="M 378,224 Q 384,286 390,344"
          fill="none" stroke="var(--svg-stroke-dim)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M 390,344 Q 398,356 406,360"
          fill="none" stroke="var(--svg-stroke-dim)" strokeWidth="1.5" strokeLinecap="round"/>

        {/* Dashed outline border */}
        <rect x="314" y="60" width="92" height="352" rx="4"
          fill="none" stroke="var(--svg-stroke-ghost)" strokeWidth="1" strokeDasharray="3 6"/>

        {/* HUD data labels */}
        <text x="408" y="74"  fontSize="7"   fill="var(--svg-text)" fontFamily="monospace" opacity="0.9" letterSpacing="0.5">SCANNING</text>
        <text x="408" y="86"  fontSize="6.5" fill="var(--svg-text)" fontFamily="monospace" opacity="0.7">ID: 7X-04</text>
        <text x="408" y="98"  fontSize="6.5" fill="var(--svg-text)" fontFamily="monospace" opacity="0.8">▶ LOCK ON</text>
        <text x="408" y="110" fontSize="6"   fill="var(--svg-text)" fontFamily="monospace" opacity="0.45">────────</text>
        <text x="408" y="120" fontSize="6"   fill="var(--svg-text)" fontFamily="monospace" opacity="0.55">
          <animate attributeName="opacity" values="0.55;1;0.55" dur="2s" repeatCount="indefinite"/>
          ● REC
        </text>
      </g>

      {/* CAPTURE ACTIVE label */}
      <text x="240" y="472" fontSize="7.5" fill="var(--svg-text)"
        fontFamily="monospace" opacity="0.5" textAnchor="middle" letterSpacing="3">
        ● CAPTURE ACTIVE ●
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite"/>
      </text>
    </svg>
  );
}

/* ── Home page ───────────────────────────────────────────────────────────── */
export function Home() {
  const { images, loading } = useRecentPortfolio(6);
  const { comments, loading: commentsLoading } = useRecentComments(5);
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center hero-pattern pt-16 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'var(--accent-subtle)' }}/>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'var(--accent-subtle)' }}/>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: text */}
            <div className="animate-slide-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full corner-brackets"
                style={{ background: 'var(--accent-subtle)', border: '1px solid var(--border)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }}/>
                <span className="text-xs font-medium tracking-widest uppercase"
                  style={{ color: 'var(--text-2)' }}>
                  Based in Ghana · Crafted with passion
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight animate-text-flicker"
                style={{ color: 'var(--text-1)' }}>
                We Create.{' '}
                <span className="glow-blue">We Capture.</span>
                <br />
                We Deliver.
              </h1>

              <p className="mt-6 text-base sm:text-lg leading-relaxed max-w-xl"
                style={{ color: 'var(--text-3)' }}>
                Premium photography, custom frames, shirt printing &amp; personalized gifts —
                crafted for every occasion.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/order">
                  <Button size="lg">
                    Place an Order <ArrowRight size={18}/>
                  </Button>
                </Link>
                <Link to="/gallery">
                  <Button size="lg" variant="outline">
                    View Our Work
                  </Button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="mt-12 flex gap-8">
                {[
                  { val: '500+', label: 'Sessions Shot' },
                  { val: '4.9★', label: 'Client Rating' },
                  { val: '100%', label: 'Satisfaction' },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <p className="text-2xl font-bold glow-blue">{val}</p>
                    <p className="text-xs uppercase tracking-widest mt-0.5"
                      style={{ color: 'var(--text-4)' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: camera-person animation + founder photo */}
            <div className="flex items-center justify-center animate-slide-right">
              <div className="relative w-full max-w-80 sm:max-w-96 lg:max-w-120 aspect-480/490">
                <HeroScene />

                {/* Floating founder photo card */}
                <div className="absolute bottom-2 left-0 sm:-left-6 w-24 sm:w-28 lg:w-32 animate-photo-float">
                  <div className="relative">
                    <div className="absolute -inset-2 rounded-2xl blur-lg" aria-hidden="true"
                      style={{ background: 'var(--accent-subtle)' }}/>
                    <div className="relative rounded-2xl overflow-hidden border-2 aspect-3/4"
                      style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-hover)' }}>
                      <img
                        src={curatorCeoPhoto}
                        alt="Founder of Curator Creative Studio"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full
                      text-[9px] font-semibold tracking-widest uppercase whitespace-nowrap"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
                      Founder
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section className="py-20 section-dark" style={{ borderTop: '1px solid var(--border-section)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge variant="category" className="mb-4">What We Do</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--text-1)' }}>Our Services</h2>
            <p className="mt-3 max-w-xl mx-auto" style={{ color: 'var(--text-3)' }}>
              From capturing your best moments to crafting custom gifts — we've got every occasion covered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map(({ icon: Icon, title, description, tab }) => (
              <Link
                key={tab}
                to={`/order?tab=${tab}`}
                className="group p-6 card-futuristic rounded-xl"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4
                  transition-all duration-300"
                  style={{ background: 'var(--accent-subtle)', border: '1px solid var(--border)' }}>
                  <Icon size={22} style={{ color: 'var(--text-1)' }}/>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-1)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-3)' }}>{description}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: 'var(--text-1)' }}>
                  Order Now <ArrowRight size={14}/>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Work ────────────────────────────────────────────────── */}
      <section className="py-20 section-deeper" style={{ borderTop: '1px solid var(--border-section)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-14">
            <div>
              <Badge variant="category" className="mb-3">Portfolio</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--text-1)' }}>Featured Work</h2>
            </div>
            <Link
              to="/gallery"
              className="hidden sm:flex items-center gap-1 text-sm font-medium transition-colors"
              style={{ color: 'var(--text-2)' }}
            >
              View All <ArrowRight size={14}/>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <ImageCardSkeleton key={i}/>)
              : images.length === 0
              ? (
                <div className="col-span-full py-16 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'var(--accent-subtle)', border: '1px solid var(--border)' }}>
                    <Camera size={28} style={{ color: 'var(--text-2)' }}/>
                  </div>
                  <p style={{ color: 'var(--text-3)' }}>Portfolio images will appear here once uploaded.</p>
                </div>
              )
              : images.map((img) => (
                <div
                  key={img.id}
                  className="group cursor-pointer rounded-xl overflow-hidden card-futuristic"
                  onClick={() => setSelectedImage(img)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedImage(img)}
                >
                  <div className="relative overflow-hidden aspect-4/3"
                    style={{ background: 'var(--bg-section)' }}>
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--text-1)' }}>{img.title}</h3>
                    <div className="mt-2">
                      <Badge variant="category">{img.category}</Badge>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link to="/gallery">
              <Button variant="outline" size="lg">
                View Full Gallery <ArrowRight size={16}/>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-20 section-dark" style={{ borderTop: '1px solid var(--border-section)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge variant="category" className="mb-3">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--text-1)' }}>What People Say</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {commentsLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-6 card-futuristic rounded-xl space-y-3">
                  <div className="skeleton h-4 w-1/3 rounded"/>
                  <div className="skeleton h-16 w-full rounded"/>
                </div>
              ))
              : comments.length === 0
              ? (
                <div className="col-span-full text-center py-12">
                  <p style={{ color: 'var(--text-3)' }}>Customer comments will appear here.</p>
                </div>
              )
              : comments.slice(0, 5).map((c) => (
                <div key={c.id} className="p-6 card-futuristic rounded-xl">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-sm" style={{ color: 'var(--accent)' }}>★</span>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-3)' }}>"{c.message}"</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{c.name}</span>
                    <span className="text-xs" style={{ color: 'var(--text-4)' }}>{formatTimestamp(c.createdAt)}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── CTA Strip ────────────────────────────────────────────────────── */}
      <section className="py-16 relative overflow-hidden section-dark"
        style={{ borderTop: '1px solid var(--border-section)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, var(--accent-subtle) 0%, transparent 70%)' }}/>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full"
            style={{ background: 'var(--accent-subtle)', border: '1px solid var(--border)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }}/>
            <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-2)' }}>
              Ready to create?
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text-1)' }}>
            Ready to bring your vision to life?
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-3)' }}>
            Reach us on WhatsApp for quick enquiries or place an order online.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/233553767177" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                <MessageCircle size={18}/>
                Chat on WhatsApp
              </Button>
            </a>
            <Link to="/order">
              <Button size="lg">
                Place an Order
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)}/>
    </>
  );
}
