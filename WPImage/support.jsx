// support.jsx — WPImage "We're here to help" support page.
// Three contact channels (live chat, documentation, email) + a working-hours
// note. Brand-colored app-icon badges (admin UI stays photo-free).
// Uniquely-named style objects.

/* ---------- Inline white glyphs for the channel badges ---------- */
function ChatGlyph() {
  return (
    <svg viewBox="0 0 48 48" width="50" height="50" style={{ display: 'block' }}>
      <path fill="#fff" d="M24 9C13.5 9 5 15.4 5 23.3c0 4.4 2.7 8.4 6.9 11-.3 2.2-1.3 4.4-2.8 6.1-.5.5-.1 1.4.6 1.3 3.7-.5 6.8-1.9 9.2-3.7 1.6.3 3.3.4 5.1.4 10.5 0 19-6.4 19-14.4S34.5 9 24 9Z" />
    </svg>);

}
function DocGlyph() {
  return (
    <svg viewBox="0 0 48 48" width="50" height="50" style={{ display: 'block' }}>
      <path fill="#fff" d="M14 6h12.5L37 16.5V39a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Z" />
      <path fill="#bfe6cb" d="M26 6 37 17h-8a3 3 0 0 1-3-3V6Z" />
      <g stroke="#4ab866" strokeWidth="2" strokeLinecap="round">
        <line x1="17.5" y1="24" x2="30.5" y2="24" />
        <line x1="17.5" y1="30" x2="30.5" y2="30" />
        <line x1="17.5" y1="36" x2="25" y2="36" />
      </g>
    </svg>);

}
function MailGlyph() {
  return (
    <svg viewBox="0 0 48 48" width="50" height="50" style={{ display: 'block' }}>
      <rect x="5" y="12" width="38" height="24" rx="3.5" fill="#fff" />
      <path fill="none" stroke="#e0a93f" strokeWidth="2.4" strokeLinejoin="round" d="M8 16.5 24 27l16-10.5" />
    </svg>);

}

/* ---------- One contact channel card ---------- */
const wpiSupCard = {
  root: { background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden',
    boxShadow: 'var(--elevation-small)', display: 'flex', flexDirection: 'column' },
  media: { height: 196, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, padding: '24px 26px 26px', display: 'flex', flexDirection: 'column' },
  title: { font: 'var(--fw-semibold) 17px/1.3 var(--font-sans)', color: 'var(--fg)', letterSpacing: '-0.01em' },
  desc: { font: '13.5px/1.65 var(--font-sans)', color: 'var(--fg-muted)', marginTop: 9, marginBottom: 22 },
  cta: { marginTop: 'auto', paddingTop: 18, alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center',
    gap: 5, font: 'var(--fw-semibold) 14px/1 var(--font-sans)', cursor: 'pointer' }
};

function ChannelCard({ tint, badge, glyph, title, desc, cta, onCta }) {
  return (
    <div style={wpiSupCard.root}>
      <div style={{ ...wpiSupCard.media, background: tint }}>
        <span style={{ width: 92, height: 92, borderRadius: 24, background: badge,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 14px 30px ' + badge + '66' }}>{glyph}</span>
      </div>
      <div style={wpiSupCard.body}>
        <div style={wpiSupCard.title}>{title}</div>
        <div style={wpiSupCard.desc}>{desc}</div>
        <button className="wp-btn secondary" onClick={onCta} style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
          {cta}<Ic name="chevron-right" cls="sm" />
        </button>
      </div>
    </div>);

}

/* ---------- Support page ---------- */
const wpiSupPage = {
  page: { maxWidth: 1080, margin: '0 auto', padding: '52px 32px 64px' },
  h1: { font: '700 40px/1.1 var(--font-sans)', letterSpacing: '-0.025em', color: 'var(--fg)', textAlign: 'center' },
  sub: { font: '20px/1.45 var(--font-sans)', color: 'var(--fg)', textAlign: 'center',
    maxWidth: 600, margin: '14px auto 0', textWrap: 'pretty' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 48, alignItems: 'stretch' },
  note: { marginTop: 32, background: 'var(--surface-muted)', border: '1px solid var(--border)',
    borderRadius: 14, padding: '40px 40px 42px', textAlign: 'center' },
  noteIc: { width: 48, height: 48, borderRadius: 9999, background: 'rgba(56,88,233,0.10)',
    color: 'var(--wp-admin-theme)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  noteTitle: { font: 'var(--fw-semibold) 17px/1.3 var(--font-sans)', color: 'var(--fg)', marginTop: 16,
    letterSpacing: '-0.01em' },
  metaRow: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center',
    gap: '8px 14px', marginTop: 14 },
  metaItem: { font: 'var(--fw-medium) 13.5px/1 var(--font-sans)', color: 'var(--fg)' },
  metaDot: { width: 3, height: 3, borderRadius: 9999, background: 'var(--gray-400)', flex: 'none' },
  noteDivider: { width: 44, height: 1, background: 'var(--border)', margin: '22px auto 0' },
  noteThanks: { font: '13.5px/1.7 var(--font-sans)', color: 'var(--fg-muted)', maxWidth: 460,
    margin: '20px auto 0', textWrap: 'pretty' }
};

function SupportPage({ fireToast }) {
  return (
    <div style={wpiSupPage.page}>
      <h1 style={wpiSupPage.h1}>Hi! We're here to help!</h1>
      <p style={wpiSupPage.sub}>Please contact us for instant support from our WordPress experts.</p>

      <div style={wpiSupPage.grid}>
        <ChannelCard
          tint="rgba(74,184,102,0.12)" badge="#4ab866" glyph={<DocGlyph />}
          title="Read the documentation"
          desc="Browse setup guides, how-tos and answers to common questions."
          cta="Open docs"
          onCta={() => fireToast('Opening the documentation…')} />
        <ChannelCard
          tint="rgba(56,88,233,0.09)" badge="#3858e9" glyph={<ChatGlyph />}
          title="Live chat on the chat box"
          desc="Best way to chat with us for urgent support or presale questions."
          cta="Live chat now"
          onCta={() => fireToast('Live chat — connecting you with an agent…')} />
        <ChannelCard
          tint="rgba(240,184,73,0.16)" badge="#f0b849" glyph={<MailGlyph />}
          title="Email"
          desc="If email is your favorite way, drop us a line to support@ninjateam.org."
          cta="Email us"
          onCta={() => { window.location.href = 'mailto:support@ninjateam.org'; }} />
      </div>

      <div style={wpiSupPage.note}>
        <span style={wpiSupPage.noteIc}><Ic name="lifesaver" /></span>
        <div style={wpiSupPage.noteTitle}>We're here to help, around the clock</div>
        <div style={wpiSupPage.metaRow}>
          <span style={wpiSupPage.metaItem}>Available 24/7</span>
          <span style={wpiSupPage.metaDot}></span>
          <span style={wpiSupPage.metaItem}>~8h average reply</span>
          <span style={wpiSupPage.metaDot}></span>
          <span style={wpiSupPage.metaItem}>Slower on weekends</span>
        </div>
        <div style={wpiSupPage.noteDivider}></div>
        <div style={wpiSupPage.noteThanks}>Thanks for trusting &amp; using NinjaTeam plugins — we'll always do our best to give you top-notch support.</div>
      </div>
    </div>);

}

Object.assign(window, { SupportPage });
