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
const BG_PARTICLES = Array.from({ length: 50 }, (_, i) => ({
  id: `bp-${i}`,
  left: `${(i * 13) % 98}%`,
  top: `${(i * 17 + 5) % 95}%`,
  size: `${2 + (i % 4)}px`,
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
            background: "rgba(255,180,200,0.8)",
            boxShadow: "0 0 6px 3px rgba(255,150,180,0.5)",
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        />
      ))}
    </div>
  );
}

// ─── LOVE TREE CANVAS (fills full screen) ─────────────────────────────────────
function LoveTree() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    interface Petal {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      phase: number;
      rot: number;
      rotSpeed: number;
    }
    interface Sparkle {
      x: number;
      y: number;
      phase: number;
      size: number;
    }
    interface LeafInfo {
      x: number;
      y: number;
      color: string;
      size: number;
      delay: number;
      angle: number;
    }
    interface Branch {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      cpx: number;
      cpy: number;
      width: number;
      depth: number;
      startTime: number;
      duration: number;
    }

    const HEART_COLORS = [
      "#FF1493",
      "#FF69B4",
      "#FF6B8A",
      "#FFB6C1",
      "#E91E63",
      "#C71585",
      "#FF4D8D",
      "#FF85A2",
      "#FF007F",
      "#FF5C8A",
    ];
    const PETAL_COLORS = [
      "#FF6B8A",
      "#E91E63",
      "#FFB3C6",
      "#C2185B",
      "#FF8FAB",
    ];

    const GROUND_Y = H * 0.915;
    const TRUNK_BASE_HW = W * 0.052;
    const TRUNK_TOP_HW = W * 0.012;

    // Heart silhouette center and scale
    const heartCX = W / 2;
    const heartCY = H * 0.36;
    const heartScale = Math.min(W, H) * 0.024;

    // Helper: get point on heart curve
    // x(t) = 16 * sin³(t), y(t) = -(13cos(t)-5cos(2t)-2cos(3t)-cos(4t))
    function heartPoint(t: number): { x: number; y: number } {
      const hx = heartCX + heartScale * 16 * Math.sin(t) ** 3;
      const hy =
        heartCY -
        heartScale *
          (13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t));
      return { x: hx, y: hy };
    }

    // Bottom tip of heart at t=π
    const tipPoint = heartPoint(Math.PI);
    const TRUNK_TOP_X = tipPoint.x;
    const TRUNK_TOP_Y = tipPoint.y;

    // Seeded LCG for stable shapes
    let seed = 42;
    function rnd() {
      seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
      return seed / 0x7fffffff;
    }

    function easeOutElastic(t: number): number {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      const p = 0.38;
      return 2 ** (-10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
    }
    function easeInOut(t: number): number {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    // Generate 90 leaf positions around the full heart outline
    const NUM_LEAVES = 90;
    const leafTargets: { x: number; y: number; t: number }[] = [];
    for (let i = 0; i < NUM_LEAVES; i++) {
      const t = (i / NUM_LEAVES) * Math.PI * 2;
      // Skip near bottom tip (t ≈ π) — that's where trunk connects
      const distFromTip = Math.abs(
        ((t - Math.PI + Math.PI * 2) % (Math.PI * 2)) - Math.PI,
      );
      if (distFromTip < 0.22) continue;
      const pt = heartPoint(t);
      leafTargets.push({ x: pt.x, y: pt.y, t });
    }

    // Build all branches upfront
    const allBranches: Branch[] = [];
    const leafInfos: LeafInfo[] = [];

    function makeBranch(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      width: number,
      depth: number,
      startTime: number,
      duration: number,
    ): Branch {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const curveAmt = (rnd() - 0.5) * 0.3;
      const cpx = mx - dy * curveAmt;
      const cpy = my + dx * curveAmt;
      const b: Branch = {
        x1,
        y1,
        x2,
        y2,
        cpx,
        cpy,
        width: Math.max(0.5, width),
        depth,
        startTime,
        duration,
      };
      allBranches.push(b);
      return b;
    }

    // ── Build the branch skeleton ──────────────────────────────────────
    // Timeline:
    // 0.0 – 1.8s  trunk grows
    // 1.8 – 4.0s  two main arms follow left/right lobes of the heart
    // 4.0 – 7.0s  sub-branches reach leaf positions
    // 7.0 – 9.5s  leaves bloom

    const BRANCH_START = 1.5;
    const MAIN_ARM_DUR = 0.9;
    const SUB_DUR = 0.35;
    const LEAF_BR_DUR = 0.28;

    // Split leaf targets into left lobe (x < heartCX) and right lobe (x >= heartCX)
    const leftLeaves = leafTargets.filter((p) => p.x < heartCX);
    const rightLeaves = leafTargets.filter((p) => p.x >= heartCX);

    // For each lobe, build a "spine" progressing along the lobe,
    // then sub-branches shooting off to nearby leaf targets
    function buildLobe(
      leaves: { x: number; y: number; t: number }[],
      lobeIndex: number, // 0=left, 1=right
    ) {
      if (leaves.length === 0) return;

      // Sort by proximity along the lobe (sort by t parameter)
      const sorted = [...leaves].sort((a, b) => a.t - b.t);

      // Create a spine that arcs from trunk top toward the lobe's top
      // Use 3 intermediate waypoints for the arm
      const lobeOffsetX = lobeIndex === 0 ? -1 : 1;
      const lobeTopT = lobeIndex === 0 ? Math.PI * 1.5 : Math.PI * 0.5;
      const lobeTop = heartPoint(lobeTopT);

      // Three arm spine points
      const arm1x = TRUNK_TOP_X + lobeOffsetX * heartScale * 4;
      const arm1y = TRUNK_TOP_Y - heartScale * 5;
      const arm2x = heartCX + lobeOffsetX * heartScale * 12;
      const arm2y = heartCY + heartScale * 2;
      const arm3x = lobeTop.x;
      const arm3y = lobeTop.y;

      const armStartTime = BRANCH_START + lobeIndex * 0.1;

      makeBranch(
        TRUNK_TOP_X,
        TRUNK_TOP_Y,
        arm1x,
        arm1y,
        W * 0.018,
        3,
        armStartTime,
        MAIN_ARM_DUR * 0.5,
      );
      makeBranch(
        arm1x,
        arm1y,
        arm2x,
        arm2y,
        W * 0.013,
        3,
        armStartTime + MAIN_ARM_DUR * 0.4,
        MAIN_ARM_DUR * 0.6,
      );
      makeBranch(
        arm2x,
        arm2y,
        arm3x,
        arm3y,
        W * 0.009,
        2,
        armStartTime + MAIN_ARM_DUR * 0.9,
        MAIN_ARM_DUR * 0.7,
      );

      const armEndTime = armStartTime + MAIN_ARM_DUR * 1.5;

      // Group sorted leaves into clusters of ~3-4
      const clusterSize = 3;
      for (let ci = 0; ci < sorted.length; ci += clusterSize) {
        const cluster = sorted.slice(ci, ci + clusterSize);
        const ccx = cluster.reduce((s, p) => s + p.x, 0) / cluster.length;
        const ccy = cluster.reduce((s, p) => s + p.y, 0) / cluster.length;

        // Find closest spine point
        const dists = [
          { px: arm1x, py: arm1y, d: Math.hypot(ccx - arm1x, ccy - arm1y) },
          { px: arm2x, py: arm2y, d: Math.hypot(ccx - arm2x, ccy - arm2y) },
          { px: arm3x, py: arm3y, d: Math.hypot(ccx - arm3x, ccy - arm3y) },
        ];
        dists.sort((a, b) => a.d - b.d);
        const origin = dists[0];

        const clusterStartTime = armEndTime + (ci / sorted.length) * 1.2;

        if (cluster.length === 1) {
          // Direct branch to leaf
          makeBranch(
            origin.px,
            origin.py,
            cluster[0].x,
            cluster[0].y,
            W * 0.007,
            1,
            clusterStartTime,
            LEAF_BR_DUR,
          );
        } else {
          // Mid-point then individual leaf branches
          const midX = (origin.px + ccx) / 2;
          const midY = (origin.py + ccy) / 2;
          makeBranch(
            origin.px,
            origin.py,
            midX,
            midY,
            W * 0.009,
            2,
            clusterStartTime,
            SUB_DUR,
          );
          const leafBrStart = clusterStartTime + SUB_DUR * 0.6;
          for (let j = 0; j < cluster.length; j++) {
            makeBranch(
              midX,
              midY,
              cluster[j].x,
              cluster[j].y,
              W * 0.006,
              1,
              leafBrStart + j * 0.04,
              LEAF_BR_DUR,
            );
          }
        }
      }
    }

    buildLobe(leftLeaves, 0);
    buildLobe(rightLeaves, 1);

    // Calculate when all branches finish
    let maxBranchEndTime = BRANCH_START;
    for (const b of allBranches) {
      maxBranchEndTime = Math.max(maxBranchEndTime, b.startTime + b.duration);
    }
    const LEAF_BLOOM_START = maxBranchEndTime - 0.1;

    // Collect leaf tip positions from depth-1 branches + add leaves at branch tips
    function buildLeafInfos() {
      let i = 0;
      for (const b of allBranches) {
        if (b.depth === 1) {
          leafInfos.push({
            x: b.x2,
            y: b.y2,
            color: HEART_COLORS[i % HEART_COLORS.length],
            size: W * 0.022 + rnd() * W * 0.022,
            angle: (rnd() - 0.5) * 1.2,
            delay: i * 0.04,
          });
          i++;
        }
      }
    }
    buildLeafInfos();

    const petals: Petal[] = [];
    let lastPetalTime = 0;

    const sparkles: Sparkle[] = Array.from({ length: 28 }, () => ({
      x: heartCX + (rnd() - 0.5) * heartScale * 34,
      y: heartCY + (rnd() - 0.5) * heartScale * 22,
      phase: rnd() * Math.PI * 2,
      size: W * 0.018 + rnd() * W * 0.022,
    }));

    const STARS = Array.from({ length: 120 }, () => ({
      x: rnd() * W,
      y: rnd() * H * 0.72,
      r: W * 0.001 + rnd() * W * 0.003,
      phase: rnd() * Math.PI * 2,
      speed: 0.4 + rnd() * 1.2,
    }));

    // ── Draw helpers ────────────────────────────────────────────────────

    function drawHeart(
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number,
      color: string,
      alpha: number,
      angle: number,
      glowSize = 0,
    ) {
      c.save();
      c.globalAlpha = Math.max(0, Math.min(1, alpha));
      c.translate(cx, cy);
      c.rotate(angle);
      if (glowSize > 0) {
        c.shadowColor = color;
        c.shadowBlur = glowSize;
      }
      c.fillStyle = color;
      c.beginPath();
      // Classic heart using bezier curves, pointing down (tip at bottom)
      const s = size;
      c.moveTo(0, s * 0.3);
      c.bezierCurveTo(-s * 0.05, s * 0.0, -s, s * 0.0, -s, s * 0.45);
      c.bezierCurveTo(-s, s * 0.8, -s * 0.5, s * 1.1, 0, s * 1.35);
      c.bezierCurveTo(s * 0.5, s * 1.1, s, s * 0.8, s, s * 0.45);
      c.bezierCurveTo(s, s * 0.0, s * 0.05, s * 0.0, 0, s * 0.3);
      c.fill();
      c.restore();
    }

    // Draw the heart outline silhouette as a glowing path
    function drawHeartCanopyGlow(
      c: CanvasRenderingContext2D,
      alpha: number,
      time: number,
    ) {
      const pulse = 0.75 + 0.25 * Math.sin(time * 0.9);
      c.save();
      c.globalAlpha = alpha * pulse * 0.22;
      c.shadowColor = "#FF1493";
      c.shadowBlur = heartScale * 6;
      c.fillStyle = "#FF1493";
      c.beginPath();
      const steps = 120;
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        const pt = heartPoint(t);
        if (i === 0) c.moveTo(pt.x, pt.y);
        else c.lineTo(pt.x, pt.y);
      }
      c.closePath();
      c.fill();
      c.restore();

      // Second softer outer glow
      c.save();
      c.globalAlpha = alpha * pulse * 0.08;
      c.shadowColor = "#FF69B4";
      c.shadowBlur = heartScale * 14;
      c.fillStyle = "#FF69B4";
      c.beginPath();
      const scaleBoost = 1.15;
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        const hx = heartCX + heartScale * scaleBoost * 16 * Math.sin(t) ** 3;
        const hy =
          heartCY -
          heartScale *
            scaleBoost *
            (13 * Math.cos(t) -
              5 * Math.cos(2 * t) -
              2 * Math.cos(3 * t) -
              Math.cos(4 * t));
        if (i === 0) c.moveTo(hx, hy);
        else c.lineTo(hx, hy);
      }
      c.closePath();
      c.fill();
      c.restore();
    }

    function drawBackground(c: CanvasRenderingContext2D) {
      const sky = c.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#04000e");
      sky.addColorStop(0.35, "#0a0020");
      sky.addColorStop(0.7, "#120028");
      sky.addColorStop(1, "#0d001a");
      c.fillStyle = sky;
      c.fillRect(0, 0, W, H);
    }

    function drawStars(c: CanvasRenderingContext2D, time: number) {
      for (const s of STARS) {
        const brightness =
          0.35 + 0.65 * Math.abs(Math.sin(time * s.speed + s.phase));
        c.save();
        c.globalAlpha = brightness;
        c.fillStyle = brightness > 0.8 ? "#fffde8" : "#e8e0ff";
        c.shadowColor = "#ffffff";
        c.shadowBlur = s.r > W * 0.002 ? 4 : 1;
        c.beginPath();
        c.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    function drawGround(c: CanvasRenderingContext2D) {
      c.save();
      const hillGrd = c.createRadialGradient(
        W / 2,
        GROUND_Y - H * 0.025,
        0,
        W / 2,
        GROUND_Y,
        W * 0.36,
      );
      hillGrd.addColorStop(0, "#2d7a1a");
      hillGrd.addColorStop(0.5, "#1e5c10");
      hillGrd.addColorStop(1, "#0f3008");
      c.fillStyle = hillGrd;
      c.beginPath();
      c.ellipse(W / 2, GROUND_Y, W * 0.42, H * 0.058, 0, 0, Math.PI * 2);
      c.fill();
      const groundGrd = c.createLinearGradient(0, H * 0.94, 0, H);
      groundGrd.addColorStop(0, "rgba(5,20,5,0.8)");
      groundGrd.addColorStop(1, "rgba(2,8,2,0.95)");
      c.fillStyle = groundGrd;
      c.fillRect(0, H * 0.94, W, H * 0.06);
      c.restore();
    }

    function drawTrunk(c: CanvasRenderingContext2D, progress: number) {
      if (progress <= 0) return;
      const baseY = GROUND_Y;
      const topY = TRUNK_TOP_Y;
      const totalH = baseY - topY;
      const blend = easeInOut(progress);
      const curTopY = baseY - totalH * blend;
      const bw = TRUNK_BASE_HW;
      const tw = TRUNK_TOP_HW;
      const curTw = tw + (bw - tw) * (1 - blend);
      c.save();
      const grad = c.createLinearGradient(
        W / 2 - bw,
        baseY,
        W / 2 + tw,
        curTopY,
      );
      grad.addColorStop(0, "#3d1a08");
      grad.addColorStop(0.4, "#6b340f");
      grad.addColorStop(0.75, "#7a4020");
      grad.addColorStop(1, "#8a4e28");
      c.beginPath();
      c.moveTo(W / 2 - bw, baseY);
      c.quadraticCurveTo(
        W / 2 - bw + W * 0.006,
        (baseY + curTopY) / 2,
        W / 2 - curTw,
        curTopY,
      );
      c.lineTo(W / 2 + curTw, curTopY);
      c.quadraticCurveTo(
        W / 2 + bw - W * 0.003,
        (baseY + curTopY) / 2,
        W / 2 + bw,
        baseY,
      );
      c.closePath();
      c.fillStyle = grad;
      c.fill();
      if (progress > 0.55) {
        const barkAlpha = Math.min(1, (progress - 0.55) * 3.5);
        c.globalAlpha = barkAlpha * 0.35;
        c.strokeStyle = "#2a1005";
        c.lineWidth = W * 0.005;
        c.lineCap = "round";
        c.beginPath();
        c.moveTo(W / 2 - W * 0.022, baseY - totalH * 0.12);
        c.quadraticCurveTo(
          W / 2 - W * 0.028,
          baseY - totalH * 0.5,
          W / 2 - W * 0.017,
          baseY - totalH * 0.85,
        );
        c.stroke();
        c.beginPath();
        c.moveTo(W / 2 + W * 0.014, baseY - totalH * 0.1);
        c.quadraticCurveTo(
          W / 2 + W * 0.019,
          baseY - totalH * 0.45,
          W / 2 + W * 0.011,
          baseY - totalH * 0.8,
        );
        c.stroke();
      }
      c.restore();
    }

    function drawBranchSegment(
      c: CanvasRenderingContext2D,
      b: Branch,
      t: number,
    ) {
      if (t <= 0) return;
      const clampT = Math.min(1, t);
      const depthRatio = Math.min(1, (b.depth - 1) / 3);
      const r = Math.round(55 + depthRatio * 65);
      const g = Math.round(22 + depthRatio * 32);
      const bv = Math.round(6 + depthRatio * 20);
      c.save();
      c.strokeStyle = `rgb(${r},${g},${bv})`;
      c.lineWidth = b.width;
      c.lineCap = "round";
      c.lineJoin = "round";
      const steps = Math.max(8, Math.round(30 * clampT));
      c.beginPath();
      c.moveTo(b.x1, b.y1);
      for (let i = 1; i <= steps; i++) {
        const s = (i / steps) * clampT;
        const bs = 1 - s;
        const px = b.x1 * bs * bs + 2 * b.cpx * bs * s + b.x2 * s * s;
        const py = b.y1 * bs * bs + 2 * b.cpy * bs * s + b.y2 * s * s;
        c.lineTo(px, py);
      }
      c.stroke();
      c.restore();
    }

    function drawBranches(c: CanvasRenderingContext2D, time: number) {
      for (const b of allBranches) {
        const t = Math.max(0, Math.min(1, (time - b.startTime) / b.duration));
        drawBranchSegment(c, b, t);
      }
    }

    function drawLeaves(
      c: CanvasRenderingContext2D,
      time: number,
      windTime: number,
    ) {
      if (leafInfos.length === 0) return;
      const elapsed = time - LEAF_BLOOM_START;
      if (elapsed <= 0) return;
      for (let i = 0; i < leafInfos.length; i++) {
        const leaf = leafInfos[i];
        const lElapsed = elapsed - leaf.delay;
        if (lElapsed <= 0) continue;
        const t = Math.min(1, lElapsed / 0.6);
        const leafScale = easeOutElastic(t);
        const swayX = t >= 1 ? Math.sin(windTime * 0.7 + i * 0.4) * 2.5 : 0;
        const swayY = t >= 1 ? Math.cos(windTime * 0.5 + i * 0.3) * 1.5 : 0;
        drawHeart(
          c,
          leaf.x + swayX,
          leaf.y + swayY,
          leaf.size * leafScale,
          leaf.color,
          Math.min(1, t * 1.8),
          leaf.angle + (t >= 1 ? Math.sin(windTime * 0.4 + i * 0.5) * 0.1 : 0),
          t >= 1 ? 12 : 18 * t,
        );
      }
    }

    function drawPetals(c: CanvasRenderingContext2D, time: number) {
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.x += p.vx + Math.sin(time * 1.1 + p.phase) * 0.55;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        p.alpha -= 0.002;
        if (p.y > H + 20 || p.alpha < 0.04) {
          petals.splice(i, 1);
          continue;
        }
        drawHeart(c, p.x, p.y, p.size, p.color, p.alpha, p.rot);
      }
    }

    function spawnPetal(time: number) {
      lastPetalTime = time;
      petals.push({
        x: W * 0.1 + rnd() * W * 0.8,
        y: H * 0.04 + rnd() * H * 0.48,
        vx: (rnd() - 0.5) * 0.8,
        vy: 0.5 + rnd() * 0.9,
        size: W * 0.008 + rnd() * W * 0.018,
        color: PETAL_COLORS[Math.floor(rnd() * PETAL_COLORS.length)],
        alpha: 0.7 + rnd() * 0.3,
        phase: rnd() * Math.PI * 2,
        rot: rnd() * Math.PI * 2,
        rotSpeed: (rnd() - 0.5) * 0.06,
      });
    }

    function drawSparkles(
      c: CanvasRenderingContext2D,
      time: number,
      alpha: number,
    ) {
      if (alpha <= 0) return;
      for (const sp of sparkles) {
        const brightness =
          0.3 + 0.7 * Math.abs(Math.sin(time * 1.3 + sp.phase));
        const sizeAnim = sp.size * (0.7 + 0.3 * Math.sin(time * 2 + sp.phase));
        c.save();
        c.globalAlpha = brightness * alpha;
        c.fillStyle = "#FFD700";
        c.shadowColor = "#FFD700";
        c.shadowBlur = 10;
        c.font = `${sizeAnim}px serif`;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText("\u2726", sp.x, sp.y);
        c.restore();
      }
    }

    function drawScanText(c: CanvasRenderingContext2D, time: number) {
      if (time < 8) return;
      const textAlpha = Math.min(1, (time - 8) / 1.5);
      c.save();
      c.globalAlpha = textAlpha;
      c.fillStyle = "#FFB6C1";
      c.shadowColor = "rgba(255,100,140,0.85)";
      c.shadowBlur = H * 0.024;
      c.font = `${H * 0.028}px sans-serif`;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText("\u2728 A love tree for Diya \u2728", W / 2, H * 0.93);
      c.restore();
    }

    let startTime: number | null = null;
    let animId: number;

    function animate(ts: number) {
      if (!startTime) startTime = ts;
      const time = (ts - startTime) / 1000;

      ctx.clearRect(0, 0, W, H);
      drawBackground(ctx);
      drawStars(ctx, time);

      const glowAlpha = Math.max(
        0,
        Math.min(1, (time - LEAF_BLOOM_START) / 2.5),
      );
      if (glowAlpha > 0) drawHeartCanopyGlow(ctx, glowAlpha, time);

      drawGround(ctx);
      drawTrunk(ctx, Math.min(1, time / 1.8));

      if (time >= BRANCH_START - 0.1) drawBranches(ctx, time);

      drawLeaves(ctx, time, time);

      if (time > LEAF_BLOOM_START + 1.0) {
        if (petals.length < 35 && time - lastPetalTime > 0.25) spawnPetal(time);
        drawPetals(ctx, time);
      }

      const sparkleAlpha = Math.max(
        0,
        Math.min(1, (time - (LEAF_BLOOM_START - 0.5)) / 1.8),
      );
      drawSparkles(ctx, time, sparkleAlpha);
      drawScanText(ctx, time);

      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
      aria-label="Heart-shaped love tree animation"
    />
  );
}

// ─── SCENE 1: Love Tree ──────────────────────────────────────────────────────
function Scene1() {
  return (
    <div className="absolute inset-0">
      <LoveTree />
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
          "linear-gradient(160deg, #0a0010 0%, #1a0025 60%, #0d0018 100%)",
      }}
    >
      <FloatingHearts count={12} color="#FF69B4" />
      <div className="relative z-10 text-center px-6">
        <div className="flex flex-wrap justify-center gap-1 mb-4">
          {LOVE_LETTERS.map((item) => (
            <motion.span
              key={item.id}
              className="font-display font-bold"
              style={{
                fontSize: "clamp(2.5rem, 10vw, 5rem)",
                color: "#FF85A2",
                textShadow:
                  "0 0 20px rgba(255,107,138,0.9), 0 0 50px rgba(233,30,99,0.6), 0 0 100px rgba(255,20,147,0.3)",
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
          <motion.span
            className="font-display italic"
            style={{
              fontSize: "clamp(1.8rem, 7vw, 3.5rem)",
              color: "#FFB6C1",
              textShadow: "0 0 16px rgba(255,107,138,0.8)",
            }}
            animate={{
              textShadow: [
                "0 0 16px rgba(255,107,138,0.6)",
                "0 0 32px rgba(255,107,138,1.0)",
                "0 0 16px rgba(255,107,138,0.6)",
              ],
            }}
            transition={{
              textShadow: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 2.2,
                ease: "easeInOut",
              },
            }}
          >
            My Diya
          </motion.span>
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
          "linear-gradient(160deg, #0a0010 0%, #150020 50%, #0a0010 100%)",
      }}
    >
      {/* Subtle sparkle bg */}
      <BackgroundParticles />
      <div
        className="relative z-10 w-full max-w-md mx-auto rounded-2xl p-6 md:p-8"
        style={{
          background: "rgba(10,0,20,0.75)",
          backdropFilter: "blur(18px)",
          boxShadow:
            "0 0 40px rgba(255,20,147,0.25), 0 0 80px rgba(255,20,147,0.1), 0 2px 16px rgba(0,0,0,0.5)",
          border: "1.5px solid rgba(255,107,138,0.5)",
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
                color: "#fce4ec",
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
                background: "linear-gradient(135deg, #FF1493 0%, #c4607a 100%)",
                boxShadow: "0 0 20px rgba(255,20,147,0.5)",
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
          "linear-gradient(135deg, #0a0010 0%, #1a0025 50%, #0d0018 100%)",
      }}
    >
      <FloatingHearts count={10} color="#FF69B4" />
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
          style={{
            fontSize: "clamp(1.6rem, 6vw, 2.4rem)",
            color: "#FFB6C1",
            textShadow:
              "0 0 16px rgba(255,107,138,0.7), 0 0 40px rgba(255,20,147,0.4)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Will you forgive me, Diya? 💗
        </motion.h2>
        <motion.p
          className="font-body text-base mb-8"
          style={{ color: "#f8c8d0" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          My heart can&apos;t rest until you do... 🌸
        </motion.p>
        <div className="flex gap-4 justify-center">
          <motion.button
            data-ocid="scene4.primary_button"
            className="px-8 py-3 rounded-xl font-body font-bold text-white text-lg"
            style={{
              background: "linear-gradient(135deg, #FF1493, #E91E63)",
              boxShadow: "0 6px 30px rgba(255,20,147,0.55)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: 1,
              y: 0,
              boxShadow: [
                "0 6px 20px rgba(255,20,147,0.45)",
                "0 6px 45px rgba(255,20,147,0.85)",
                "0 6px 20px rgba(255,20,147,0.45)",
              ],
            }}
            transition={{
              delay: 0.5,
              duration: 0.5,
              boxShadow: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.8,
                ease: "easeInOut",
              },
            }}
            onClick={onForgiven}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.06 }}
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
                borderColor: "#FF69B4",
                color: "#FF69B4",
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
            style={{ color: "#f8c8d0" }}
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
              : {
                  boxShadow: {
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    ease: "easeInOut",
                  },
                }
          }
        >
          {kissed ? "Kiss Sent! 💋" : "Send a Kiss 💋"}
        </motion.button>
      </div>
      {kissed && (
        <motion.p
          className="font-body text-sm"
          style={{ color: "#f9a8c0" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Virtual kiss delivered to Diya! 💕
        </motion.p>
      )}
    </div>
  );
}

const FINAL_SPARKLES = Array.from({ length: 12 }, (_, i) => ({
  id: `fs-${i}`,
  x: Math.cos((i / 12) * Math.PI * 2) * (60 + (i % 3) * 20),
  y: Math.sin((i / 12) * Math.PI * 2) * 35,
  emoji: ["✨", "⭐", "💫", "🌟"][i % 4],
  delay: 11.5 + i * 0.15,
}));

function Scene5() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    });
  }, [controls]);

  return (
    <div
      className="relative w-full h-full overflow-y-auto"
      style={{
        background:
          "linear-gradient(135deg, #0a0010 0%, #1a0025 30%, #0d0018 60%, #0a0010 100%)",
      }}
    >
      <BackgroundParticles />
      <ConfettiRain />

      <div className="relative z-10 flex flex-col items-center gap-8 px-5 py-10 max-w-lg mx-auto">
        {/* Section 1: Pick-up line */}
        <motion.div
          className="rounded-3xl p-6 w-full text-center"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(18px)",
            border: "2px solid rgba(255,107,138,0.5)",
            boxShadow:
              "0 0 30px rgba(255,107,138,0.25), 0 0 60px rgba(255,107,138,0.12), inset 0 0 30px rgba(255,107,138,0.05)",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, type: "spring" }}
        >
          <div className="text-3xl mb-4">💌</div>
          <p
            className="font-display italic leading-relaxed"
            style={{
              color: "#fce4ec",
              fontSize: "clamp(0.9rem, 2.8vw, 1.1rem)",
              lineHeight: 1.8,
            }}
          >
            {pickLine}
          </p>
        </motion.div>

        {/* Section 2: Poem */}
        <motion.div
          className="rounded-3xl p-6 w-full"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,180,200,0.3)",
            boxShadow: "0 6px 30px rgba(255,107,138,0.15)",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.9 }}
        >
          <motion.h3
            className="font-display font-bold mb-5 text-center"
            style={{
              color: "#ffb3c6",
              fontSize: "clamp(1.15rem, 4vw, 1.5rem)",
              textShadow: "0 0 14px rgba(255,107,138,0.6)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            A Poem for You 🌹
          </motion.h3>
          <div className="space-y-1 text-center">
            {poemLines.map((line, i) =>
              line.empty ? (
                <div key={line.id} className="h-3" />
              ) : (
                <motion.p
                  key={line.id}
                  className="font-display italic"
                  style={{
                    color: "#fce4ec",
                    fontSize: "clamp(0.88rem, 2.5vw, 1.05rem)",
                    lineHeight: 1.85,
                  }}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + i * 0.18, duration: 0.55 }}
                >
                  {line.text}
                </motion.p>
              ),
            )}
          </div>
        </motion.div>

        {/* Section 3: I love you forever */}
        <motion.div
          className="text-center py-4"
          initial={{ opacity: 0, scale: 0.85 }}
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
                "drop-shadow(0 0 30px rgba(233,30,99,0.95))",
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
          className="rounded-3xl p-6 w-full"
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
              textShadow: "0 0 12px rgba(255,107,138,0.5)",
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
          className="rounded-3xl p-6 w-full"
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
            style={{
              color: "#ffb3c6",
              fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
              textShadow: "0 0 10px rgba(255,107,138,0.4)",
            }}
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
          className="rounded-3xl p-6 w-full"
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
            style={{
              color: "#ffb3c6",
              fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
              textShadow: "0 0 10px rgba(255,107,138,0.4)",
            }}
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
            &ldquo;Diya, you are not just my girlfriend — you are my home, my
            calm, my everything. Every fight makes me realize how much I cannot
            live without you. You are the most precious thing that ever happened
            to me. I love you more than words can ever say. 🌹&rdquo;
          </motion.p>
        </motion.div>

        {/* Section 7: Send a Kiss */}
        <motion.div
          className="flex flex-col items-center w-full"
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
                  fontSize: "1.4rem",
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
                fontSize: "clamp(3rem, 12vw, 5.5rem)",
                background:
                  "linear-gradient(135deg, #FFD700 0%, #FFA500 30%, #FFD700 60%, #FFC000 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "0.05em",
              }}
              animate={{
                filter: [
                  "drop-shadow(0 0 14px rgba(255,215,0,0.5))",
                  "drop-shadow(0 0 40px rgba(255,215,0,0.95))",
                  "drop-shadow(0 0 14px rgba(255,215,0,0.5))",
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
      const t = setTimeout(() => setScene("scene2"), 10000);
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
