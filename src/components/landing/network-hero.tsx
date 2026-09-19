"use client";
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Subtle animated intelligence-network background (spec §59,96).
 * Deterministic node layout, extremely low opacity, no heavy particles.
 */
const NODES = [
  { x: 12, y: 22, r: 3, kind: "mineral" },
  { x: 26, y: 44, r: 2, kind: "tech" },
  { x: 40, y: 18, r: 2.5, kind: "patent" },
  { x: 58, y: 34, r: 3.5, kind: "tech" },
  { x: 72, y: 20, r: 2, kind: "org" },
  { x: 84, y: 40, r: 3, kind: "mineral" },
  { x: 30, y: 68, r: 2.5, kind: "rd" },
  { x: 50, y: 60, r: 3, kind: "patent" },
  { x: 66, y: 72, r: 2, kind: "org" },
  { x: 88, y: 68, r: 2.5, kind: "rd" },
  { x: 18, y: 86, r: 2, kind: "tech" },
  { x: 46, y: 88, r: 3, kind: "mineral" },
  { x: 76, y: 90, r: 2, kind: "patent" },
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [1, 6], [6, 7], [3, 7], [7, 8], [5, 9],
  [8, 9], [6, 10], [10, 11], [7, 11], [11, 12], [8, 12], [0, 6], [2, 7], [4, 8],
];

const KIND_COLOR: Record<string, string> = {
  mineral: "rgb(206 139 78)",
  tech: "rgb(86 166 189)",
  patent: "rgb(162 171 179)",
  org: "rgb(91 141 239)",
  rd: "rgb(79 169 126)",
};

export function NetworkHero() {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute right-[-10%] top-1/2 h-[80vh] w-[80vh] -translate-y-1/2 opacity-70">
        <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
          <g stroke="rgb(51 58 66)" strokeWidth={0.15}>
            {EDGES.map(([a, b], i) => (
              <motion.line
                key={i}
                x1={NODES[a].x}
                y1={NODES[a].y}
                x2={NODES[b].x}
                y2={NODES[b].y}
                initial={{ opacity: 0.15 }}
                animate={reduce ? undefined : { opacity: [0.1, 0.35, 0.1] }}
                transition={{ duration: 6, repeat: Infinity, delay: (i % 5) * 0.6 }}
              />
            ))}
          </g>
          {NODES.map((n, i) => (
            <motion.circle
              key={i}
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill={KIND_COLOR[n.kind]}
              initial={{ opacity: 0.25 }}
              animate={reduce ? undefined : { opacity: [0.2, 0.6, 0.2], scale: [1, 1.15, 1] }}
              transition={{ duration: 5, repeat: Infinity, delay: (i % 4) * 0.8 }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            />
          ))}
        </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
    </div>
  );
}
