import type { PageBlock } from '../../types';
import { Ornament } from '../shared/Ornament';
import { PlumDecor } from '../shared/PlumDecor';

interface Props {
  block: PageBlock;
  content: Record<string, string>;
}

export function PlumlightAbout({ block, content }: Props) {
  const b = block as unknown as { imageUrl?: string };
  const imageUrl = b.imageUrl ?? '/themes/plumlight/plum-hand.jpg';
  const title = content.section_title ?? '用時光的溫度，釀成每一顆入口的風味';
  const body = content.body ?? '';

  return (
    <section className="about">
      <PlumDecor style={{ left: -60, top: -40 }} size={220} />
      <PlumDecor style={{ right: -40, bottom: -60, transform: 'rotate(120deg)' }} size={180} />
      <div className="about-inner">
        <div className="about-left">
          <div className="about-img" style={{ backgroundImage: `url(${imageUrl})` }} />
          <div className="about-stamp">
            <svg width="52" height="52" viewBox="0 0 52 52">
              <g transform="translate(26 26)" fill="#f2eadd">
                {[0, 1, 2, 3, 4].map((i) => {
                  const a = (i * 72 - 90) * Math.PI / 180;
                  return <circle key={i} cx={Math.cos(a) * 9} cy={Math.sin(a) * 9} r="6.5" />;
                })}
                <circle cx="0" cy="0" r="3" fill="#fff" />
              </g>
            </svg>
          </div>
        </div>
        <div className="about-right">
          <Ornament />
          <h3 style={{ whiteSpace: 'pre-line' }}>「 {title} 」</h3>
          <p style={{ whiteSpace: 'pre-line' }}>{body}</p>
        </div>
      </div>
    </section>
  );
}
