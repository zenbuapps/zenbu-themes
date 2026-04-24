import type { CSSProperties } from 'react';

interface Props { style?: CSSProperties; size?: number; }

export function PlumBranch({ style, size = 120 }: Props) {
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 120 108" style={style} aria-hidden="true">
      <path d="M10 90 C 30 70, 50 60, 80 50 C 95 45, 105 38, 110 25" stroke="#a26e33" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <g fill="#b3292c">
        <circle cx="20" cy="85" r="6"/>
        <circle cx="45" cy="68" r="5"/>
        <circle cx="70" cy="56" r="5.5"/>
        <circle cx="95" cy="38" r="6"/>
      </g>
      <g fill="#a26e33" opacity="0.7">
        <circle cx="27" cy="82" r="2"/>
        <circle cx="52" cy="65" r="2"/>
        <circle cx="77" cy="53" r="2"/>
        <circle cx="102" cy="35" r="2"/>
      </g>
    </svg>
  );
}
