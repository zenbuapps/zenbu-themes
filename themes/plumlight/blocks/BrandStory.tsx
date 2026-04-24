import type { PageBlock } from '../../types';
import { Ornament } from '../shared/Ornament';
import { PlumDecor } from '../shared/PlumDecor';

interface StorySection {
  imageUrl: string;
  layout: 'image-left' | 'image-right';
}

interface Props {
  block: PageBlock;
  content: Record<string, string>;
}

function OvalPhoto({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="oval-framed">
      <div className="outer" />
      <div className="inner-frame" />
      <div className="photo" style={{ backgroundImage: `url(${imageUrl})` }} />
    </div>
  );
}

export function BrandStory({ block, content }: Props) {
  const b = block as unknown as { sections?: StorySection[] };
  const sections = Array.isArray(b.sections) ? b.sections : [];

  return (
    <>
      {sections.map((s, i) => {
        const title = content[`s${i}_title`] ?? '';
        const body = content[`s${i}_body`] ?? '';
        const decorStyle =
          i === 0
            ? { right: -40, top: 40 }
            : i === 2
            ? { left: -40, top: 60, transform: 'rotate(30deg)' }
            : undefined;
        const bg = i === 1 ? { background: 'rgba(231,216,193,0.35)' } : undefined;
        const imageLeft = s.layout === 'image-left';

        return (
          <section key={i} className="story-section" style={bg}>
            {decorStyle && <PlumDecor style={decorStyle} size={200} opacity={0.7} />}
            <div className="story-inner">
              {imageLeft ? (
                <>
                  <div><OvalPhoto imageUrl={s.imageUrl} /></div>
                  <div className="story-text">
                    <Ornament />
                    <h3 style={{ whiteSpace: 'pre-line' }}>「 {title} 」</h3>
                    <p style={{ whiteSpace: 'pre-line' }}>{body}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="story-text">
                    <Ornament />
                    <h3 style={{ whiteSpace: 'pre-line' }}>「 {title} 」</h3>
                    <p style={{ whiteSpace: 'pre-line' }}>{body}</p>
                  </div>
                  <div><OvalPhoto imageUrl={s.imageUrl} /></div>
                </>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
