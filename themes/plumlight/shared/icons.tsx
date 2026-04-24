interface IconProps { size?: number; }

export function IconCart({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 7 H7 L9 21 H25 L27 10 H9" />
      <circle cx="11" cy="26" r="2" fill="currentColor"/>
      <circle cx="23" cy="26" r="2" fill="currentColor"/>
      <path d="M12 4 C12 7, 14 8, 16 8 C18 8, 20 7, 20 4" />
    </svg>
  );
}

export function IconClose({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6 L18 18 M18 6 L6 18"/>
    </svg>
  );
}

export function IconMenu({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7 H20 M4 12 H20 M4 17 H14"/>
    </svg>
  );
}

export function IconHeart({ filled }: { filled?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20 S4 14, 4 8.5 C4 5.5, 6.5 3.5, 9 4.2 C10.5 4.6, 11.5 5.6, 12 7 C12.5 5.6, 13.5 4.6, 15 4.2 C17.5 3.5, 20 5.5, 20 8.5 C20 14, 12 20, 12 20 Z"/>
    </svg>
  );
}

export function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="20" height="20"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.2 21 3 13.8 3 4.9c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .7-.2 1l-2.3 2.3Z"/></svg>
  );
}

export function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="20" height="20"><path d="M4 6h16c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2zm0 2v.5l8 5 8-5V8H4zm16 8v-6.2l-7.4 4.6c-.4.2-.8.2-1.2 0L4 9.8V16h16z"/></svg>
  );
}

export function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="20" height="20"><path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.6V4.6c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.5H8v3.1h2.6V22h2.9z"/></svg>
  );
}

export function IconLine() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="20" height="20"><path d="M12 3C6.5 3 2 6.6 2 11.1c0 4 3.5 7.4 8.3 8v.1c.3.1.8.3.9.6l.2.8c-.1.3-.2 1.3 1.1.7 1.4-.6 7.5-4.4 10.2-7.6 1.7-2 2.3-3.5 2.3-5.6 0-4.5-4.5-8.1-10-8.1zM8 13.4H6.4c-.2 0-.4-.2-.4-.4V9.6c0-.2.2-.4.4-.4h.3c.2 0 .3.2.3.4v2.9h1c.2 0 .3.1.3.3v.3c0 .2-.1.3-.3.3zm1.5-.4c0 .2-.1.4-.3.4h-.3c-.2 0-.3-.2-.3-.4V9.6c0-.2.1-.4.3-.4h.3c.2 0 .3.2.3.4V13zm4-.1c0 .2-.1.3-.3.3h-.3c-.1 0-.2 0-.3-.1l-1.5-2.1V13c0 .2-.1.4-.3.4h-.3c-.2 0-.3-.2-.3-.4V9.6c0-.2.1-.4.3-.4h.3c.1 0 .2 0 .3.1l1.5 2v-1.7c0-.2.1-.4.3-.4h.3c.2 0 .3.2.3.4V13zm3-2.6c0 .2-.1.4-.3.4h-1v.6h1c.2 0 .3.1.3.3v.3c0 .2-.1.3-.3.3h-1v.6h1c.2 0 .3.1.3.3v.3c0 .2-.1.3-.3.3h-1.6c-.2 0-.4-.1-.4-.3V9.6c0-.2.2-.4.4-.4h1.6c.2 0 .3.2.3.4v.3z"/></svg>
  );
}

export function IconLocation() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="20" height="20"><path d="M12 2c-4.4 0-8 3.6-8 8 0 5.4 7 11.5 7.3 11.8.2.2.5.2.7 0C12.3 21.5 20 15.4 20 10c0-4.4-3.6-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
  );
}
