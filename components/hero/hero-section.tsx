"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

// ═══════════════════════════════════════════
// Building Drawing — empty land → building rises
// ═══════════════════════════════════════════
function drawScene(ctx: CanvasRenderingContext2D, w: number, h: number, ratio: number) {
  // ── Sky gradient (darkens as building goes up) ──
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.7);
  const skyR = Math.round(15 + ratio * 25);
  const skyG = Math.round(18 + ratio * 35);
  const skyB = Math.round(40 + ratio * 50);
  skyGrad.addColorStop(0, `rgb(${skyR}, ${skyG}, ${skyB})`);
  skyGrad.addColorStop(1, `rgb(${skyR + 10}, ${skyG + 8}, ${skyB - 10})`);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // ── Stars (fade out as building lights come on) ──
  const starAlpha = Math.max(0, 0.6 - ratio * 0.4);
  if (starAlpha > 0) {
    ctx.fillStyle = `rgba(255,255,255,${starAlpha})`;
    const seed = 42;
    for (let i = 0; i < 60; i++) {
      const sx = ((seed * (i + 1) * 7) % 1000) / 1000 * w;
      const sy = ((seed * (i + 1) * 13) % 1000) / 1000 * h * 0.5;
      const ss = ((i % 3) + 1) * 0.8;
      ctx.beginPath();
      ctx.arc(sx, sy, ss, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── Ground / Land ──
  const groundY = h * 0.72;
  // Dirt ground
  const groundGrad = ctx.createLinearGradient(0, groundY, 0, h);
  groundGrad.addColorStop(0, "#3d3528");
  groundGrad.addColorStop(0.3, "#2a2318");
  groundGrad.addColorStop(1, "#1a1510");
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, groundY, w, h - groundY);

  // Ground line
  ctx.strokeStyle = "rgba(80, 65, 40, 0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(w, groundY);
  ctx.stroke();

  // Grass patches
  ctx.fillStyle = "rgba(60, 80, 30, 0.4)";
  for (let i = 0; i < 20; i++) {
    const gx = (i / 20) * w + Math.sin(i * 3) * 20;
    ctx.fillRect(gx, groundY - 2, 30 + (i % 3) * 10, 4);
  }

  // ── Building dimensions ──
  const bldgW = w * 0.22;
  const bldgMaxH = h * 0.55;
  const bldgX = w * 0.5 - bldgW / 2;
  const bldgH = bldgMaxH * ratio;
  const bldgY = groundY - bldgH;
  const floors = Math.floor(ratio * 12);

  if (ratio < 0.02) return; // Nothing to draw yet

  // ── Foundation (0~10%) ──
  if (ratio > 0) {
    const foundH = Math.min(ratio / 0.1, 1) * 12;
    ctx.fillStyle = "#4a4a4a";
    ctx.fillRect(bldgX - 8, groundY - foundH, bldgW + 16, foundH);
    // Foundation lines
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bldgX - 8, groundY - foundH);
    ctx.lineTo(bldgX + bldgW + 8, groundY - foundH);
    ctx.stroke();
  }

  // ── Main building body ──
  if (ratio > 0.08) {
    // Building shadow
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(bldgX + bldgW, bldgY + 10, 15, bldgH - 10);

    // Building body
    const bldgGrad = ctx.createLinearGradient(bldgX, 0, bldgX + bldgW, 0);
    bldgGrad.addColorStop(0, "#5a6a7a");
    bldgGrad.addColorStop(0.5, "#708090");
    bldgGrad.addColorStop(1, "#4a5a6a");
    ctx.fillStyle = bldgGrad;
    ctx.fillRect(bldgX, bldgY, bldgW, bldgH);

    // ── Floors & Windows ──
    const floorH = bldgH / Math.max(floors, 1);
    for (let f = 0; f < floors; f++) {
      const fy = groundY - (f + 1) * floorH;
      // Floor line
      ctx.strokeStyle = "rgba(40,50,60,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bldgX, fy);
      ctx.lineTo(bldgX + bldgW, fy);
      ctx.stroke();

      // Windows (3 columns)
      const winW = bldgW * 0.18;
      const winH = floorH * 0.5;
      const winY = fy + floorH * 0.25;
      for (let col = 0; col < 3; col++) {
        const winX = bldgX + bldgW * 0.12 + col * (bldgW * 0.3);
        // Window lit based on completion
        const lit = ratio > 0.7 && ((f + col) % 3 !== 0);
        if (lit) {
          ctx.fillStyle = `rgba(255, 220, 120, ${0.6 + Math.sin(f * 2 + col) * 0.2})`;
          ctx.shadowColor = "rgba(255, 200, 80, 0.4)";
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(100, 140, 180, ${0.3 + ratio * 0.3})`;
          ctx.shadowBlur = 0;
        }
        ctx.fillRect(winX, winY, winW, winH);
        ctx.shadowBlur = 0;

        // Window frame
        ctx.strokeStyle = "rgba(40,50,60,0.4)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(winX, winY, winW, winH);
        // Cross
        ctx.beginPath();
        ctx.moveTo(winX + winW / 2, winY);
        ctx.lineTo(winX + winW / 2, winY + winH);
        ctx.moveTo(winX, winY + winH / 2);
        ctx.lineTo(winX + winW, winY + winH / 2);
        ctx.stroke();
      }
    }

    // ── Roof (appears at 80%+) ──
    if (ratio > 0.8) {
      const roofProgress = (ratio - 0.8) / 0.2;
      ctx.fillStyle = "#3a4a5a";
      ctx.beginPath();
      ctx.moveTo(bldgX - 5, bldgY);
      ctx.lineTo(bldgX + bldgW / 2, bldgY - 20 * roofProgress);
      ctx.lineTo(bldgX + bldgW + 5, bldgY);
      ctx.closePath();
      ctx.fill();
    }

    // ── Entrance (appears at 50%+) ──
    if (ratio > 0.5) {
      const doorProgress = Math.min((ratio - 0.5) / 0.2, 1);
      const doorW = bldgW * 0.2;
      const doorH = floorH * 0.8 * doorProgress;
      const doorX = bldgX + bldgW / 2 - doorW / 2;
      ctx.fillStyle = "#2a2a3a";
      ctx.fillRect(doorX, groundY - doorH, doorW, doorH);
      // Door frame
      ctx.strokeStyle = "#8a8a6a";
      ctx.lineWidth = 2;
      ctx.strokeRect(doorX, groundY - doorH, doorW, doorH);
    }
  }

  // ── Construction crane (visible 10%~90%) ──
  if (ratio > 0.08 && ratio < 0.92) {
    const craneAlpha = ratio < 0.15 ? (ratio - 0.08) / 0.07 : ratio > 0.85 ? (0.92 - ratio) / 0.07 : 1;
    ctx.globalAlpha = craneAlpha * 0.8;
    const craneX = bldgX + bldgW + 30;
    const craneTop = bldgY - 40;
    // Vertical pole
    ctx.fillStyle = "#c8a030";
    ctx.fillRect(craneX, craneTop, 4, groundY - craneTop);
    // Horizontal arm
    ctx.fillRect(craneX - 60, craneTop, 120, 3);
    // Cable
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(craneX - 40, craneTop + 3);
    ctx.lineTo(craneX - 40, craneTop + 30);
    ctx.stroke();
    // Hook block
    ctx.fillStyle = "#999";
    ctx.fillRect(craneX - 44, craneTop + 28, 8, 8);
    ctx.globalAlpha = 1;
  }

  // ── Small background buildings (appear at 60%+) ──
  if (ratio > 0.6) {
    const bgAlpha = (ratio - 0.6) / 0.4;
    ctx.globalAlpha = bgAlpha * 0.3;
    // Left building
    ctx.fillStyle = "#3a4050";
    ctx.fillRect(w * 0.08, groundY - h * 0.18, w * 0.08, h * 0.18);
    ctx.fillRect(w * 0.18, groundY - h * 0.12, w * 0.06, h * 0.12);
    // Right building
    ctx.fillRect(w * 0.75, groundY - h * 0.22, w * 0.07, h * 0.22);
    ctx.fillRect(w * 0.84, groundY - h * 0.14, w * 0.08, h * 0.14);
    ctx.globalAlpha = 1;
  }
}

// ═══════════════════════════════════════════
// Dust Particle
// ═══════════════════════════════════════════
class DustParticle {
  x: number; y: number; size: number; speedY: number; speedX: number;
  opacity: number; life: number; decay: number; color: string;
  canvasW: number; canvasH: number;

  constructor(canvasW: number, canvasH: number) {
    this.canvasW = canvasW; this.canvasH = canvasH;
    this.x = 0; this.y = 0; this.size = 0; this.speedY = 0; this.speedX = 0;
    this.opacity = 0; this.life = 0; this.decay = 0; this.color = "";
    this.reset();
  }

  reset() {
    this.x = this.canvasW * 0.3 + Math.random() * this.canvasW * 0.4;
    this.y = this.canvasH * 0.65 + Math.random() * this.canvasH * 0.1;
    this.size = Math.random() * 2.5 + 1;
    this.speedY = -(Math.random() * 1.2 + 0.3);
    this.speedX = (Math.random() - 0.5) * 1.5;
    this.opacity = Math.random() * 0.35 + 0.1;
    this.life = 1;
    this.decay = Math.random() * 0.01 + 0.005;
    const colors = ["180,160,120", "200,180,140", "160,140,100"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
    if (this.life <= 0) this.reset();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity * this.life;
    ctx.fillStyle = `rgba(${this.color}, 1)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ═══════════════════════════════════════════
// Hand detection helpers
// ═══════════════════════════════════════════
function getAngle(a: {x:number;y:number;z?:number}, b: {x:number;y:number;z?:number}, c: {x:number;y:number;z?:number}) {
  const ba = { x: a.x - b.x, y: a.y - b.y, z: (a.z||0) - (b.z||0) };
  const bc = { x: c.x - b.x, y: c.y - b.y, z: (c.z||0) - (b.z||0) };
  const dot = ba.x*bc.x + ba.y*bc.y + ba.z*bc.z;
  const magBA = Math.sqrt(ba.x**2 + ba.y**2 + ba.z**2);
  const magBC = Math.sqrt(bc.x**2 + bc.y**2 + bc.z**2);
  if (magBA === 0 || magBC === 0) return 180;
  return Math.acos(Math.max(-1, Math.min(1, dot / (magBA * magBC)))) * (180 / Math.PI);
}

function dist2D(a: {x:number;y:number}, b: {x:number;y:number}) {
  return Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2);
}

function getFingerOpenness(lm: any[], mcpIdx: number, pipIdx: number, dipIdx: number, tipIdx: number) {
  const angle = getAngle(lm[mcpIdx], lm[pipIdx], lm[tipIdx]);
  const tipAboveMcp = lm[mcpIdx].y - lm[tipIdx].y;
  const handSize = dist2D(lm[0], lm[9]);
  const angleRatio = Math.max(0, Math.min(1, (angle - 50) / 80));
  const yRatio = Math.max(0, Math.min(1, (tipAboveMcp / (handSize + 0.001) + 0.15) / 0.5));
  return angleRatio * 0.5 + yRatio * 0.5;
}

function getThumbOpenness(lm: any[]) {
  const thumbTipToPinkyMcp = dist2D(lm[4], lm[17]);
  const handSize = dist2D(lm[0], lm[9]);
  const angle = getAngle(lm[2], lm[3], lm[4]);
  const angleRatio = Math.max(0, Math.min(1, (angle - 70) / 60));
  const distRatio = Math.max(0, Math.min(1, (thumbTipToPinkyMcp / (handSize + 0.001) - 0.4) / 0.8));
  return distRatio * 0.5 + angleRatio * 0.5;
}

function calculateOpenRatio(lm: any[]) {
  const t = getThumbOpenness(lm);
  const i = getFingerOpenness(lm, 5, 6, 7, 8);
  const m = getFingerOpenness(lm, 9, 10, 11, 12);
  const r = getFingerOpenness(lm, 13, 14, 15, 16);
  const p = getFingerOpenness(lm, 17, 18, 19, 20);
  return Math.max(0, Math.min(1, t*0.15 + i*0.25 + m*0.25 + r*0.2 + p*0.15));
}

// ═══════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════
export default function HeroSection() {
  const webcamRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    started: false,
    openRatio: 0,
    targetRatio: 0,
    dustParticles: [] as DustParticle[],
  });
  const [buildPercent, setBuildPercent] = useState(0);
  const [controlLabel, setControlLabel] = useState("대기 중");

  // Initialize on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const dust: DustParticle[] = [];
    for (let i = 0; i < 40; i++) {
      dust.push(new DustParticle(canvas.width, canvas.height));
    }
    stateRef.current.dustParticles = dust;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation loop
  const animationLoop = useCallback(() => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    s.openRatio += (s.targetRatio - s.openRatio) * 0.25;
    s.openRatio = Math.max(0, Math.min(1, s.openRatio));

    setBuildPercent(Math.round(s.openRatio * 100));

    if (canvas && ctx) {
      // Draw the full scene (sky, ground, building)
      drawScene(ctx, canvas.width, canvas.height, s.openRatio);

      // Dust particles during construction
      if (s.openRatio > 0.05 && s.openRatio < 0.95) {
        const activeCount = Math.floor(s.dustParticles.length * Math.min((s.openRatio - 0.05) / 0.3, 1));
        for (let i = 0; i < activeCount; i++) {
          s.dustParticles[i].update();
          s.dustParticles[i].draw(ctx);
        }
      }
    }

    requestAnimationFrame(animationLoop);
  }, []);

  // Auto-start on mount
  useEffect(() => {
    if (stateRef.current.started) return;
    stateRef.current.started = true;

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
          await webcamRef.current.play();
        }
        setControlLabel("손 제스처 모드");

        const handsScript = document.createElement("script");
        handsScript.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.js";
        const cameraScript = document.createElement("script");
        cameraScript.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1675466862/camera_utils.js";

        document.head.appendChild(handsScript);
        document.head.appendChild(cameraScript);

        handsScript.onload = () => {
          cameraScript.onload = () => {
            const Hands = (window as any).Hands;
            const Camera = (window as any).Camera;

            const hands = new Hands({
              locateFile: (file: string) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
            });
            hands.setOptions({
              maxNumHands: 1,
              modelComplexity: 0,
              minDetectionConfidence: 0.3,
              minTrackingConfidence: 0.2,
            });
            hands.onResults((results: any) => {
              if (results.multiHandLandmarks?.length > 0) {
                stateRef.current.targetRatio = calculateOpenRatio(results.multiHandLandmarks[0]);
              }
            });

            const camera = new Camera(webcamRef.current, {
              onFrame: async () => { try { await hands.send({ image: webcamRef.current }); } catch {} },
              width: 640,
              height: 480,
            });
            camera.start();
          };
        };
      } catch {
        setControlLabel("마우스 모드");
        const onMouseMove = (e: MouseEvent) => {
          stateRef.current.targetRatio = Math.max(0, Math.min(1, 1 - e.clientY / window.innerHeight));
        };
        window.addEventListener("mousemove", onMouseMove);
      }

      requestAnimationFrame(animationLoop);
    };

    init();
  }, [animationLoop]);

  return (
    <section className="relative w-screen h-screen overflow-hidden bg-[#0f1218]">
      {/* Main canvas — draws everything */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[1]" />

      {/* Content overlay */}
      <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <h1 className="text-[clamp(26px,4.5vw,52px)] font-bold text-white leading-tight mb-4 animate-[fadeUp_1s_ease_0.3s_both]"
          style={{ textShadow: "0 0 40px rgba(255,180,80,0.3), 0 0 80px rgba(200,140,40,0.15)" }}>
          당신의 손으로<br />직접 건물을 건축해보세요
        </h1>
        <p className="text-[clamp(13px,1.8vw,18px)] font-light text-white/60 mb-3 animate-[fadeUp_1s_ease_0.6s_both]">
          카메라에 주먹을 쥐었다 폈다 해보세요
        </p>
        <p className="text-[clamp(11px,1.4vw,14px)] font-light text-white/35 mb-10 animate-[fadeUp_1s_ease_0.8s_both]">
          손을 펼치면 건물이 올라가고, 주먹을 쥐면 다시 내려갑니다
        </p>

        <Link
          href="/properties/land"
          className="pointer-events-auto mt-4 px-8 py-3 text-sm font-medium text-white bg-emerald-600/80 border border-emerald-400/30 rounded-full backdrop-blur-xl transition-all hover:bg-emerald-600 hover:-translate-y-0.5 animate-[fadeUp_1s_ease_1s_both]"
        >
          매물 둘러보기
        </Link>
      </div>

      {/* Hidden webcam */}
      <div className="fixed top-0 left-0 w-px h-px overflow-hidden opacity-[0.01] pointer-events-none -z-10">
        <video ref={webcamRef} className="w-[640px] h-[480px]" autoPlay playsInline muted />
      </div>

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-[3px] z-10 bg-gradient-to-r from-sky-500 via-amber-400 to-amber-500 transition-[width] duration-100"
        style={{ width: `${buildPercent}%` }}
      />

      {/* Build info */}
      <div className="absolute bottom-6 left-6 z-10 text-[13px] text-white/40 tabular-nums">
        BUILD {buildPercent}%
      </div>

      {/* Control mode */}
      <div className="absolute top-6 right-6 z-10 px-3.5 py-1.5 text-xs text-white/50 bg-white/5 border border-white/10 rounded-full backdrop-blur-lg">
        {controlLabel}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-white/30">아래로 스크롤</span>
        <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
