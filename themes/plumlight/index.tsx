import type { ReactNode } from 'react';
import type {
  NavItem,
  PageBlock,
  SamplePage,
  SectionRendererProps,
  ThemeChromeProps,
  ThemeMeta,
  ThemeModule,
} from '../types';
import meta from './theme.json';
import homeJson from './sample-pages/home.json';
import aboutJson from './sample-pages/about.json';
import contactJson from './sample-pages/contact.json';

import { PlumlightNavbar } from './shared/Navbar';
import { FooterContactForm } from './shared/FooterForm';
import {
  IconPhone,
  IconFacebook,
  IconLine,
} from './shared/icons';
import { HeroCarousel } from './blocks/HeroCarousel';
import { CategoriesCircles } from './blocks/CategoriesCircles';
import { ProductShowcase } from './blocks/ProductShowcase';
import { BrandStory } from './blocks/BrandStory';
import { GiftCta } from './blocks/GiftCta';
import { PlumlightAbout } from './blocks/PlumlightAbout';

import './plumlight-theme.css';

const samplePages: SamplePage[] = [
  homeJson as SamplePage,
  aboutJson as SamplePage,
  contactJson as SamplePage,
];

function PlumlightFooter() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <h3>聯絡我們</h3>
          <div className="en">Get In Touch</div>
          <p>{'有任何問題、訂購或客製需求，\n歡迎與我們聯繫。'}</p>
          <div className="footer-socials">
            <a href="tel:0910168888" aria-label="phone"><IconPhone /></a>
            <a href="#" aria-label="facebook"><IconFacebook /></a>
            <a href="#" aria-label="line"><IconLine /></a>
          </div>
        </div>
        <div>
          <FooterContactForm />
        </div>
      </div>
      <div className="subfoot">
        <div className="logo-mini">梅妙蒔光<small>PLUMLIGHT CRAFTED</small></div>
        <div className="cols">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>0910-168-888</span>
            <span>plumlight@gmail.com</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <a href="#">退換貨政策</a>
            <a href="#">購物須知</a>
          </div>
        </div>
        <div>Copyright © 2026 梅妙蒔光. All Rights Reserved.</div>
      </div>
    </footer>
  );
}

function Chrome({ children, navItems }: ThemeChromeProps) {
  return (
    <div className="plumlight-root">
      <PlumlightNavbar navItems={navItems} />
      <main>{children}</main>
      <PlumlightFooter />
    </div>
  );
}

function SectionRenderer({ block, content, extras }: SectionRendererProps) {
  const c = (content ?? {}) as Record<string, string>;
  switch (block.type) {
    case 'hero-carousel':
      return <HeroCarousel block={block} content={c} />;
    case 'about-summary':
      return <PlumlightAbout block={block} content={c} />;
    case 'categories-circles':
      return <CategoriesCircles block={block} content={c} />;
    case 'product-showcase':
      return (
        <ProductShowcase
          block={block}
          content={c}
          products={extras?.productsByBlockId?.[block.id] ?? []}
        />
      );
    case 'brand-story':
      return <BrandStory block={block} content={c} />;
    case 'gift-cta':
      return <GiftCta block={block} content={c} />;
    default:
      return null;
  }
}

const plumlightTheme: ThemeModule = {
  meta: meta as ThemeMeta,
  Chrome,
  SectionRenderer,
  samplePages,
  supportedBlockTypes: [
    'hero-carousel',
    'about-summary',
    'categories-circles',
    'product-showcase',
    'brand-story',
    'gift-cta',
    'contact-info',
    'contact-form',
  ],
};

export default plumlightTheme;
