interface OrnamentProps { className?: string; }

export function Ornament({ className = 'ornament' }: OrnamentProps) {
  return (
    <svg className={className} viewBox="0 0 52 30" fill="currentColor" aria-hidden="true">
      <path d="M26 2 C30 8, 36 9, 44 6 C40 13, 40 18, 45 24 C36 22, 30 24, 26 28 C22 24, 16 22, 7 24 C12 18, 12 13, 8 6 C16 9, 22 8, 26 2 Z" opacity="0.9"/>
      <circle cx="26" cy="15" r="2.5" fill="#b3292c"/>
      <circle cx="15" cy="12" r="1.5"/>
      <circle cx="37" cy="12" r="1.5"/>
    </svg>
  );
}

export function SectionTitle({ cn, en }: { cn: string; en: string }) {
  return (
    <div className="section-title">
      <Ornament />
      <span className="cn">{cn}</span>
      <span className="en">{en}</span>
    </div>
  );
}
