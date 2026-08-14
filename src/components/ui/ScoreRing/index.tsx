'use client';

import { useEffect, useRef } from 'react';
import styles from './ScoreRing.module.css';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  animate?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--score-excellent)';
  if (score >= 65) return 'var(--score-good)';
  if (score >= 45) return 'var(--score-fair)';
  return 'var(--score-poor)';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 45) return 'Fair';
  return 'Needs Work';
}

export default function ScoreRing({
  score,
  size = 160,
  strokeWidth = 10,
  label,
  sublabel,
  animate = true,
}: ScoreRingProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const offset = circumference - (clampedScore / 100) * circumference;
  const color = getScoreColor(clampedScore);

  return (
    <div className={styles.container} style={{ width: size, height: size }}>
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={styles.svg}
        aria-label={`Score: ${score} out of 100`}
        role="img"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />

        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className={animate ? styles.animated : ''}
          style={{
            transition: animate ? 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
        />
      </svg>

      {/* Center content */}
      <div className={styles.center}>
        <div className={styles.score} style={{ color }}>
          {clampedScore}
        </div>
        <div className={styles.scoreLabel} style={{ color }}>
          {getScoreLabel(clampedScore)}
        </div>
        {sublabel && <div className={styles.sublabel}>{sublabel}</div>}
      </div>
    </div>
  );
}
