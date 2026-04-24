import { Link } from '@/i18n/routing';

interface Props { size?: number; }

export function BrandLogo({ size = 56 }: Props) {
  return (
    <Link href="/" className="logo">
      <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
        <circle cx="40" cy="40" r="36" fill="none" stroke="#a26e33" strokeWidth="1.2"/>
        <rect x="14" y="14" width="52" height="52" fill="none" stroke="#a26e33" strokeWidth="0.8"/>
        <g transform="translate(40 40)" fill="#a26e33">
          {[0,1,2,3,4].map(i => {
            const a = (i * 72 - 90) * Math.PI/180;
            const cx = Math.cos(a) * 10;
            const cy = Math.sin(a) * 10;
            return <circle key={i} cx={cx} cy={cy} r="7" opacity="0.95"/>;
          })}
          <circle cx="0" cy="0" r="4" fill="#b3292c"/>
          {[0,1,2,3,4].map(i => {
            const a = (i * 72 - 90) * Math.PI/180;
            return <line key={i} x1="0" y1="0" x2={Math.cos(a) * 7} y2={Math.sin(a) * 7} stroke="#fff" strokeWidth="0.8"/>;
          })}
        </g>
      </svg>
      <div className="logo-text">
        <span className="cn">梅妙蒔光</span>
        <span className="en">PLUMLIGHT CRAFTED</span>
      </div>
    </Link>
  );
}
