'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import type { NavItem } from '../../types';
import { BrandLogo } from './BrandLogo';
import { IconCart, IconMenu, IconClose } from './icons';

interface Props {
  navItems?: NavItem[];
}

export function PlumlightNavbar({ navItems }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const items: NavItem[] = navItems && navItems.length > 0 ? navItems : [
    { label: '品牌故事', href: '/about' },
    { label: '梅光誌', href: '/#categories' },
    { label: '商品專區', href: '/#best' },
    { label: '聯絡我們', href: '/contact' },
  ];

  return (
    <>
      <header className={'nav ' + (scrolled ? 'scrolled' : '')}>
        <BrandLogo />
        <nav className="links">
          {items.map((it, i) => (
            <Link
              key={`${it.href}-${i}`}
              href={it.href}
              className={pathname?.endsWith(it.href) ? 'active' : ''}
            >
              {it.label}
            </Link>
          ))}
        </nav>
        <div className="right">
          <Link href="/signin" className="member">會員專區</Link>
          <Link href="/cart" className="cart-btn" aria-label="購物車">
            <IconCart />
          </Link>
          <button
            type="button"
            className="hamburger"
            onClick={() => setMenuOpen(true)}
            aria-label="選單"
          >
            <IconMenu />
          </button>
        </div>
      </header>

      <div className={'mobile-menu ' + (menuOpen ? 'open' : '')}>
        {items.map((it, i) => (
          <Link
            key={`${it.href}-${i}`}
            href={it.href}
            onClick={() => setMenuOpen(false)}
          >
            {it.label}
          </Link>
        ))}
      </div>
      {menuOpen && (
        <button
          type="button"
          aria-label="close"
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', top: 24, right: 24, zIndex: 89,
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(33,24,21,.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#211815',
          }}
        >
          <IconClose />
        </button>
      )}
    </>
  );
}
