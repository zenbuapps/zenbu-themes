import type { ReactNode } from 'react';
import {
  CursorGlow,
  Hero,
  IntegrationFlow,
  Pricing,
  Products,
  SigFooter,
  SigFooterCTA,
  SigNav,
  Stats,
  Testimonials,
  Why,
} from '@/components/signature/Signature';
import type {
  PageBlock,
  SamplePage,
  ThemeChromeProps,
  ThemeMeta,
  ThemeModule,
} from '../types';
import { BlockRevealWrapper } from '../shared/BlockRevealWrapper';
import '../shared/reveal-animations.css';
import meta from './theme.json';
import homeJson from './sample-pages/home.json';
import aboutJson from './sample-pages/about.json';
import contactJson from './sample-pages/contact.json';

const samplePages: SamplePage[] = [
  homeJson as SamplePage,
  aboutJson as SamplePage,
  contactJson as SamplePage,
];

function Chrome({ children, navItems }: ThemeChromeProps) {
  return (
    <div className="signature-root" data-theme="dark">
      <CursorGlow />
      <SigNav navItems={navItems} />
      <main>{children}</main>
      <SigFooterCTA />
      <SigFooter />
    </div>
  );
}

function renderInner(block: PageBlock): ReactNode {
  switch (block.type) {
    case 'hero':
      return <Hero />;
    case 'stats':
      return <Stats />;
    case 'products':
      return <Products />;
    case 'integration-flow':
      return <IntegrationFlow />;
    case 'why':
      return <Why />;
    case 'testimonials':
      return <Testimonials />;
    case 'pricing':
      return <Pricing />;
    default:
      return null;
  }
}

function SectionRenderer({ block }: { block: PageBlock }) {
  const inner = renderInner(block);
  if (!inner) return null;
  return (
    <BlockRevealWrapper block={block}>
      {inner}
    </BlockRevealWrapper>
  );
}

const signatureTheme: ThemeModule = {
  meta: meta as ThemeMeta,
  Chrome,
  SectionRenderer,
  samplePages,
  supportedBlockTypes: [
    'hero',
    'stats',
    'products',
    'integration-flow',
    'why',
    'testimonials',
    'pricing',
  ],
};

export default signatureTheme;
