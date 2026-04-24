const CRED = [
  {
    n: '20',
    sup: '+',
    unit: '年',
    title: '公平交易法專業經驗',
    d: '深耕公平交易法領域逾二十年，為國內最早專注於限制競爭與不正競爭法律實務的律師之一。長期代理聯合行為之法律救濟、事業結合申報、行政檢舉及企業競爭策略規劃。',
  },
  {
    n: '500',
    sup: '+',
    unit: '件',
    title: '法律案件代理經驗',
    d: '累積超過五百件法律案件，服務範圍涵蓋行政調查應對、行政救濟與訴訟代理、制度重建、國會遊說、機關協調，以及各類企業危機處理與策略整合。',
  },
  {
    n: '80',
    sup: '+',
    unit: '件',
    title: '土地開發與交易案件',
    d: '代理逾八十件土地開發與交易案件，服務內容包括土地盡職調查、開發可行性評估、產權爭議處理、三七五減租、共有土地分割、都市更新及合建契約之規劃與談判。',
  },
  {
    n: '30',
    sup: '+',
    unit: '家',
    title: '多層次傳銷事業服務',
    d: '提供三十餘家多層次傳銷事業全方位法律服務，涵蓋制度設計與適法性審查、主管機關報備、行政調查應對、商品許可取得、稅務爭議處理、直銷商糾紛解決，以及事業整併與組織重組。',
  },
];

export function LawyerHero() {
  return (
    <div className="hero">
      <div className="hero-left">
        <div>
          <div className="hero-kicker">
            <div className="kicker-rule" />
            執業逾二十年　·　公平交易法　·　台灣
          </div>
          <h1 className="hero-h1 sf">
            法律，是商業競爭中
            <br />
            最深謀遠慮的
            <em>戰略布局</em>
          </h1>
          <div className="hero-subtitle">
            逾二十年的實務積累，將複雜的法律角力
            <br />
            轉化為具體的商業優勢——以精準的策略架構，定義勝負
          </div>
          <div className="hero-sep" />
          <p className="hero-body">
            法律策略的真正價值，在於與商業決策的深度整合；
            <br />
            縝密的法律架構，則是企業最堅實的後盾。
            <br />
            <br />
            專為企業主、多層次傳銷事業、建設公司及地主，
            <br />
            提供公平交易、多層次傳銷與土地開發交易之深度法律策略服務。
            <br />
            <br />
            嚴格保密・全預約制，
            <br />
            每一次會面，皆為正式委託關係的起點。
          </p>
        </div>
        <div className="hero-footer">
          <button className="btn-main">預約正式諮詢 ↗</button>
          <div className="hero-aside-note">
            將於收到預約申請後
            <br />
            二個工作日內回覆
          </div>
        </div>
      </div>
      <div className="hero-div" />
      <div className="hero-right">
        <div className="cred-head">
          <div className="cred-section-label">執業資歷</div>
        </div>
        <div className="cred-list">
          {CRED.map((c, i) => (
            <div key={i} className="cred-row">
              <div className="cred-v2-head">
                <span className="cred-n sf">
                  {c.n}
                  <sup>{c.sup}</sup>
                  <span className="cred-unit">　{c.unit}</span>
                </span>
                <span className="cred-v2-bar">｜</span>
                <span className="cred-v2-title">{c.title}</span>
              </div>
              <div className="cred-d">{c.d}</div>
            </div>
          ))}
        </div>

        <div className="media-block">
          <div className="media-lbl">著作　·　受訪　·　顧問</div>
          <div className="media-pills">
            <span className="mpill">工商時報</span>
            <span className="mpill">月旦法學</span>
            <span className="mpill">公平交易委員會</span>
            <span className="mpill">台大法學論叢</span>
            <span className="mpill">直銷世紀</span>
          </div>
        </div>
      </div>
    </div>
  );
}
