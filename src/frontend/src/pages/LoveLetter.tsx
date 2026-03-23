import { AnimatePresence, motion, useAnimation } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Static data ────────────────────────────────────────────────────────────
const FLOAT_HEART_ITEMS = Array.from({ length: 12 }, (_, i) => ({
  id: `fh-${i}`,
  left: `${10 + ((i * 11) % 80)}%`,
  bottom: `${5 + ((i * 7) % 30)}%`,
  delay: `${i * 0.4}s`,
  duration: `${2.5 + (i % 3) * 0.8}s`,
  size: `${14 + (i % 4) * 6}px`,
}));

const LOVE_LETTERS = "I Love You"
  .split("")
  .map((l, i) => ({ id: `ll-${i}`, char: l, delay: i * 0.08 }));

// Dense confetti - 35 items
const CONFETTI_ITEMS = Array.from({ length: 35 }, (_, i) => ({
  id: `conf-${i}`,
  emoji: ["🌹", "🌸", "💍", "✨", "💋", "💗", "🎀"][i % 7],
  left: `${(i * 13 + 5) % 96}%`,
  delay: `${4 + i * 0.22}s`,
  duration: `${3 + (i % 4) * 0.6}s`,
  size: `${16 + (i % 4) * 6}px`,
}));

const STAR_ITEMS = Array.from({ length: 30 }, (_, i) => ({
  id: `star-${i}`,
  left: `${(i * 17) % 95}%`,
  top: `${(i * 11) % 60}%`,
  size: `${1 + (i % 3)}px`,
  delay: `${i * 0.2}s`,
  duration: `${1 + (i % 3) * 0.5}s`,
}));

const PROMISES = [
  { id: "pr-0", text: "I promise to love you every single day 🌸" },
  { id: "pr-1", text: "I promise to be your safe place, always 🏡" },
  { id: "pr-2", text: "I promise to hold your hand through every storm ⛈️" },
  { id: "pr-3", text: "I promise to make you smile, no matter what 😊" },
  { id: "pr-4", text: "I promise you forever, not just today 💍" },
];

const STATS = [
  {
    id: "st-0",
    emoji: "💗",
    label: "Times I've thought of you today:",
    value: "∞",
  },
  {
    id: "st-1",
    emoji: "🌙",
    label: "Nights I wished you were here:",
    value: "Every single one",
  },
  {
    id: "st-2",
    emoji: "⭐",
    label: "Stars that remind me of you:",
    value: "All of them",
  },
  {
    id: "st-3",
    emoji: "💋",
    label: "Reasons I love you:",
    value: "Too many to count",
  },
];

// Heart-shaped leaf positions scattered in the canopy area
const HEART_LEAVES = [
  { id: "hl-0", x: 62, y: 185, s: 14, r: -15, c: "#FF6B8A", delay: 2.2 },
  { id: "hl-1", x: 48, y: 165, s: 11, r: 10, c: "#E91E63", delay: 2.35 },
  { id: "hl-2", x: 75, y: 150, s: 16, r: -8, c: "#FFB3C6", delay: 2.5 },
  { id: "hl-3", x: 55, y: 135, s: 12, r: 20, c: "#C2185B", delay: 2.65 },
  { id: "hl-4", x: 38, y: 200, s: 10, r: -5, c: "#FFCDD2", delay: 2.8 },
  { id: "hl-5", x: 90, y: 130, s: 18, r: 12, c: "#FF6B8A", delay: 2.3 },
  { id: "hl-6", x: 105, y: 115, s: 14, r: -18, c: "#E91E63", delay: 2.45 },
  { id: "hl-7", x: 85, y: 100, s: 11, r: 8, c: "#FFB3C6", delay: 2.6 },
  { id: "hl-8", x: 115, y: 90, s: 16, r: -12, c: "#C2185B", delay: 2.75 },
  { id: "hl-9", x: 100, y: 70, s: 13, r: 15, c: "#FF6B8A", delay: 2.9 },
  { id: "hl-10", x: 120, y: 55, s: 15, r: -6, c: "#E91E63", delay: 3.05 },
  { id: "hl-11", x: 135, y: 45, s: 12, r: 18, c: "#FFCDD2", delay: 3.2 },
  { id: "hl-12", x: 148, y: 38, s: 17, r: -10, c: "#FF6B8A", delay: 3.35 },
  { id: "hl-13", x: 162, y: 42, s: 14, r: 7, c: "#C2185B", delay: 3.5 },
  { id: "hl-14", x: 175, y: 55, s: 11, r: -20, c: "#FFB3C6", delay: 3.0 },
  { id: "hl-15", x: 190, y: 68, s: 16, r: 14, c: "#E91E63", delay: 2.85 },
  { id: "hl-16", x: 205, y: 85, s: 13, r: -9, c: "#FF6B8A", delay: 2.7 },
  { id: "hl-17", x: 218, y: 100, s: 15, r: 11, c: "#C2185B", delay: 2.55 },
  { id: "hl-18", x: 230, y: 115, s: 12, r: -16, c: "#FFCDD2", delay: 2.4 },
  { id: "hl-19", x: 242, y: 130, s: 18, r: 5, c: "#FF6B8A", delay: 2.25 },
  { id: "hl-20", x: 248, y: 150, s: 14, r: -13, c: "#E91E63", delay: 2.1 },
  { id: "hl-21", x: 255, y: 170, s: 11, r: 17, c: "#FFB3C6", delay: 2.95 },
  { id: "hl-22", x: 260, y: 192, s: 16, r: -4, c: "#C2185B", delay: 3.1 },
  { id: "hl-23", x: 130, y: 70, s: 13, r: 9, c: "#FFCDD2", delay: 3.25 },
  { id: "hl-24", x: 145, y: 58, s: 10, r: -14, c: "#FF6B8A", delay: 3.4 },
  { id: "hl-25", x: 165, y: 72, s: 15, r: 19, c: "#E91E63", delay: 3.55 },
  { id: "hl-26", x: 180, y: 82, s: 12, r: -7, c: "#FFB3C6", delay: 3.7 },
  { id: "hl-27", x: 155, y: 88, s: 18, r: 13, c: "#FF6B8A", delay: 3.85 },
  { id: "hl-28", x: 140, y: 105, s: 14, r: -19, c: "#C2185B", delay: 2.15 },
  { id: "hl-29", x: 120, y: 112, s: 11, r: 6, c: "#FFCDD2", delay: 2.3 },
  { id: "hl-30", x: 108, y: 135, s: 16, r: -11, c: "#E91E63", delay: 2.45 },
  { id: "hl-31", x: 72, y: 175, s: 13, r: 16, c: "#FF6B8A", delay: 2.6 },
  { id: "hl-32", x: 44, y: 222, s: 10, r: -3, c: "#FFB3C6", delay: 2.75 },
  { id: "hl-33", x: 235, y: 207, s: 15, r: 8, c: "#C2185B", delay: 2.9 },
  { id: "hl-34", x: 195, y: 155, s: 12, r: -15, c: "#FFCDD2", delay: 3.05 },
  { id: "hl-35", x: 170, y: 108, s: 17, r: 12, c: "#FF6B8A", delay: 3.2 },
  { id: "hl-36", x: 60, y: 118, s: 14, r: -8, c: "#E91E63", delay: 3.35 },
  { id: "hl-37", x: 212, y: 178, s: 11, r: 20, c: "#FFB3C6", delay: 3.5 },
  { id: "hl-38", x: 92, y: 160, s: 15, r: -16, c: "#FF6B8A", delay: 3.65 },
  { id: "hl-39", x: 131, y: 127, s: 13, r: 4, c: "#C2185B", delay: 3.8 },
  // Sparkles
  {
    id: "sp-0",
    x: 118,
    y: 62,
    s: 8,
    r: 0,
    c: "#FFD700",
    delay: 4.0,
    sparkle: true,
  },
  {
    id: "sp-1",
    x: 185,
    y: 75,
    s: 8,
    r: 0,
    c: "#FFD700",
    delay: 4.2,
    sparkle: true,
  },
  {
    id: "sp-2",
    x: 152,
    y: 48,
    s: 6,
    r: 0,
    c: "#FFD700",
    delay: 4.4,
    sparkle: true,
  },
  {
    id: "sp-3",
    x: 95,
    y: 88,
    s: 6,
    r: 0,
    c: "#FFD700",
    delay: 4.6,
    sparkle: true,
  },
  {
    id: "sp-4",
    x: 225,
    y: 110,
    s: 8,
    r: 0,
    c: "#FFD700",
    delay: 4.8,
    sparkle: true,
  },
] as Array<{
  id: string;
  x: number;
  y: number;
  s: number;
  r: number;
  c: string;
  delay: number;
  sparkle?: boolean;
}>;

const apologyParagraphs = [
  {
    id: "ap-0",
    text: "Recently maybe I hurt you... I'm so sorry 💔",
    style: "normal" as const,
  },
  {
    id: "ap-1",
    text: "I am feeling that much bad for hurting my most precious person...",
    style: "normal" as const,
  },
  {
    id: "ap-2",
    text: "Ami jare amr life taika o Beshi love Korih 🌹",
    style: "italic" as const,
  },
  {
    id: "ap-3",
    text: "I would die if she leaves me... I just can't live without her.",
    style: "normal" as const,
  },
  {
    id: "ap-4",
    text: "Her texts, her sweetness, her cuteness, her charm... her everything is killing me from inside 💕",
    style: "normal" as const,
  },
  {
    id: "ap-5",
    text: "I want to be her boy for my whole life.",
    style: "bold" as const,
  },
  {
    id: "ap-6",
    text: "Sorry for hurting my sweetheart. 🙏",
    style: "bold" as const,
  },
];

const pickLine =
  "If I could rearrange the alphabet, I'd put U and I together... but honestly, you already rearranged my whole world, Diya. 🌍❤️";

const poemLines = [
  { id: "pl-0", text: "In every heartbeat, I hear your name,", empty: false },
  {
    id: "pl-1",
    text: "In every sunrise, you're my eternal flame.",
    empty: false,
  },
  { id: "pl-2", text: "I'm sorry I hurt you, my love so true,", empty: false },
  { id: "pl-3", text: "Every breath I take belongs to you.", empty: false },
  { id: "pl-4", text: "", empty: true },
  { id: "pl-5", text: "You are my reason, my peace, my sky,", empty: false },
  {
    id: "pl-6",
    text: "Without you, Diya, I'd forget how to fly.",
    empty: false,
  },
  { id: "pl-7", text: "Forgive me, love, let's start anew,", empty: false },
  {
    id: "pl-8",
    text: "Because my whole world... is only you. 💕",
    empty: false,
  },
];

// Kiss explosion particles
const KISS_PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: `kp-${i}`,
  angle: (i / 30) * 360,
  distance: 80 + Math.random() * 120,
  delay: i * 0.03,
}));

// ─── Floating hearts ────────────────────────────────────────────────────────
function FloatingHearts({
  count = 8,
  color = "#D47A86",
}: { count?: number; color?: string }) {
  const items = FLOAT_HEART_ITEMS.slice(0, count);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute animate-float-heart"
          style={{
            left: item.left,
            bottom: item.bottom,
            animationDelay: item.delay,
            animationDuration: item.duration,
            color,
            fontSize: item.size,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
}

// ─── Confetti rain ───────────────────────────────────────────────────────────
function ConfettiRain() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {CONFETTI_ITEMS.map((item) => (
        <div
          key={item.id}
          className="absolute animate-rain-heart"
          style={{
            left: item.left,
            top: "-50px",
            animationDelay: item.delay,
            animationDuration: item.duration,
            fontSize: item.size,
          }}
        >
          {item.emoji}
        </div>
      ))}
    </div>
  );
}

// ─── Floating particles (Scene 5 background) ─────────────────────────────────
const BG_PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: `bp-${i}`,
  left: `${(i * 13) % 98}%`,
  top: `${(i * 17 + 5) % 95}%`,
  size: `${1 + (i % 3)}px`,
  delay: `${(i * 0.3) % 4}s`,
  dur: `${3 + (i % 5)}s`,
}));

function BackgroundParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {BG_PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: "rgba(255,180,200,0.7)",
            boxShadow: "0 0 4px 2px rgba(255,150,180,0.4)",
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        />
      ))}
    </div>
  );
}

// ─── SCENE 1: Love Tree ───────────────────────────────────────────────────────
function LoveTree() {
  return (
    <svg
      width="310"
      height="420"
      viewBox="0 0 310 420"
      fill="none"
      role="img"
      aria-label="A magical love tree with heart-shaped leaves"
    >
      {/* Glow behind canopy */}
      <defs>
        <radialGradient id="canopyGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#FF6B8A" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FF6B8A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="155" cy="155" rx="130" ry="110" fill="url(#canopyGlow)" />

      {/* Ground hill */}
      <motion.ellipse
        cx="155"
        cy="405"
        rx="120"
        ry="22"
        fill="#5a8a3a"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        style={{ transformOrigin: "155px 405px" }}
        transition={{ duration: 0.8, delay: 0.05 }}
      />
      <motion.ellipse
        cx="155"
        cy="402"
        rx="100"
        ry="14"
        fill="#6ba845"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        style={{ transformOrigin: "155px 402px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
      />

      {/* Roots */}
      <motion.path
        d="M138 378 Q120 368 105 382"
        stroke="#4a2a0e"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      />
      <motion.path
        d="M155 380 Q150 370 148 386"
        stroke="#5C3010"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      />
      <motion.path
        d="M170 378 Q185 368 200 380"
        stroke="#4a2a0e"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />

      {/* Main trunk */}
      <motion.path
        d="M133 378 C131 348 129 318 132 288 C134 265 137 245 141 218 C144 200 147 185 149 168"
        stroke="#5C3010"
        strokeWidth="22"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
      />
      <motion.path
        d="M173 378 C175 348 177 318 174 288 C172 265 168 245 164 218 C161 200 158 185 162 168"
        stroke="#6B3A15"
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
      />
      {/* Bark texture */}
      <motion.path
        d="M143 338 C145 322 144 308 146 293"
        stroke="#3B2008"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      />
      <motion.path
        d="M157 345 C159 328 158 312 160 297"
        stroke="#3B2008"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      />
      <motion.path
        d="M150 315 C152 300 151 285 153 270"
        stroke="#3B2008"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: 1.2 }}
      />

      {/* Branches */}
      <motion.path
        d="M145 248 C127 232 102 222 76 207"
        stroke="#5C3010"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, delay: 1.5, ease: "easeOut" }}
      />
      <motion.path
        d="M107 218 C93 204 80 186 66 168"
        stroke="#6B3A15"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: 1.8, ease: "easeOut" }}
      />
      <motion.path
        d="M92 212 C78 222 64 226 50 230"
        stroke="#6B3A15"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: 1.9, ease: "easeOut" }}
      />
      <motion.path
        d="M160 242 C178 225 203 214 232 200"
        stroke="#5C3010"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, delay: 1.6, ease: "easeOut" }}
      />
      <motion.path
        d="M205 210 C220 195 233 180 247 163"
        stroke="#6B3A15"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: 1.9, ease: "easeOut" }}
      />
      <motion.path
        d="M222 203 C235 212 248 218 262 222"
        stroke="#6B3A15"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: 2.0, ease: "easeOut" }}
      />
      <motion.path
        d="M153 192 C148 174 143 156 138 135"
        stroke="#6B3A15"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 1.7, ease: "easeOut" }}
      />
      <motion.path
        d="M140 155 C123 138 108 120 94 102"
        stroke="#7a4420"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: 2.0, ease: "easeOut" }}
      />
      <motion.path
        d="M140 155 C155 136 168 118 182 100"
        stroke="#7a4420"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: 2.1, ease: "easeOut" }}
      />
      {/* Twigs */}
      <motion.path
        d="M66 170 C60 158 56 146 53 133"
        stroke="#8a5530"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 2.2 }}
      />
      <motion.path
        d="M66 170 C56 164 46 160 36 164"
        stroke="#8a5530"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 2.3 }}
      />
      <motion.path
        d="M247 165 C253 153 256 140 254 126"
        stroke="#8a5530"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 2.2 }}
      />
      <motion.path
        d="M247 165 C258 160 265 155 270 165"
        stroke="#8a5530"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 2.3 }}
      />

      {/* Heart leaves & sparkles */}
      {HEART_LEAVES.map((leaf) =>
        leaf.sparkle ? (
          <motion.text
            key={leaf.id}
            x={leaf.x}
            y={leaf.y}
            fontSize={leaf.s}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={leaf.c}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0.7, 1], scale: 1 }}
            style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
            transition={{
              delay: leaf.delay,
              duration: 0.5,
              opacity: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5,
                delay: leaf.delay,
              },
            }}
          >
            ✦
          </motion.text>
        ) : (
          <motion.path
            key={leaf.id}
            d="M 0,-5 C 0,-9 -6,-9 -6,-5 C -6,-1 0,4 0,8 C 0,4 6,-1 6,-5 C 6,-9 0,-9 0,-5 Z"
            fill={leaf.c}
            transform={`translate(${leaf.x},${leaf.y}) rotate(${leaf.r}) scale(${leaf.s / 10})`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.92 }}
            style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
            transition={{
              delay: leaf.delay,
              duration: 0.6,
              type: "spring",
              stiffness: 220,
              damping: 12,
            }}
          />
        ),
      )}
    </svg>
  );
}

function Scene1() {
  return (
    <div
      className="relative flex flex-col items-center justify-center w-full h-full"
      style={{
        background:
          "radial-gradient(ellipse at 50% 60%, #fff0f5 0%, #ffe8ef 40%, #fff5f0 100%)",
      }}
    >
      {/* Stars */}
      {STAR_ITEMS.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            background: "#e8a0b0",
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}

      <div className="relative z-10" style={{ marginBottom: "16px" }}>
        <LoveTree />
      </div>

      <motion.p
        className="absolute bottom-14 text-center font-body text-lg tracking-widest"
        style={{ color: "#D47A86" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.2, duration: 1 }}
      >
        ✨ Scan with love... ✨
      </motion.p>
    </div>
  );
}

// ─── SCENE 2 ─────────────────────────────────────────────────────────────────
function Scene2() {
  return (
    <div
      className="relative flex flex-col items-center justify-center w-full h-full"
      style={{
        background:
          "radial-gradient(ellipse at center, #fce4ec 0%, #F5EFE6 60%, #f8e8f0 100%)",
      }}
    >
      <FloatingHearts count={12} color="#D47A86" />
      <div className="relative z-10 text-center px-6">
        <div className="flex flex-wrap justify-center gap-1 mb-4">
          {LOVE_LETTERS.map((item) => (
            <motion.span
              key={item.id}
              className="font-display font-bold"
              style={{
                fontSize: "clamp(2.5rem, 10vw, 5rem)",
                color: "#1A1A1A",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay, duration: 0.4, ease: "easeOut" }}
            >
              {item.char === " " ? "\u00A0" : item.char}
            </motion.span>
          ))}
        </div>
        <motion.div
          className="flex items-center justify-center gap-3 mt-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
        >
          <span
            className="font-display italic"
            style={{ fontSize: "clamp(1.8rem, 7vw, 3.5rem)", color: "#D47A86" }}
          >
            My Diya
          </span>
          <span
            className="animate-pulse-heart"
            style={{ fontSize: "clamp(1.5rem, 6vw, 3rem)" }}
          >
            ❤️
          </span>
        </motion.div>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
        >
          <span style={{ fontSize: "2rem" }}>💕💕💕</span>
        </motion.div>
      </div>
    </div>
  );
}

// ─── SCENE 3 ─────────────────────────────────────────────────────────────────
function Scene3({ onNext }: { onNext: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const allVisible = visibleCount >= apologyParagraphs.length;

  useEffect(() => {
    if (visibleCount < apologyParagraphs.length) {
      const timer = setTimeout(() => setVisibleCount((v) => v + 1), 1200);
      return () => clearTimeout(timer);
    }
  }, [visibleCount]);

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full h-full px-6 py-12"
      style={{
        background:
          "linear-gradient(160deg, #F5EFE6 0%, #fce4ec 50%, #F5EFE6 100%)",
      }}
    >
      <div
        className="relative z-10 w-full max-w-md mx-auto rounded-2xl p-6 md:p-8"
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(12px)",
          boxShadow:
            "0 8px 40px -8px rgba(212,122,134,0.35), 0 2px 16px rgba(212,122,134,0.12)",
          border: "1px solid rgba(212,122,134,0.2)",
        }}
      >
        <div className="text-center mb-6">
          <span style={{ fontSize: "2rem" }}>💌</span>
        </div>
        <div
          className="space-y-4 overflow-y-auto"
          style={{ maxHeight: "55vh" }}
        >
          {apologyParagraphs.slice(0, visibleCount).map((p) => (
            <motion.p
              key={p.id}
              className="font-body text-base md:text-lg leading-relaxed"
              style={{
                color: "#1A1A1A",
                fontStyle: p.style === "italic" ? "italic" : "normal",
                fontWeight: p.style === "bold" ? "600" : "400",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {p.text}
            </motion.p>
          ))}
        </div>
        <AnimatePresence>
          {allVisible && (
            <motion.button
              data-ocid="scene3.primary_button"
              className="mt-8 w-full py-3 rounded-xl font-body font-semibold text-white tracking-wide"
              style={{
                background: "linear-gradient(135deg, #D47A86 0%, #c4607a 100%)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={onNext}
              whileTap={{ scale: 0.97 }}
            >
              Continue reading... 💕
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── SCENE 4 ─────────────────────────────────────────────────────────────────
function Scene4({ onForgiven }: { onForgiven: () => void }) {
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [noEscapes, setNoEscapes] = useState(0);
  const maxEscapes = 3;

  const runAway = useCallback(() => {
    if (noEscapes >= maxEscapes) return;
    const margin = 80;
    const x = margin + Math.random() * (window.innerWidth - margin * 2);
    const y = margin + Math.random() * (window.innerHeight - margin * 2);
    setNoPos({ x, y });
    setNoEscapes((e) => e + 1);
  }, [noEscapes]);

  const noScale = Math.max(0, 1 - noEscapes * 0.25);
  const noGone = noEscapes >= maxEscapes;

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full h-full"
      style={{
        background:
          "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 40%, #F5EFE6 100%)",
      }}
    >
      <FloatingHearts count={10} color="#c4607a" />
      <div className="relative z-10 text-center px-6 max-w-sm">
        <motion.div
          className="text-5xl mb-6"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          🥺
        </motion.div>
        <motion.h2
          className="font-display font-bold mb-4"
          style={{ fontSize: "clamp(1.6rem, 6vw, 2.4rem)", color: "#1A1A1A" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Will you forgive me, Diya? 💗
        </motion.h2>
        <motion.p
          className="font-body text-base mb-8"
          style={{ color: "#6F6A63" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          My heart can't rest until you do... 🌸
        </motion.p>
        <div className="flex gap-4 justify-center">
          <motion.button
            data-ocid="scene4.primary_button"
            className="px-8 py-3 rounded-xl font-body font-bold text-white text-lg"
            style={{
              background: "linear-gradient(135deg, #D47A86, #c4607a)",
              boxShadow: "0 6px 24px rgba(196,96,122,0.45)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            onClick={onForgiven}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            Yes 💕
          </motion.button>
          {!noGone && (
            <motion.button
              data-ocid="scene4.secondary_button"
              className="px-8 py-3 rounded-xl font-body font-bold text-lg border-2"
              style={{
                position: noPos ? "fixed" : "relative",
                left: noPos ? `${noPos.x}px` : undefined,
                top: noPos ? `${noPos.y}px` : undefined,
                transform: noPos
                  ? `translate(-50%, -50%) scale(${noScale})`
                  : `scale(${noScale})`,
                borderColor: "#D47A86",
                color: "#D47A86",
                background: "transparent",
                cursor: "default",
                zIndex: 50,
                userSelect: "none",
                transition: "left 0.15s, top 0.15s, transform 0.15s",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              onMouseEnter={runAway}
              onTouchStart={runAway}
              onClick={(e) => {
                e.preventDefault();
                runAway();
              }}
            >
              No 😔
            </motion.button>
          )}
        </div>
        {noGone && (
          <motion.p
            className="mt-6 font-body text-sm"
            style={{ color: "#6F6A63" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            The No button ran away... 😅 (It knew the answer!)
          </motion.p>
        )}
      </div>
    </div>
  );
}

// ─── SCENE 5: Ultimate Romantic Finale ───────────────────────────────────────
function SendKissButton() {
  const [kissed, setKissed] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleKiss = () => {
    if (kissed) return;
    setKissed(true);
    setShowExplosion(true);
    setTimeout(() => setShowExplosion(false), 2000);
  };

  return (
    <div className="relative flex flex-col items-center gap-3">
      <div className="relative">
        {showExplosion &&
          KISS_PARTICLES.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * p.distance;
            const ty = Math.sin(rad) * p.distance;
            return (
              <motion.div
                key={p.id}
                className="absolute pointer-events-none"
                style={{
                  left: "50%",
                  top: "50%",
                  fontSize: "18px",
                  zIndex: 60,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{ x: tx, y: ty, opacity: 0, scale: 1 }}
                transition={{ duration: 1.2, delay: p.delay, ease: "easeOut" }}
              >
                💋
              </motion.div>
            );
          })}
        <motion.button
          ref={btnRef}
          data-ocid="scene5.primary_button"
          className="px-8 py-4 rounded-2xl font-body font-bold text-white text-lg relative overflow-hidden"
          style={{
            background: kissed
              ? "linear-gradient(135deg, #c4607a, #D47A86)"
              : "linear-gradient(135deg, #FF6B8A, #E91E63)",
            boxShadow: kissed
              ? "0 0 30px rgba(212,122,134,0.5)"
              : "0 0 40px rgba(233,30,99,0.6), 0 0 80px rgba(233,30,99,0.3)",
          }}
          onClick={handleKiss}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 60px rgba(233,30,99,0.8)",
          }}
          whileTap={{ scale: 0.95 }}
          animate={
            kissed
              ? {}
              : {
                  boxShadow: [
                    "0 0 30px rgba(233,30,99,0.5)",
                    "0 0 60px rgba(233,30,99,0.8)",
                    "0 0 30px rgba(233,30,99,0.5)",
                  ],
                }
          }
          transition={
            kissed
              ? {}
              : { boxShadow: { repeat: Number.POSITIVE_INFINITY, duration: 2 } }
          }
        >
          {kissed ? "💋 Kissed! 💋" : "Send a Kiss 💋"}
        </motion.button>
      </div>
      <AnimatePresence>
        {kissed && (
          <motion.p
            className="font-body text-center"
            style={{ color: "#ffb3c6", fontSize: "0.95rem" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            Kiss sent to Diya's heart forever 💗
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sparkles around final FOREVER YOURS
const FINAL_SPARKLES = Array.from({ length: 12 }, (_, i) => ({
  id: `fs-${i}`,
  emoji: ["✨", "⭐", "💫"][i % 3],
  x: Math.cos((i / 12) * Math.PI * 2) * (55 + (i % 3) * 20),
  y: Math.sin((i / 12) * Math.PI * 2) * (25 + (i % 3) * 10),
  delay: 12.0 + i * 0.15,
}));

function Scene5() {
  return (
    <div
      className="relative flex flex-col items-center justify-start w-full h-full overflow-y-auto overflow-x-hidden"
      style={{
        background:
          "linear-gradient(160deg, #1a0520 0%, #0d0010 35%, #200830 65%, #160025 100%)",
      }}
    >
      <BackgroundParticles />
      <ConfettiRain />

      <div className="relative z-10 text-center px-5 w-full max-w-lg mx-auto py-8 space-y-6 pb-24">
        {/* Section 1: Pick-up line */}
        <motion.div
          className="rounded-3xl p-6"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "2px solid transparent",
            backgroundClip: "padding-box",
            backdropFilter: "blur(12px)",
            boxShadow:
              "0 0 30px rgba(255,107,138,0.3), inset 0 0 30px rgba(255,107,138,0.05)",
            outline: "2px solid rgba(255,107,138,0.4)",
            outlineOffset: "-2px",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
        >
          <div className="text-2xl mb-3">💌</div>
          <p
            className="font-display italic"
            style={{
              color: "#f8c8d0",
              fontSize: "clamp(1rem, 3vw, 1.25rem)",
              lineHeight: 1.7,
            }}
          >
            {pickLine}
          </p>
        </motion.div>

        {/* Section 2: Poem */}
        <motion.div
          className="rounded-3xl p-6 text-left"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(212,122,134,0.25)",
            boxShadow: "0 4px 30px rgba(212,122,134,0.15)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.9 }}
        >
          <div className="text-xl mb-3 text-center">🌹</div>
          {poemLines.map((line, i) =>
            line.empty ? (
              <div key={line.id} className="h-3" />
            ) : (
              <motion.p
                key={line.id}
                className="font-body"
                style={{
                  color: "#fce4ec",
                  fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
                  lineHeight: 2,
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + i * 0.25, duration: 0.5 }}
              >
                {line.text}
              </motion.p>
            ),
          )}
        </motion.div>

        {/* Section 3: I love you forever */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 4.5,
            duration: 1,
            type: "spring",
            stiffness: 120,
          }}
        >
          <motion.p
            className="font-display font-bold"
            style={{
              fontSize: "clamp(1.8rem, 6vw, 2.8rem)",
              background:
                "linear-gradient(135deg, #FF6B8A 0%, #E91E63 50%, #FF6B8A 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            animate={{
              filter: [
                "drop-shadow(0 0 8px rgba(233,30,99,0.5))",
                "drop-shadow(0 0 25px rgba(233,30,99,0.9))",
                "drop-shadow(0 0 8px rgba(233,30,99,0.5))",
              ],
            }}
            transition={{
              filter: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 2.5,
                ease: "easeInOut",
              },
            }}
          >
            I love you forever, Diya 💍
          </motion.p>
        </motion.div>

        {/* Section 4: Our Promises */}
        <motion.div
          className="rounded-3xl p-6"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,107,138,0.35)",
            boxShadow: "0 8px 32px rgba(255,107,138,0.15)",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5.5, duration: 1 }}
        >
          <motion.h3
            className="font-display font-bold mb-5 text-center"
            style={{
              color: "#ffb3c6",
              fontSize: "clamp(1.15rem, 4vw, 1.5rem)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5.7, duration: 0.6 }}
          >
            My Promises to You 💌
          </motion.h3>
          <div className="space-y-4 text-left">
            {PROMISES.map((p, i) => (
              <motion.div
                key={p.id}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 5.9 + i * 0.45,
                  duration: 0.6,
                  ease: "easeOut",
                }}
              >
                <motion.span
                  style={{
                    color: "#4ade80",
                    fontSize: "1.2rem",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 6.1 + i * 0.45,
                    duration: 0.45,
                    type: "spring",
                    stiffness: 250,
                  }}
                >
                  ✓
                </motion.span>
                <p
                  className="font-body"
                  style={{
                    color: "#fce4ec",
                    fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
                    lineHeight: 1.7,
                  }}
                >
                  {p.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Section 5: Romantic stats */}
        <motion.div
          className="rounded-3xl p-6"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(212,122,134,0.3)",
            boxShadow: "0 6px 28px rgba(212,122,134,0.18)",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 7.5, duration: 1 }}
        >
          <motion.h3
            className="font-display font-bold mb-5 text-center"
            style={{ color: "#ffb3c6", fontSize: "clamp(1.1rem, 4vw, 1.4rem)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 7.7, duration: 0.6 }}
          >
            💝 Relationship Stats
          </motion.h3>
          <div className="space-y-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.id}
                className="flex items-center justify-between gap-4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 7.9 + i * 0.4, duration: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "1.2rem" }}>{s.emoji}</span>
                  <span
                    className="font-body text-sm"
                    style={{ color: "#f8c8d0" }}
                  >
                    {s.label}
                  </span>
                </div>
                <span
                  className="font-display font-bold text-sm"
                  style={{ color: "#FF6B8A", whiteSpace: "nowrap" }}
                >
                  {s.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Section 6: A Message from my Heart */}
        <motion.div
          className="rounded-3xl p-6"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,180,200,0.3)",
            boxShadow: "0 6px 30px rgba(255,107,138,0.12)",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 9, duration: 1 }}
        >
          <motion.h3
            className="font-display font-bold mb-4 text-center"
            style={{ color: "#ffb3c6", fontSize: "clamp(1.1rem, 4vw, 1.4rem)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 9.2, duration: 0.6 }}
          >
            🫀 A Message from my Heart
          </motion.h3>
          <motion.p
            className="font-display italic leading-relaxed"
            style={{
              color: "#fce4ec",
              fontSize: "clamp(0.95rem, 2.8vw, 1.15rem)",
              lineHeight: 1.9,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 9.4, duration: 1.2 }}
          >
            "Diya, you are not just my girlfriend — you are my home, my calm, my
            everything. Every fight makes me realize how much I cannot live
            without you. You are the most precious thing that ever happened to
            me. I love you more than words can ever say. 🌹"
          </motion.p>
        </motion.div>

        {/* Section 7: Send a Kiss */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 10.5, duration: 0.9, type: "spring" }}
        >
          <SendKissButton />
        </motion.div>

        {/* Section 8: FOREVER YOURS grand closing */}
        <motion.div
          className="py-8 relative flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 11.5, duration: 1.2, type: "spring" }}
        >
          {/* Sparkles around text */}
          <div className="relative">
            {FINAL_SPARKLES.map((sp) => (
              <motion.div
                key={sp.id}
                className="absolute pointer-events-none"
                style={{
                  left: "50%",
                  top: "50%",
                  fontSize: "1.2rem",
                  transform: `translate(calc(-50% + ${sp.x}px), calc(-50% + ${sp.y}px))`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0.7, 1], scale: 1 }}
                transition={{
                  delay: sp.delay,
                  duration: 0.5,
                  opacity: {
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    delay: sp.delay,
                  },
                }}
              >
                {sp.emoji}
              </motion.div>
            ))}
            <motion.h1
              className="font-display font-bold text-center"
              style={{
                fontSize: "clamp(2.5rem, 10vw, 4.5rem)",
                background:
                  "linear-gradient(135deg, #FFD700 0%, #FFA500 30%, #FFD700 60%, #FFC000 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "0.05em",
              }}
              animate={{
                filter: [
                  "drop-shadow(0 0 12px rgba(255,215,0,0.5))",
                  "drop-shadow(0 0 35px rgba(255,215,0,0.9))",
                  "drop-shadow(0 0 12px rgba(255,215,0,0.5))",
                ],
              }}
              transition={{
                filter: {
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2.5,
                  ease: "easeInOut",
                  delay: 12.5,
                },
              }}
            >
              FOREVER YOURS
            </motion.h1>
          </div>
          <motion.p
            className="font-display italic mt-3"
            style={{ color: "#f9a8c0", fontSize: "clamp(1.1rem, 4vw, 1.5rem)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 12.2, duration: 1 }}
          >
            — Your Boy 🤍
          </motion.p>
          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 12.5, duration: 0.8 }}
          >
            <span style={{ fontSize: "2rem" }}>✨💍✨</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const SCENES = ["scene1", "scene2", "scene3", "scene4", "scene5"] as const;
type SceneId = (typeof SCENES)[number];

export default function LoveLetter() {
  const [scene, setScene] = useState<SceneId>("scene1");

  useEffect(() => {
    if (scene === "scene1") {
      const t = setTimeout(() => setScene("scene2"), 6500);
      return () => clearTimeout(t);
    }
    if (scene === "scene2") {
      const t = setTimeout(() => setScene("scene3"), 4000);
      return () => clearTimeout(t);
    }
  }, [scene]);

  const toScene4 = () => setScene("scene4");
  const toScene5 = () => setScene("scene5");

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ fontFamily: "var(--font-body, sans-serif)" }}
    >
      <AnimatePresence mode="wait">
        {scene === "scene1" && (
          <motion.div
            key="scene1"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Scene1 />
          </motion.div>
        )}
        {scene === "scene2" && (
          <motion.div
            key="scene2"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Scene2 />
          </motion.div>
        )}
        {scene === "scene3" && (
          <motion.div
            key="scene3"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Scene3 onNext={toScene4} />
          </motion.div>
        )}
        {scene === "scene4" && (
          <motion.div
            key="scene4"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Scene4 onForgiven={toScene5} />
          </motion.div>
        )}
        {scene === "scene5" && (
          <motion.div
            key="scene5"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <Scene5 />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
