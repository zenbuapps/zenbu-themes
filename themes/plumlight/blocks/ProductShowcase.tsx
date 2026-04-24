import { Link } from '@/i18n/routing';
import type { PageBlock } from '../../types';
import { SectionTitle } from '../shared/Ornament';
import { PlumDecor } from '../shared/PlumDecor';

interface StorefrontProduct {
  id: string;
  title?: string;
  name?: string;
  price?: number;
  images?: Array<{ url?: string } | string>;
  imageUrl?: string;
}

interface Props {
  block: PageBlock;
  content: Record<string, string>;
  products: unknown[];
}

function primaryImage(p: StorefrontProduct): string {
  if (p.imageUrl) return p.imageUrl;
  const first = p.images?.[0];
  if (typeof first === 'string') return first;
  if (first && typeof first === 'object' && 'url' in first && first.url) return first.url;
  return '/themes/plumlight/product.jpg';
}

export function ProductShowcase({ block, content, products }: Props) {
  const b = block as unknown as { anchorId?: string };
  const items = (products as StorefrontProduct[]).slice(0, 8);
  const titleCn = content.title_cn ?? '';
  const titleEn = content.title_en ?? '';

  if (items.length === 0) {
    return (
      <section className="products" id={b.anchorId}>
        <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
          <SectionTitle cn={titleCn} en={titleEn} />
          <p style={{ color: 'var(--plum-muted)', fontFamily: 'var(--plum-f-sans)' }}>
            此區塊尚未設定商品。
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="products" id={b.anchorId}>
      <PlumDecor style={{ left: -50, top: 40, transform: 'rotate(-30deg)' }} size={180} />
      <div className="container">
        <SectionTitle cn={titleCn} en={titleEn} />
        <div className="prod-grid">
          {items.map((p) => {
            const title = p.title ?? p.name ?? '未命名商品';
            const price = typeof p.price === 'number' ? p.price : null;
            return (
              <Link key={p.id} href={`/zb-cart/products/${p.id}`} className="prod">
                <div className="prod-img" style={{ backgroundImage: `url(${primaryImage(p)})` }} />
                <div className="name">{title}</div>
                {price !== null && <div className="price">NT$ {price}</div>}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
