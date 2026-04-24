import { Link } from '@/i18n/routing';
import type { PageBlock } from '../../types';
import { Ornament } from '../shared/Ornament';

interface Props {
  block: PageBlock;
  content: Record<string, string>;
}

export function GiftCta({ block, content }: Props) {
  const b = block as unknown as { imageUrl?: string; href?: string };
  const imageUrl = b.imageUrl ?? '/themes/plumlight/gift-box.jpg';
  const href = b.href ?? '#';
  const title = content.title ?? '節慶禮盒訂製';
  const body = content.body ?? '';
  const ctaLabel = content.cta_label ?? '查看禮盒系列';

  return (
    <section id="gift" style={{ padding: '40px 40px' }}>
      <div className="gift">
        <div className="gift-img" style={{ backgroundImage: `url(${imageUrl})` }} />
        <div className="gift-text">
          <Ornament />
          <h3>{title}</h3>
          <div className="divider" />
          <p style={{ whiteSpace: 'pre-line' }}>{body}</p>
          <Link href={href} className="btn btn-ghost-white">{ctaLabel}</Link>
        </div>
      </div>
    </section>
  );
}
