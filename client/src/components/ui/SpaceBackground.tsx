'use client';

import { useEffect, useRef } from 'react';

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Planet Object Definition
    class Planet {
      x: number;
      y: number;
      radius: number;
      color1: string;
      color2: string;
      orbitSpeed: number;
      angle: number;
      orbitRadius: number;
      hasRing: boolean;

      constructor(orbitRadius: number, radius: number, speed: number, color1: string, color2: string, hasRing: boolean = false) {
        this.orbitRadius = orbitRadius;
        this.radius = radius;
        this.orbitSpeed = speed;
        this.color1 = color1;
        this.color2 = color2;
        this.hasRing = hasRing;
        this.angle = Math.random() * Math.PI * 2;
        this.x = 0;
        this.y = 0;
      }

      update(cx: number, cy: number) {
        this.angle += this.orbitSpeed;
        this.x = cx + Math.cos(this.angle) * this.orbitRadius;
        this.y = cy + Math.sin(this.angle) * this.orbitRadius * 0.6; // Elliptical orbit
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Ring
        if (this.hasRing) {
          ctx.beginPath();
          ctx.ellipse(0, 0, this.radius * 2.2, this.radius * 0.6, this.angle * 0.5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 4;
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(0, 0, this.radius * 2.5, this.radius * 0.8, this.angle * 0.5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(124, 58, 237, 0.05)'; // subtle violet ring
          ctx.lineWidth = 12;
          ctx.stroke();
        }

        // Planet Body
        const gradient = ctx.createRadialGradient(
          -this.radius * 0.3, -this.radius * 0.3, this.radius * 0.1,
          0, 0, this.radius
        );
        gradient.addColorStop(0, this.color1);
        gradient.addColorStop(1, this.color2);

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        
        // Soft Glow
        ctx.shadowColor = this.color1;
        ctx.shadowBlur = 30;
        ctx.fill();

        // Atmosphere edge
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
      }
    }

    // Floating Dust Particles
    const dust: {x: number, y: number, speed: number, size: number}[] = [];
    for (let i = 0; i < 150; i++) {
      dust.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.1 + Math.random() * 0.3,
        size: Math.random() * 1.5,
      });
    }

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const planets = [
      // Orbiting Planets
      new Planet(cx * 0.8, 60, 0.0005, 'rgba(124, 58, 237, 0.8)', 'rgba(10, 5, 30, 0.9)', true), // Violet Ringed
      new Planet(cx * 0.4, 30, -0.002, 'rgba(245, 158, 11, 0.7)', 'rgba(20, 10, 5, 0.9)', false), // Amber
      new Planet(cx * 1.2, 90, 0.0003, 'rgba(16, 185, 129, 0.4)', 'rgba(5, 15, 10, 0.9)', false), // Emerald Giant
      new Planet(cx * 0.6, 15, 0.003, 'rgba(255, 255, 255, 0.6)', 'rgba(0, 0, 0, 0.9)', false), // Small Moon
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear instead of fade for crisp edges
      
      const dynamicCx = canvas.width / 2;
      const dynamicCy = canvas.height / 2;

      // Draw dust layer
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (const p of dust) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.y -= p.speed;
        p.x -= p.speed * 0.5;
        if (p.x < 0) p.x = canvas.width;
        if (p.y < 0) p.y = canvas.height;
      }

      // Draw planets
      for (const planet of planets) {
        planet.update(dynamicCx, dynamicCy);
        planet.draw(ctx);
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020204]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Subtle overlay gradients for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050508]/50 to-[#050508]"></div>
    </div>
  );
}
