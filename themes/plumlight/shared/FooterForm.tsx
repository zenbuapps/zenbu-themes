'use client';

export function FooterContactForm() {
  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        alert('感謝您的訊息，我們將盡快回覆。');
      }}
    >
      <div className="row-2">
        <input className="field" placeholder="姓名" />
        <input className="field" placeholder="聯絡電話" />
      </div>
      <input className="field" type="email" placeholder="E-mail" />
      <textarea className="field" placeholder="內容" rows={5} />
      <div className="submit-wrap">
        <button type="submit" className="btn btn-primary">送出表單</button>
      </div>
    </form>
  );
}
