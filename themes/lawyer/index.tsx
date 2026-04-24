import type { ReactNode } from 'react';
import { Link } from '@/i18n/routing';
import type {
  NavItem,
  PageBlock,
  SamplePage,
  ThemeChromeProps,
  ThemeMeta,
  ThemeModule,
} from '../types';
import meta from './theme.json';
import homeJson from './sample-pages/home.json';
import { LawyerHero } from './LawyerHero';
import './lawyer-theme.css';

const samplePages: SamplePage[] = [homeJson as SamplePage];

const DEFAULT_NAV: NavItem[] = [
  { label: '公平交易', href: '/' },
  { label: '多層次傳銷', href: '/' },
  { label: '土地開發', href: '/' },
  { label: '案件紀錄', href: '/' },
  { label: '關於', href: '/about' },
];

/* ============ Chrome: Nav + Footer ============ */

function LawyerNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="nav">
      <div className="nav-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/lawyer-logo.png" alt="立勤法律事務所" className="nav-logo" />
        <div className="nav-brand-text">
          <div className="logo-main">立勤法律事務所　賴晉魁律師</div>
          <div className="logo-sub">Attorney at Law &nbsp;·&nbsp; Est. 2004</div>
        </div>
      </div>
      <div className="nav-links">
        {items.map((item, i) => (
          <LawyerNavEntry key={`${item.href}-${i}`} item={item} />
        ))}
      </div>
      <div className="nav-right">
        <div className="nav-divider" />
        <button className="nav-appt">預約諮詢</button>
      </div>
    </nav>
  );
}

function LawyerNavEntry({ item }: { item: NavItem }) {
  const hasChildren = !!item.children && item.children.length > 0;
  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        target={item.openInNew ? '_blank' : undefined}
        rel={item.openInNew ? 'noopener noreferrer' : undefined}
      >
        {item.label}
      </Link>
    );
  }
  return (
    <div className="nav-entry">
      <Link href={item.href} className="nav-caret-link">
        {item.label}
        <span aria-hidden style={{ fontSize: 9, marginLeft: 4, opacity: 0.7 }}>▾</span>
      </Link>
      <div className="nav-dropdown nav-dropdown-top">
        {item.children!.map((c, i) => (
          <LawyerNavSubEntry key={`${c.href}-${i}`} item={c} />
        ))}
      </div>
    </div>
  );
}

function LawyerNavSubEntry({ item }: { item: NavItem }) {
  const hasChildren = !!item.children && item.children.length > 0;
  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        target={item.openInNew ? '_blank' : undefined}
        rel={item.openInNew ? 'noopener noreferrer' : undefined}
      >
        {item.label}
      </Link>
    );
  }
  return (
    <div className="nav-subentry">
      <Link href={item.href} className="nav-sub-caret">
        <span>{item.label}</span>
        <span aria-hidden style={{ fontSize: 9, marginLeft: 6, opacity: 0.6 }}>▸</span>
      </Link>
      <div className="nav-dropdown nav-dropdown-sub">
        {item.children!.map((c, i) => (
          <LawyerNavSubEntry key={`${c.href}-${i}`} item={c} />
        ))}
      </div>
    </div>
  );
}

function LawyerFooter() {
  return (
    <div className="footer">
      <div className="footer-l">
        立勤法律事務所　·　賴晉魁律師　·　台灣律師執照 #XXXXX
        <br />
        台北市○○區○○路○○號○○樓　·　採預約制，請勿臨時來訪
      </div>
      <div className="footer-r">
        <a href="#">保密聲明</a>
        <a href="#">執業聲明</a>
        <a href="#">預約諮詢</a>
      </div>
    </div>
  );
}

function Chrome({ children, navItems }: ThemeChromeProps) {
  const items = navItems && navItems.length > 0 ? navItems : DEFAULT_NAV;
  return (
    <div className="lawyer-root">
      <div className="site">
        <LawyerNav items={items} />
        <main>{children}</main>
        <LawyerFooter />
      </div>
    </div>
  );
}

/* ============ Practice ============ */

const PRACTICE_AREAS = [
  {
    idx: '01',
    title: (
      <>
        公平交易法
        <br />
        競爭秩序與法律攻防
      </>
    ),
    body: '以競爭法實務為基礎，協助企業因應市場挑戰並鞏固競爭優勢，自事前評估到事後救濟，提供完整法律策略。',
    items: [
      {
        label: '限制競爭行為防護',
        desc: '針對聯合行為、垂直限制及濫用市場地位之適法規劃。',
      },
      {
        label: '事業結合申報代理',
        desc: '精準評估市場集中度，提供結合申請之法律分析與溝通。',
      },
      {
        label: '不正競爭與不實廣告',
        desc: '不正競爭之抗辯、不實廣告與商業詆毀之法律救濟。',
      },
      {
        label: '行政處分撤銷訴訟',
        desc: '對抗非法或不當之裁處，爭取行政處分之撤銷或變更。',
      },
    ],
  },
  {
    idx: '02',
    title: (
      <>
        多層次傳銷
        <br />
        法規遵循與爭議解決
      </>
    ),
    body: '針對傳銷產業之高強度管制，提供從制度建立至爭端解決的全方位法律策略支援。',
    items: [
      {
        label: '制度架構與適法審查',
        desc: '精準對標法規，優化獎金制度與組織架構。',
      },
      {
        label: '行政調查與危機部署',
        desc: '應對公平會調查，制定防禦策略與證據保全。',
      },
      {
        label: '救濟程序與訴訟代理',
        desc: '代理訴願、行政訴訟及相關民刑事爭訟。',
      },
      {
        label: '事業營運法律顧問',
        desc: '處理直銷商糾紛、稅務爭議及商品許可取得。',
      },
    ],
  },
  {
    idx: '03',
    title: (
      <>
        土地開發交易
        <br />
        結構規劃與談判布局
      </>
    ),
    body: '整合不動產法規與實務經驗，協助設計土地權益分配架構，在法規許可範圍內，獲得最佳利益配置。',
    items: [
      {
        label: '地主權益與聯合談判',
        desc: '在複雜產權結構下，設計利益分配架構，代理參與聯合開發協商。',
      },
      {
        label: '都更危老策略建構',
        desc: '主導危老與都市更新之合建契約擬定及行政審查流程。',
      },
      {
        label: '容積移轉與法律分析',
        desc: '規劃容積移轉之最佳法律途徑，降低法律風險。',
      },
      {
        label: '開發爭議與訴訟代理',
        desc: '處理產權爭奪、三七五減租及各類土地開發衍生訴訟。',
      },
    ],
  },
];

function LawyerPractice() {
  return (
    <div className="practice">
      <div className="section-head">
        <div className="section-title sf">三個深耕領域</div>
        <div className="section-en">Practice Areas</div>
      </div>
      <div className="prac-grid">
        {PRACTICE_AREAS.map((a) => (
          <div key={a.idx} className="prac-col">
            <div className="prac-idx">{a.idx}</div>
            <div className="prac-title">{a.title}</div>
            <div className="prac-body">{a.body}</div>
            <div className="prac-details">
              {a.items.map((it) => (
                <div key={it.label} className="prac-detail">
                  <div className="prac-detail-label">{it.label}</div>
                  <div className="prac-detail-desc">{it.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ Cases ============ */

function LawyerCases() {
  const cases = [
    {
      tag: '公平交易法　·　聯合行為',
      headline: '二度撤銷裁罰處分，減免逾六千萬元罰鍰',
      body: '某產業十數家同業，年總營業額逾數十億元，遭公平交易委員會認定違反聯合行為規定，合計裁處上億元罰鍰並命限期改正。面對複雜的產業競爭結構，深入市場與法律分析後，擬定行政救濟策略，於訴願程序中二度撤銷原處分，歷經長期法律攻防，最終為當事人合計減免逾六千萬元罰鍰。',
    },
    {
      tag: '土地開發　·　產權爭奪',
      headline: '反制上市公司法律攻勢，取得二千餘坪精華土地產權',
      body: '新北市某逾二千坪精華地段，歷經各方建設公司與開發商長期整併，某上市公司於末局挾雄厚資金，意圖以高度門檻的買賣條件，強行依土地法第34條之1取得產權。面對資金實力懸殊之對手，憑藉對法規之深度掌握與豐富實務經驗，精準拆解並反制其法律攻勢，最終協助當事人取得全部土地產權。',
    },
    {
      tag: '多層次傳銷　·　制度重建',
      headline: '（預留案例三標題 ─ 待補正式文案）',
      body: '某產業十數家同業，年總營業額逾數十億元，遭公平交易委員會認定違反聯合行為規定，合計裁處上億元罰鍰並命限期改正。面對複雜的產業競爭結構，深入市場與法律分析後，擬定行政救濟策略，於訴願程序中二度撤銷原處分，歷經長期法律攻防，最終為當事人合計減免逾六千萬元罰鍰。',
    },
    {
      tag: '公平交易法　·　結合申報',
      headline: '（預留案例四標題 ─ 待補正式文案）',
      body: '新北市某逾二千坪精華地段，歷經各方建設公司與開發商長期整併，某上市公司於末局挾雄厚資金，意圖以高度門檻的買賣條件，強行依土地法第34條之1取得產權。面對資金實力懸殊之對手，憑藉對法規之深度掌握與豐富實務經驗，精準拆解並反制其法律攻勢，最終協助當事人取得全部土地產權。',
    },
  ];
  return (
    <div className="cases">
      <div className="case-bar">
        <span>代表案件節錄</span>
        <span style={{ color: 'var(--lw-line-strong)' }}>
          所有案件均經當事人同意並匿名化處理
        </span>
      </div>
      <div className="case-grid">
        {cases.map((c, i) => (
          <div key={i} className="case-card">
            <div className="case-tag">{c.tag}</div>
            <div className="case-headline sf">{c.headline}</div>
            <div className="case-body">{c.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ Portrait ============ */

function LawyerPortrait() {
  return (
    <div className="portrait-section">
      <div className="portrait-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/lawyer-portrait.jpeg" alt="律師形象照" />
      </div>
      <div className="portrait-right">
        <div className="portrait-kicker">Attorney · 關於律師</div>
        <div className="portrait-quote sf">
          預見風險、控管危機，
          <br />
          是我對法律價值的詮釋。
        </div>
        <div className="portrait-body">
          多數人往往在問題發生之後，才想到律師。
          <br />
          逾二十年的執業歷練，使我深刻體認：真正有價值的法律服務，
          <br />
          不僅是在風暴中救援，更是在風暴形成之前，
          <br />
          就為當事人洞察潛在的風險、預先建構防護機制。
          <br />
          <br />
          此一理念，正是「<em>預防法學</em>」的核心精神。
          <br />
          我著重的，是在每一個決策節點上，精準辨識風險、審慎推演法律效果，
          <br />
          並周延擬定因應策略——讓當事人在推動業務、簽署文件或作成重大決策時，
          <br />
          皆能從容篤定、穩健前行。
          <br />
          <br />
          糾紛或許無法完全避免，但其發生可以被預見、其影響可以被控管並降至最低。
          <br />
          這不僅是專業能力的體現，更是我對每一位當事人始終如一的承諾。
        </div>
        <button className="btn-ghost">查看完整資歷 ↗</button>
      </div>
    </div>
  );
}

/* ============ Appointment ============ */

function LawyerAppointment() {
  return (
    <div className="appt">
      <div className="appt-left appt-left-dark">
        <div className="appt-kicker">Appointment</div>
        <div className="appt-title sf">
          每一次會面
          <br />
          都是<em>正式委託</em>
          <br />
          關係的開始
        </div>
        <div className="appt-body">
          全預約制。敬請說明案件性質與背景，
          <br />
          經審慎評估後，將安排會面時間，
          <br />
          並提供預估之法律服務時數。
          <br />
          <br />
          我重視每一位委託人的寶貴時間，
          <br />
          同樣珍視自身的專業判斷。
        </div>
      </div>
      <div className="appt-div" />
      <div className="appt-right">
        <div className="appt-item">
          <div className="appt-item-label">預約方式</div>
          <div className="appt-item-desc">
            線上表單，請說明案件類型與背景
          </div>
        </div>
        <div className="appt-item">
          <div className="appt-item-label">回覆時間</div>
          <div className="appt-item-desc">收到申請後二個工作日內</div>
        </div>
        <div className="appt-item">
          <div className="appt-item-label">法律服務時數</div>
          <div className="appt-item-desc">
            依案件性質與複雜程度評估
            <br />
            於確認預約時告知
          </div>
        </div>
        <div className="appt-item">
          <div className="appt-item-label">保密承諾</div>
          <div className="appt-item-desc">
            委託關係與案件內容
            <br />
            均受最嚴格保護
          </div>
        </div>
        <button className="btn-appt-dark">提出預約申請</button>
      </div>
    </div>
  );
}

function SectionRenderer({ block }: { block: PageBlock }) {
  switch (block.type) {
    case 'hero':
      return <LawyerHero />;
    case 'practice':
      return <LawyerPractice />;
    case 'cases':
      return <LawyerCases />;
    case 'portrait':
      return <LawyerPortrait />;
    case 'appointment':
      return <LawyerAppointment />;
    default:
      return null;
  }
}

const lawyerTheme: ThemeModule = {
  meta: meta as ThemeMeta,
  Chrome,
  SectionRenderer,
  samplePages,
  supportedBlockTypes: ['hero', 'practice', 'cases', 'portrait', 'appointment'],
};

export default lawyerTheme;
