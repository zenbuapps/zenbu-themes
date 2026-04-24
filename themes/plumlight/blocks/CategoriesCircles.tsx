import { Link } from '@/i18n/routing';
import type { PageBlock } from '../../types';
import { SectionTitle } from '../shared/Ornament';

interface Item { imageUrl: string; href: string; }

interface Props {
  block: PageBlock;
  content: Record<string, string>;
}

export function CategoriesCircles({ block, content }: Props) {
  const b = block as unknown as { items?: Item[] };
  const items = Array.isArray(b.items) ? b.items : [];
  const titleCn = content.section_title_cn ?? '商品專區';
  const titleEn = content.section_title_en ?? 'Shop Our Products';

  return (
    <section className="categories" id="categories">
      <div className="container">
        <SectionTitle cn={titleCn} en={titleEn} />
        <div className="cat-grid">
          {items.map((c, i) => (
            <Link key={i} href={c.href} className="cat-card">
              <div className="cat-circle" style={{ backgroundImage: `url(${c.imageUrl})` }} />
              <div className="label">{content[`item${i}_label`] ?? ''}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
