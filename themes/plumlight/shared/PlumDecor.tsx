import type { CSSProperties } from 'react';

interface Props { style?: CSSProperties; size?: number; opacity?: number; }

export function PlumDecor({ style, size = 140, opacity = 1 }: Props) {
  return (
    <svg
      className="plum-decor"
      width={size} height={size}
      viewBox="0 0 140 140"
      style={style}
      aria-hidden="true"
    >
      <g fill="#f2eadd" opacity={opacity}>
        {[0,1,2,3,4].map(i => {
          const a = (i * 72 - 90) * Math.PI/180;
          const cx = 70 + Math.cos(a) * 30;
          const cy = 70 + Math.sin(a) * 30;
          return <ellipse key={i} cx={cx} cy={cy} rx="26" ry="22" transform={`rotate(${i*72 - 90} ${cx} ${cy})`}/>;
        })}
        <circle cx="70" cy="70" r="18"/>
        {[0,1,2,3,4].map(i => {
          const a = (i * 72 - 90 + 36) * Math.PI/180;
          return <circle key={i} cx={70 + Math.cos(a)*14} cy={70 + Math.sin(a)*14} r="2" fill="#a26e33" opacity="0.5"/>;
        })}
      </g>
    </svg>
  );
}
