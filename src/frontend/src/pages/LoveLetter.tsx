import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

// Static arrays to avoid index key issues
const FLOAT_HEART_ITEMS = Array.from({ length: 12 }, (_, i) => ({
  id: `fh-${i}`,
  left: `${10 + ((i * 11) % 80)}%`,
  bottom: `${5 + ((i * 7) % 30)}%`,
  delay: `${i * 0.4}s`,
  duration: `${2.5 + (i % 3) * 0.8}s`,
  size: `${14 + (i % 4) * 6}px`,
}));

const RAIN_HEART_ITEMS = Array.from({ length: 20 }, (_, i) => ({
  id: `rh-${i}`,
  left: `${(i * 13) % 95}%`,
  delay: `${i * 0.3}s`,
  duration: `${3 + (i % 4) * 0.5}s`,
  size: `${12 + (i % 5) * 8}px`,
  emoji: i % 3 === 0 ? "\uD83D\uDC95" : i % 3 === 1 ? "\u2764\uFE0F" : "\u2728",
}));

const STAR_ITEMS = Array.from({ length: 30 }, (_, i) => ({
  id: `star-${i}`,
  left: `${(i * 17) % 95}%`,
  top: `${(i * 11) % 60}%`,
  size: `${1 + (i % 3)}px`,
  delay: `${i * 0.2}s`,
  duration: `${1 + (i % 3) * 0.5}s`,
}));

const TREE_HEARTS = [
  { id: "th-0", x: 60, y: 175, delay: 2.5 },
  { id: "th-1", x: 195, y: 170, delay: 2.7 },
  { id: "th-2", x: 105, y: 105, delay: 2.9 },
  { id: "th-3", x: 160, y: 110, delay: 3.1 },
];

const TREE_FLOAT_HEARTS = [
  { id: "tfh-0", left: "25%", delay: "2s", duration: "2.5s" },
  { id: "tfh-1", left: "43%", delay: "2.7s", duration: "2.9s" },
  { id: "tfh-2", left: "61%", delay: "3.4s", duration: "3.3s" },
  { id: "tfh-3", left: "79%", delay: "4.1s", duration: "3.7s" },
];

const LOVE_LETTERS = "I Love You"
  .split("")
  .map((l, i) => ({ id: `ll-${i}`, char: l, delay: i * 0.08 }));

// ─── Floating hearts ───────────────────────────────────────────────────────────
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

// ─── Rain hearts (scene 5) ────────────────────────────────────────────────
function RainHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {RAIN_HEART_ITEMS.map((item) => (
        <div
          key={item.id}
          className="absolute animate-rain-heart"
          style={{
            left: item.left,
            top: "-40px",
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

// ─── SCENE 1: Tree ───────────────────────────────────────────────────────────
function Scene1() {
  return (
    <div
      className="relative flex flex-col items-center justify-center w-full h-full"
      style={{
        background:
          "linear-gradient(180deg, #0e0818 0%, #1A1020 50%, #2a1030 100%)",
      }}
    >
      {STAR_ITEMS.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-sparkle"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            background: "white",
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}

      <div className="relative z-10" style={{ marginBottom: "40px" }}>
        <svg
          width="280"
          height="340"
          viewBox="0 0 280 340"
          fill="none"
          role="img"
          aria-label="A romantic tree growing with hearts"
        >
          <motion.rect
            x="126"
            y="220"
            width="28"
            height="120"
            rx="6"
            fill="#5C3D1E"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            style={{ transformOrigin: "140px 340px" }}
          />
          <motion.polygon
            points="140,40 240,200 40,200"
            fill="#2d5a27"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            style={{ transformOrigin: "140px 200px" }}
          />
          <motion.polygon
            points="140,80 220,210 60,210"
            fill="#3a7a32"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            style={{ transformOrigin: "140px 210px" }}
          />
          <motion.polygon
            points="140,130 200,230 80,230"
            fill="#4a9440"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            style={{ transformOrigin: "140px 230px" }}
          />
          <motion.text
            x="118"
            y="165"
            fontSize="32"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 2.2, type: "spring" }}
            style={{ transformOrigin: "140px 160px" }}
          >
            ❤️
          </motion.text>
          {TREE_HEARTS.map((h) => (
            <motion.text
              key={h.id}
              x={h.x}
              y={h.y}
              fontSize="16"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: h.delay, type: "spring" }}
              style={{ transformOrigin: `${h.x + 8}px ${h.y}px` }}
            >
              💕
            </motion.text>
          ))}
        </svg>

        {TREE_FLOAT_HEARTS.map((item) => (
          <div
            key={item.id}
            className="absolute animate-float-heart"
            style={{
              left: item.left,
              bottom: "60%",
              animationDelay: item.delay,
              animationDuration: item.duration,
              fontSize: "20px",
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      <motion.p
        className="absolute bottom-16 text-center font-body text-lg tracking-widest"
        style={{ color: "#D47A86" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        ✨ Scan with love... ✨
      </motion.p>
    </div>
  );
}

// ─── SCENE 2: I Love You ─────────────────────────────────────────────────────
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

// ─── SCENE 3: Apology ──────────────────────────────────────────────────────
const apologyParagraphs = [
  {
    id: "ap-0",
    text: "Recently maybe I hurt you... I\u2019m so sorry \uD83D\uDC94",
    style: "normal" as const,
  },
  {
    id: "ap-1",
    text: "I am feeling that much bad for hurting my most precious person...",
    style: "normal" as const,
  },
  {
    id: "ap-2",
    text: "Ami jare amr life taika o Beshi love Korih \uD83C\uDF39",
    style: "italic" as const,
  },
  {
    id: "ap-3",
    text: "I would die if she leaves me... I just can\u2019t live without her.",
    style: "normal" as const,
  },
  {
    id: "ap-4",
    text: "Her texts, her sweetness, her cuteness, her charm... her everything is killing me from inside \uD83D\uDC95",
    style: "normal" as const,
  },
  {
    id: "ap-5",
    text: "I want to be her boy for my whole life.",
    style: "bold" as const,
  },
  {
    id: "ap-6",
    text: "Sorry for hurting my sweetheart. \uD83D\uDE4F",
    style: "bold" as const,
  },
];

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

// ─── SCENE 4: Forgiveness ────────────────────────────────────────────────────
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

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <span style={{ fontSize: "3rem" }}>🥺</span>
          <h2
            className="font-display font-bold mt-4 mb-10"
            style={{
              fontSize: "clamp(1.8rem, 7vw, 3rem)",
              color: "#1A1A1A",
              lineHeight: 1.2,
            }}
          >
            Did you forgive your boy?
          </h2>
        </motion.div>

        <motion.button
          data-ocid="scene4.primary_button"
          className="block mx-auto px-10 py-4 rounded-2xl font-body font-bold text-white text-xl"
          style={{
            background: "linear-gradient(135deg, #D47A86 0%, #c4607a 100%)",
            minWidth: "180px",
            boxShadow: "0 8px 24px rgba(212,122,134,0.4)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
          onClick={onForgiven}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          Yes 💖
        </motion.button>

        {!noGone && (
          <motion.button
            data-ocid="scene4.secondary_button"
            className="font-body font-medium text-sm border rounded-xl px-5 py-2 mt-4"
            style={{
              position: noPos ? "fixed" : "relative",
              left: noPos ? `${noPos.x}px` : "auto",
              top: noPos ? `${noPos.y}px` : "auto",
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

// ─── SCENE 5: Poem ───────────────────────────────────────────────────────────
const pickLine =
  "If I could rearrange the alphabet, I\u2019d put U and I together... but honestly, you already rearranged my whole world, Diya. \uD83C\uDF0D\u2764\uFE0F";

const poemLines = [
  { id: "pl-0", text: "In every heartbeat, I hear your name,", empty: false },
  {
    id: "pl-1",
    text: "In every sunrise, you\u2019re my eternal flame.",
    empty: false,
  },
  {
    id: "pl-2",
    text: "I\u2019m sorry I hurt you, my love so true,",
    empty: false,
  },
  { id: "pl-3", text: "Every breath I take belongs to you.", empty: false },
  { id: "pl-4", text: "", empty: true },
  { id: "pl-5", text: "You are my reason, my peace, my sky,", empty: false },
  {
    id: "pl-6",
    text: "Without you, Diya, I\u2019d forget how to fly.",
    empty: false,
  },
  {
    id: "pl-7",
    text: "Forgive me, love, let\u2019s start anew,",
    empty: false,
  },
  {
    id: "pl-8",
    text: "Because my whole world... is only you. \uD83D\uDC95",
    empty: false,
  },
];

function Scene5() {
  return (
    <div
      className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #2d0a2e 0%, #1A1020 40%, #3d1035 100%)",
      }}
    >
      <RainHearts />

      <div className="relative z-10 text-center px-6 w-full max-w-lg mx-auto">
        <motion.div
          className="rounded-2xl p-5 mb-6"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(212,122,134,0.3)",
            backdropFilter: "blur(8px)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p
            className="font-display italic"
            style={{
              color: "#f8c8d0",
              fontSize: "clamp(0.95rem, 3vw, 1.2rem)",
              lineHeight: 1.6,
            }}
          >
            {pickLine}
          </p>
        </motion.div>

        <motion.div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(212,122,134,0.2)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {poemLines.map((line, i) =>
            line.empty ? (
              <div key={line.id} className="h-4" />
            ) : (
              <motion.p
                key={line.id}
                className="font-body"
                style={{
                  color: "#fce4ec",
                  fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                  lineHeight: 1.9,
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

        <motion.p
          className="mt-8 font-script animate-glow"
          style={{ fontSize: "clamp(1.4rem, 5vw, 2rem)", color: "#D47A86" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 4.5, duration: 1, type: "spring" }}
        >
          I love you forever, Diya 💍
        </motion.p>
      </div>
    </div>
  );
}

// ─── Main orchestrator ───────────────────────────────────────────────────────────────
export default function LoveLetter() {
  const [scene, setScene] = useState(0);
  const goTo = useCallback((s: number) => setScene(s), []);

  useEffect(() => {
    if (scene !== 0) return;
    const t = setTimeout(() => goTo(1), 4000);
    return () => clearTimeout(t);
  }, [scene, goTo]);

  useEffect(() => {
    if (scene !== 1) return;
    const t = setTimeout(() => goTo(2), 3000);
    return () => clearTimeout(t);
  }, [scene, goTo]);

  const sceneVariants = {
    initial: { opacity: 0, scale: 1.04 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ fontFamily: "'Figtree', sans-serif" }}
    >
      <AnimatePresence mode="wait">
        {scene === 0 && (
          <motion.div
            key="scene0"
            className="absolute inset-0"
            {...sceneVariants}
            transition={{ duration: 0.7 }}
          >
            <Scene1 />
          </motion.div>
        )}
        {scene === 1 && (
          <motion.div
            key="scene1"
            className="absolute inset-0"
            {...sceneVariants}
            transition={{ duration: 0.7 }}
          >
            <Scene2 />
          </motion.div>
        )}
        {scene === 2 && (
          <motion.div
            key="scene2"
            className="absolute inset-0"
            {...sceneVariants}
            transition={{ duration: 0.7 }}
          >
            <Scene3 onNext={() => goTo(3)} />
          </motion.div>
        )}
        {scene === 3 && (
          <motion.div
            key="scene3"
            className="absolute inset-0"
            {...sceneVariants}
            transition={{ duration: 0.7 }}
          >
            <Scene4 onForgiven={() => goTo(4)} />
          </motion.div>
        )}
        {scene === 4 && (
          <motion.div
            key="scene4"
            className="absolute inset-0"
            {...sceneVariants}
            transition={{ duration: 0.7 }}
          >
            <Scene5 />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
