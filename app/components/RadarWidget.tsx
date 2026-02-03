'use client';

import { useEffect, useRef, useState } from 'react';

interface RadarWidgetProps {
  title?: string;
  className?: string;
}

interface ScanPoint {
  angle: number;
  distance: number;
  intensity: number;
  timestamp: number;
}

export default function RadarWidget({ title = 'Radar Scan', className }: RadarWidgetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanPoints, setScanPoints] = useState<ScanPoint[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const animationFrameRef = useRef<number>();
  const scanAngleRef = useRef(0);
  const lastUpdateRef = useRef<number>(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        // Square size from container so circle keeps proportions; min 120px, no max (fully responsive)
        const size = Math.max(Math.min(w, h), 120);
        if (size > 0 && (canvas.width !== size || canvas.height !== size)) {
          canvas.width = size;
          canvas.height = size;
        }
      } else {
        const size = 300;
        if (canvas.width !== size || canvas.height !== size) {
          canvas.width = size;
          canvas.height = size;
        }
      }
    };

    // Initial size setup with a small delay to ensure DOM is ready
    setTimeout(() => {
      updateCanvasSize();
    }, 0);

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Also observe window resize
    window.addEventListener('resize', updateCanvasSize);

    const drawGrid = (centerX: number, centerY: number, maxRadius: number) => {
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1;

      // Draw concentric circles
      for (let i = 1; i <= 5; i++) {
        const radius = (maxRadius / 5) * i;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw lines
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        const x = centerX + Math.cos(angle) * maxRadius;
        const y = centerY + Math.sin(angle) * maxRadius;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    };

    const drawScanLine = (angle: number, centerX: number, centerY: number, maxRadius: number) => {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      const x = centerX + Math.cos(angle) * maxRadius;
      const y = centerY + Math.sin(angle) * maxRadius;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    };

    const drawPoints = (centerX: number, centerY: number, maxRadius: number) => {
      const now = Date.now();
      const fadeTime = 2000; // Points fade after 2 seconds

      scanPoints.forEach((point) => {
        const age = now - point.timestamp;
        if (age > fadeTime) return;

        const alpha = 1 - age / fadeTime;
        const angle = point.angle;
        const distance = point.distance * maxRadius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        // Draw point with intensity-based size
        const size = 3 + point.intensity * 4;
        ctx.fillStyle = `rgba(16, 185, 129, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Draw glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, `rgba(16, 185, 129, ${alpha * 0.4})`);
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = (timestamp: number) => {
      // Ensure canvas is properly sized
      if (canvas.width === 0 || canvas.height === 0) {
        updateCanvasSize();
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (!isScanning) {
        // Still draw static frame when paused
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.min(centerX, centerY) - 40;
        
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGrid(centerX, centerY, maxRadius);
        drawPoints(centerX, centerY, maxRadius);
        
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = Math.min(timestamp - lastUpdateRef.current, 100); // Cap deltaTime to prevent huge jumps
      lastUpdateRef.current = timestamp;

      // Recalculate dimensions each frame in case canvas was resized
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(centerX, centerY) - 40;

      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      drawGrid(centerX, centerY, maxRadius);

      // Draw old scan points
      drawPoints(centerX, centerY, maxRadius);

      // Update scan angle
      scanAngleRef.current += (deltaTime / 16) * 0.02; // Adjust speed
      if (scanAngleRef.current > Math.PI * 2) {
        scanAngleRef.current -= Math.PI * 2;
      }

      // Draw scan line
      drawScanLine(scanAngleRef.current, centerX, centerY, maxRadius);

      // Randomly add scan points
      if (Math.random() < 0.1) {
        const newPoint: ScanPoint = {
          angle: scanAngleRef.current + (Math.random() - 0.5) * 0.3,
          distance: 0.3 + Math.random() * 0.6,
          intensity: Math.random(),
          timestamp: Date.now(),
        };
        setScanPoints((prev) => [...prev, newPoint].slice(-50)); // Keep last 50 points
      }

      // Clean up old points
      const now = Date.now();
      setScanPoints((prev) =>
        prev.filter((p) => now - p.timestamp < 2000)
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [scanPoints, isScanning]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 40;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy) / maxRadius;
    const angle = Math.atan2(dy, dx);

    if (distance <= 1) {
      const newPoint: ScanPoint = {
        angle,
        distance,
        intensity: 0.5 + Math.random() * 0.5,
        timestamp: Date.now(),
      };
      setScanPoints((prev) => [...prev, newPoint].slice(-50));
    }
  };

  return (
    <div className={`relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#0a0a0a] p-6 transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-900/50 ${className ?? ''}`}>
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <button
          onClick={() => setIsScanning(!isScanning)}
          className="rounded-lg bg-zinc-800/50 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
        >
          {isScanning ? 'Pause' : 'Resume'}
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="max-h-full max-w-full cursor-crosshair rounded-lg"
        />
      </div>
      <p className="mt-2 shrink-0 text-center text-xs text-zinc-500">
        Click to add detection points
      </p>
    </div>
  );
}
