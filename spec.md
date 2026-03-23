# Love Letter for Diya

## Current State
New project, no existing application.

## Requested Changes (Diff)

### Add
- Full-screen animated experience triggered when the QR code page is opened
- Scene 1: Animated tree growing with hearts floating up (canvas or CSS animation)
- Scene 2: "I love you my Diya" text reveal with romantic styling
- Scene 3: Apology message scroll — heartfelt paragraph in Bengali/English mix
- Scene 4: "Did you forgive your boy?" with Yes / No buttons (Instagram-viral style — No button runs away, Yes is the only real option)
- Scene 5 (after Yes): Romantic poem + heart-melting pick line with confetti/heart shower
- QR code display page so the user can scan it to reach the love letter

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: minimal actor, no real data needed
2. Frontend: Multi-scene single-page app with animated transitions
   - Scene transitions using fade/slide animations
   - Canvas-based or CSS tree + heart animation for Scene 1
   - Auto-advance Scene 1 -> 2 -> 3 after timed delays
   - Scene 4: interactive Yes/No buttons where No moves away on hover/tap
   - Scene 5: poem reveal with floating hearts animation
   - A separate /qr route that shows the QR code pointing to the main experience
