// app.jsx — WPImage plugin admin app. Mounts inside the real WordPress admin
// (no simulated chrome — WordPress provides the top bar + left menu). Buttons
// use native WordPress core classes. Uniquely-named style objects.

/* Static presentation config (was previously exposed as design Tweaks). */
const WPI_CONFIG = {
  headerStyle: 'hero',      // 'hero' | 'clean'
  pluginLayout: 'cards',    // 'cards' | 'list'
  aboutUs: true,
  statsPreview: 'mockup',   // 'mockup' | 'login'
  markColor: 'blue',        // 'blue' | 'green' | 'brand'
};

/* WPImage icon color palettes — the product's own identity color. */
const WPI_MARK_PALETTES = {
  blue:  ['#5b86f5', '#3858e9', '#2145e6'],
  green: ['#5ec97c', '#34a85a', '#1f8a4a'],
  brand: ['#fc794c', '#fa513c', '#e2293b'],
};

function wpiMarkGradient(variant) {
  const s = WPI_MARK_PALETTES[variant] || WPI_MARK_PALETTES.blue;
  return `linear-gradient(135deg, ${s[0]} 0%, ${s[1]} 52%, ${s[2]} 100%)`;
}

/* ============================================================
   WPImage brand mark — custom "image optimize" icon.
   ============================================================ */
function WPImageMark({ size = 24, variant = 'blue', style }) {
  const uid = React.useId().replace(/[:]/g, '');
  const gid = 'wpiMark-' + uid;
  const stops = WPI_MARK_PALETTES[variant] || WPI_MARK_PALETTES.blue;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ display:'block', flex:'none', ...style }} aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="2.5" y1="2.5" x2="21.5" y2="21.5" gradientUnits="userSpaceOnUse">
          <stop stopColor={stops[0]} />
          <stop offset="0.52" stopColor={stops[1]} />
          <stop offset="1" stopColor={stops[2]} />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="21" height="21" rx="6.2" fill={`url(#${gid})`} />
      <circle cx="7.7" cy="8.5" r="1.85" fill="#fff" />
      <path d="M4.7 17 L8.5 11.7 L11.1 14.7 L14 10 L19.3 17 Z" fill="#fff" />
      <circle cx="17.6" cy="6.6" r="2.77" fill="#fff" />
      <path d="M16.31 6.64 L17.22 7.58 L18.9 5.59"
        fill="none" stroke={`url(#${gid})`} strokeWidth="1.15"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
window.WPImageMark = WPImageMark;

/* ============================================================
   Page styles
   ============================================================ */
const wpiPage = {
  header: { background:'#fff', borderBottom:'1px solid var(--border)', padding:'20px 32px' },
  brand:  { display:'flex', alignItems:'center', gap:14, maxWidth:1080, margin:'0 auto' },
  page:   { padding:'28px 32px 64px', maxWidth:1080, margin:'0 auto' },
  hero:   { background:'var(--nt-gradient)', borderRadius:16, padding:'40px 44px', color:'#fff',
            display:'flex', alignItems:'center', gap:40, marginBottom:24, boxShadow:'var(--elevation-small)',
            minHeight:340, overflow:'hidden', position:'relative' },
  grid4:  { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:20 },
  twoCol: { display:'grid', gridTemplateColumns:'1.35fr 1fr', gap:20, marginBottom:20, alignItems:'start' },
  sectTitle:{ font:'var(--fw-semibold) 13px/1 var(--font-sans)', textTransform:'uppercase',
            letterSpacing:'.04em', color:'var(--fg-muted)', margin:'4px 0 12px' },
  saveBar:{ position:'sticky', bottom:0, background:'rgba(255,255,255,.92)', backdropFilter:'blur(6px)',
            borderTop:'1px solid var(--border)', padding:'12px 16px', display:'flex', alignItems:'center',
            justifyContent:'flex-end', gap:8, marginTop:8, borderRadius:'0 0 8px 8px',
            boxShadow:'0 -2px 8px rgba(0,0,0,.03)' },
  keyField:{ display:'flex', alignItems:'center', gap:8, background:'var(--surface-muted)',
            border:'1px solid var(--border)', borderRadius:4, padding:'7px 8px 7px 12px', flex:1, minWidth:0 },
};

/* ---------- Account / login section ---------- */
function AccountSection({ synced, syncing, openLogin, onDisconnect }) {
  if (!synced) {
    return (
      <div className="components-card" style={{ marginBottom:20 }}>
        <div className="wpi-accountrow" style={{ padding:18, display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ width:46, height:46, borderRadius:10, flex:'none', display:'flex', alignItems:'center',
            justifyContent:'center', background:'rgba(56,88,233,.1)', color:'var(--wp-admin-theme)' }}>
            <Ic name="cloud" /></span>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ font:'var(--fw-semibold) 15px/1.3 var(--font-sans)' }}>Connect your WPImage account</span>
              <span className="components-badge is-default">Not connected</span>
            </div>
            <div style={{ font:'13px/1.5 var(--font-sans)', color:'var(--fg-muted)', marginTop:3, maxWidth:600 }}>
              Login to sync your account and retrieve your API key. The free plan includes 200 image optimizations every month.
            </div>
          </div>
          <button className={'button button-primary button-hero' + (syncing ? ' is-busy' : '')} style={{ flex:'none' }} onClick={()=>{ if(!syncing) openLogin('login'); }} aria-disabled={syncing}>
            {syncing
              ? 'Syncing…'
              : <><Ic name="cloud-download" cls="sm" />Login to sync account</>}
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="components-card" style={{ marginBottom:20 }}>
      <div style={{ padding:18, display:'flex', alignItems:'flex-start', gap:16 }} className="wpi-accountrow">
        <span style={{ width:46, height:46, borderRadius:10, flex:'none', display:'flex', alignItems:'center',
          justifyContent:'center', background:'rgba(74,184,102,.14)', color:'var(--alert-green)' }}>
          <Ic name="check" /></span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
            <span style={{ font:'var(--fw-semibold) 15px/1.3 var(--font-sans)' }}>long@ninjateam.com</span>
            <span className="components-badge is-success">Connected</span>
            <span className="components-badge is-default">Free plan</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:12, flexWrap:'wrap' }}>
            <span className="wp-label" style={{ color:'var(--fg-muted)', flex:'none' }}>API key</span>
            <div style={wpiPage.keyField}>
              <span className="t-mono" style={{ fontSize:13, color:'var(--fg)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                wpi_live_••••••••••••3F9A</span>
              <button className="components-button is-tertiary is-small" style={{ flex:'none' }}><Ic name="copy" cls="xs" />Copy</button>
            </div>
          </div>
        </div>
        <button className="components-button is-tertiary is-small" style={{ flex:'none' }} onClick={onDisconnect}>Disconnect</button>
      </div>
    </div>
  );
}

/* ---------- WordPress image sizes (Files optimization) ---------- */
const WP_SIZES = [
  { id:'thumb',  name:'Thumbnail',    dim:'150 × 150' },
  { id:'medium', name:'Medium',       dim:'300 × 300' },
  { id:'mlarge', name:'Medium Large', dim:'768 × auto' },
  { id:'large',  name:'Large',        dim:'1024 × 1024' },
  { id:'s1536',  name:'1536 × 1536',  dim:'1536 × 1536' },
  { id:'s2048',  name:'2048 × 2048',  dim:'2048 × 2048' },
];

function OptRow({ o, on, toggle }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onClick={()=>toggle(o.id)}
      style={{ display:'flex', alignItems:'center', padding:'8px 10px', borderRadius:4, cursor:'pointer',
        background: hover ? 'var(--surface-muted)' : 'transparent' }}>
      <span className={'components-checkbox-control' + (on ? ' is-checked' : '')} style={{ pointerEvents:'none', gap:10 }}>
        <input type="checkbox" className="components-checkbox-control__input" checked={on} readOnly tabIndex={-1} />
        <span className="components-checkbox-control__box" aria-hidden="true"></span>
        <span style={{ display:'flex', flexDirection:'column', gap:1 }}>
          <span style={{ font:'var(--fw-medium) 13px/1.3 var(--font-sans)', color:'var(--fg)' }}>{o.name}</span>
          <span style={{ font:'12px/1.3 var(--font-sans)', color:'var(--fg-muted)' }}>{o.dim}</span>
        </span>
      </span>
    </div>
  );
}

function FilesOptimization({ selected, toggle }) {
  const [open, setOpen] = React.useState(false);
  const [dropUp, setDropUp] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  React.useLayoutEffect(() => {
    if (open && ref.current) {
      const r = ref.current.getBoundingClientRect();
      setDropUp((window.innerHeight - r.bottom) < 300);
    }
  }, [open]);
  const names = WP_SIZES.filter(o => selected.includes(o.id)).map(o => o.name);
  const summary = names.length ? names.join(', ') : 'Select image sizes to optimize';
  return (
    <div ref={ref} style={{ position:'relative', maxWidth:440 }}>
      <button type="button" className="wp-select" onClick={()=>setOpen(o=>!o)}
        style={{ display:'flex', alignItems:'center', textAlign:'left', cursor:'pointer', background:'#fff' }}>
        {names.length > 0 && (
          <span className="components-badge is-info" style={{ minHeight:20, marginRight:8, flex:'none' }}>{names.length}</span>
        )}
        <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', lineHeight:1.5,
          color: names.length ? 'var(--fg)' : 'var(--fg-muted)' }}>{summary}</span>
      </button>
      {open && (
        <div className="wpi-menu" style={{ position:'absolute', left:0, right:0, zIndex:100,
          ...(dropUp ? { bottom:'calc(100% + 4px)' } : { top:'calc(100% + 4px)' }) }}>
          {WP_SIZES.map(o => <OptRow key={o.id} o={o} on={selected.includes(o.id)} toggle={toggle} />)}
        </div>
      )}
    </div>
  );
}

/* ---------- Hero feature mockup (image-compression illustration) ---------- */
const wpiHeroMock = {
  wrap: { flex:'none', width:380, position:'relative' },
  back: { position:'absolute', top:-20, right:-8, width:300, height:104, background:'rgba(255,255,255,.16)',
    borderRadius:14, transform:'rotate(4deg)' },
  card: { position:'relative', background:'#fff', borderRadius:14, padding:'18px 18px 20px',
    boxShadow:'0 26px 54px rgba(0,0,0,.24)', color:'var(--fg)' },
  fileRow: { display:'flex', alignItems:'center', gap:12 },
  thumb: { width:46, height:46, borderRadius:8, background:'var(--gray-100)', flex:'none',
    display:'flex', alignItems:'center', justifyContent:'center' },
  fname: { font:'var(--fw-semibold) 13px/1.3 var(--font-sans)', color:'var(--fg)' },
  fmeta: { font:'11px/1.3 var(--font-sans)', color:'var(--fg-muted)', marginTop:2 },
  pill: { marginLeft:'auto', flex:'none', display:'inline-flex', alignItems:'center', gap:3,
    background:'rgba(74,184,102,.14)', color:'var(--alert-green)', borderRadius:9999,
    padding:'3px 9px 3px 6px', font:'var(--fw-semibold) 11px/1 var(--font-sans)' },
  divider: { height:1, background:'var(--border)', margin:'14px 0' },
  barRow: { display:'flex', alignItems:'center', gap:10, marginTop:10 },
  barLabel: { width:60, flex:'none', font:'var(--fw-medium) 11px/1 var(--font-sans)', color:'var(--fg-muted)' },
  track: { flex:1, height:8, borderRadius:9999, background:'var(--gray-100)', display:'block', overflow:'hidden' },
  size: { width:52, flex:'none', textAlign:'right', font:'var(--fw-semibold) 12px/1 var(--font-sans)', color:'var(--fg)' },
  savings: { display:'flex', alignItems:'baseline', gap:8, marginTop:18 },
  savingsNum: { font:'700 26px/1 var(--font-sans)', color:'var(--alert-green)', letterSpacing:'-0.02em' },
  savingsTxt: { font:'12px/1.35 var(--font-sans)', color:'var(--fg-muted)' },
};

function ImgGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" style={{ display:'block' }}>
      <circle cx="8.5" cy="8.5" r="2" fill="var(--gray-500)" />
      <path d="M3.5 18.5 9 12l3.2 3.8L16 11l4.5 7.5z" fill="var(--gray-500)" />
    </svg>);

}

function CompressionMockup() {
  return (
    <div className="wpi-heromock" style={wpiHeroMock.wrap}>
      <div style={wpiHeroMock.back} />
      <div style={wpiHeroMock.card}>
        <div style={wpiHeroMock.fileRow}>
          <div style={wpiHeroMock.thumb}><ImgGlyph /></div>
          <div style={{ minWidth:0 }}>
            <div style={wpiHeroMock.fname}>autumn-trail.jpg</div>
            <div style={wpiHeroMock.fmeta}>1920 × 1080 · JPEG</div>
          </div>
          <span style={wpiHeroMock.pill}><Ic name="check" cls="xs" />Optimized</span>
        </div>
        <div style={wpiHeroMock.divider} />
        <div style={wpiHeroMock.barRow}>
          <span style={wpiHeroMock.barLabel}>Original</span>
          <span style={wpiHeroMock.track}><span style={{ display:'block', height:'100%', width:'100%', background:'var(--gray-300)' }} /></span>
          <span style={wpiHeroMock.size}>2.4 MB</span>
        </div>
        <div style={wpiHeroMock.barRow}>
          <span style={wpiHeroMock.barLabel}>Optimized</span>
          <span style={wpiHeroMock.track}><span style={{ display:'block', height:'100%', width:'16%', background:'var(--alert-green)' }} /></span>
          <span style={wpiHeroMock.size}>340 KB</span>
        </div>
        <div style={wpiHeroMock.savings}>
          <span style={wpiHeroMock.savingsNum}>−86%</span>
          <span style={wpiHeroMock.savingsTxt}>smaller file size,<br/>with no visible quality loss</span>
        </div>
      </div>
    </div>);

}

function DashboardPage({ t, synced, syncing, openLogin, onDisconnect }) {
  const trendVals = [3,5,2,6,4,1,2,4,7,5,8,6,2,3,5,7,4,9,7,3,2,5,8,6,10,7,4,2,6,9];
  const trendLabels = { 0:'May 1', 6:'7', 13:'14', 20:'21', 29:'30' };
  const trend = trendVals.map((v, i) => ({ v, label: trendLabels[i] || '', hi: i === trendVals.length - 1 }));
  const trendTotal = trendVals.reduce((a, b) => a + b, 0);
  const quotaTotal = 200, quotaUsed = trendTotal, resetDate = 'Jun 14';

  return (
    <div className="wpi-page" style={wpiPage.page}>
      {t.headerStyle === 'hero' && (
        <div className="wpi-hero" style={{ ...wpiPage.hero, background: wpiMarkGradient(t.markColor) }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ font:'var(--fw-semibold) 12px/1 var(--font-sans)', textTransform:'uppercase', letterSpacing:'.09em', opacity:.8, marginBottom:14 }}>Image optimization</div>
            <div style={{ fontSize:32, fontWeight:700, letterSpacing:'-0.02em', lineHeight:1.12 }}>Smaller images, faster site</div>
            <div style={{ fontSize:16, opacity:.92, marginTop:12, maxWidth:430, lineHeight:1.5 }}>WPImage compresses every image you upload — automatically, with no visible quality loss.</div>
            <div style={{ display:'flex', flexDirection:'column', gap:11, marginTop:24 }}>
              {['Automatic optimization on every upload', 'Next-gen WebP conversion', 'Bulk-optimize your whole media library'].map((f, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, font:'var(--fw-medium) 14px/1.3 var(--font-sans)' }}>
                  <span style={{ width:20, height:20, borderRadius:9999, background:'rgba(255,255,255,.22)', flex:'none', display:'flex', alignItems:'center', justifyContent:'center' }}><Ic name="check" cls="xs" /></span>
                  {f}
                </div>
              ))}
            </div>
          </div>
          <CompressionMockup />
        </div>
      )}

      {/* Account / login */}
      <AccountSection synced={synced} syncing={syncing} openLogin={openLogin} onDisconnect={onDisconnect} />

      {/* Statistics */}
      <div style={wpiPage.sectTitle}>Statistics</div>
      <div style={{ position:'relative' }}>
        <div className="wpi-statgrid" style={{ ...wpiPage.grid4, gridTemplateColumns:'repeat(3,1fr)' }}>
          <StatCard icon="cloud-upload" tint="#3858e9" label="Images optimized" value="12,480" sub={`${trendTotal} this month`} locked={!synced} />
          <StatCard icon="backup"       tint="#4ab866" label="Total space saved" value="3.72 GB" sub="avg 305 KB / image" locked={!synced} />
          <StatCard icon="chart-bar"    tint="#7a00df" label="Avg. compression" value="62%" sub="lossy + WebP" locked={!synced} />
        </div>

        <div className="wpi-twocol" style={{ ...wpiPage.twoCol, alignItems:'stretch' }}>
          <SectionCard title="Optimizations" sub="Images processed over the last 30 days" icon="chart-bar"
            style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}
            bodyStyle={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
            {synced ? (
              <TrendChart data={trend} locked={false} />
            ) : t.statsPreview === 'mockup' ? (
              <TrendChart data={trend} locked={true} />
            ) : (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                gap:12, minHeight:200, textAlign:'center' }}>
                <span style={{ width:44, height:44, borderRadius:9999, background:'var(--surface-subtle, #f0f0f1)',
                  border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--fg-muted)' }}>
                  <Ic name="lock" cls="sm" />
                </span>
                <div>
                  <div style={{ font:'var(--fw-medium) 14px/1.3 var(--font-sans)', color:'var(--fg)' }}>Login to view your stats</div>
                  <div style={{ font:'12px/1.4 var(--font-sans)', color:'var(--fg-muted)', marginTop:3 }}>Sync your account to see your optimization history.</div>
                </div>
                <button className="button button-primary button-small" onClick={()=>openLogin('login')}>Login to sync</button>
              </div>
            )}
          </SectionCard>
          <SectionCard title="Monthly quota" icon="cloud"
            style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}
            bodyStyle={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between', gap:20 }}>
            {!synced ? (
              <div style={{ height:8, borderRadius:9999, background:'var(--gray-200)' }} />
            ) : (
              <QuotaBar used={quotaUsed} total={quotaTotal} />
            )}
            <div style={{ display:'flex', alignItems:'center' }}>
              <div style={{ flex:1 }}>
                <div className="wp-label" style={{ color:'var(--fg-muted)' }}>Remaining</div>
                {!synced
                  ? <div style={{ height:14, width:64, borderRadius:4, background:'var(--gray-200)', marginTop:7 }} />
                  : <div style={{ font:'var(--fw-semibold) 18px/1.2 var(--font-sans)', marginTop:5 }}>{(quotaTotal - quotaUsed).toLocaleString()}</div>}
              </div>
              <div style={{ width:1, alignSelf:'stretch', background:'var(--border)', margin:'0 20px' }} />
              <div style={{ flex:1 }}>
                <div className="wp-label" style={{ color:'var(--fg-muted)' }}>Resets on</div>
                {!synced
                  ? <div style={{ height:14, width:64, borderRadius:4, background:'var(--gray-200)', marginTop:7 }} />
                  : <div style={{ font:'var(--fw-semibold) 18px/1.2 var(--font-sans)', marginTop:5 }}>{resetDate}</div>}
              </div>
            </div>
            <div style={{ font:'12px/1.5 var(--font-sans)', color:'var(--fg-muted)',
              display:'flex', alignItems:'center', gap:4, flexWrap:'wrap' }}>
              Quota resets every 30 days. Need more?
              <button className="button-link" style={{ fontSize:12 }}>Upgrade to Pro</button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ compression, setCompression, settings, set, toggleSize, saving, save, dirty, onReset }) {
  const COMPRESSION_HINT = {
    Lossy:    'Smallest files, ideal for the web — minor quality loss that is rarely visible.',
    Glossy:   'Balanced — near-original quality with strong savings. Recommended for most sites.',
    Lossless: 'Preserves maximum quality with no visible loss. Files stay larger than lossy or glossy.',
  };
  return (
    <div className="wpi-page" style={wpiPage.page}>
      {/* General settings */}
      <div style={wpiPage.sectTitle}>General settings</div>
      <SectionCard pad={false}>
        <div className="wp-panel" style={{ border:'none', borderRadius:8 }}>
          <SettingRow title="Auto-optimize images on upload"
            sub="Automatically optimize every image you upload to WordPress.">
            <Toggle on={settings.autoOptimize} onChange={v=>set('autoOptimize',v)} />
          </SettingRow>
          <SettingRow last title="Backup original images"
            sub="Keep your original images in a separate folder before the optimization process.">
            <Toggle on={settings.backup} onChange={v=>set('backup',v)} />
          </SettingRow>
        </div>
      </SectionCard>

      {/* Optimization */}
      <div style={wpiPage.sectTitle}>Optimization</div>
      <SectionCard pad={false} style={{ overflow:'visible' }}>
        <div className="wp-panel" style={{ border:'none', borderRadius:'8px 8px 0 0' }}>
          <SettingRow title="Compression level"
            sub={COMPRESSION_HINT[compression]}>
            <SegControl value={compression} options={['Lossy','Glossy','Lossless']}
              onChange={v=>setCompression(v)} />
          </SettingRow>
          <SettingRow title="WebP"
            sub="Create WebP versions of your images and serve them automatically to supported browsers.">
            <Toggle on={settings.webp} onChange={v=>set('webp',v)} />
          </SettingRow>
          <SettingRow last={!settings.resize}
            title={<>Resize larger images<InfoTip text="You can save up to 80% after resizing. The new width should not be less than your largest thumbnail width (currently 2048px). Resizing runs on upload or during optimization." /></>}
            sub="Recommended to reduce larger images.">
            <Toggle on={settings.resize} onChange={v=>set('resize',v)} />
          </SettingRow>
          {settings.resize && (
            <div className="wp-panel-row" style={{ borderBottom:'none', background:'var(--surface-subtle)' }}>
              <div className="meta"><span className="ttl">Maximum width</span>
                <span className="sub">Images wider than this are scaled down on optimization.</span></div>
              <div style={{ display:'flex', alignItems:'center', gap:8, flex:'none' }}>
                <input className="small-text" type="number" value={settings.resizeW}
                  onChange={e=>set('resizeW', e.target.value)} style={{ width:96 }} />
                <span style={{ font:'13px/1 var(--font-sans)', color:'var(--fg-muted)' }}>px</span>
              </div>
            </div>
          )}
        </div>
        <div style={{ padding:16, borderTop:'1px solid var(--border)' }}>
          <div style={{ font:'var(--fw-medium) 13px/1.4 var(--font-sans)', marginBottom:3, display:'flex', alignItems:'center' }}>Files optimization<InfoTip text="Optimizing more sizes saves more space but uses more of your monthly quota." /></div>
          <div style={{ font:'12px/1.5 var(--font-sans)', color:'var(--fg-muted)', marginBottom:14, maxWidth:640 }}>
            Choose which image sizes created by WordPress should be optimized.
          </div>
          <FilesOptimization selected={settings.sizes} toggle={toggleSize} />
        </div>
      </SectionCard>

      <div className="wpi-savebar" style={wpiPage.saveBar}>
        <span style={{ font:'12px/1.4 var(--font-sans)', color:'var(--fg-muted)', marginRight:'auto', display:'inline-flex', alignItems:'center', gap:6, minHeight:16 }}>
          {dirty && (<><span style={{ width:6, height:6, borderRadius:9999, background:'var(--alert-yellow)', flex:'none' }}></span>You have unsaved changes</>)}
        </span>
        <button className="components-button is-tertiary" onClick={onReset} disabled={saving} title="Restore default settings">Reset to defaults</button>
        <button className={'button button-primary' + (saving ? ' is-busy' : '')} onClick={()=>{ if(!saving && dirty) save(); }} aria-disabled={saving || !dirty}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   Plugin shell (header + tabs + page state)
   ============================================================ */
const WPI_DEFAULT_SETTINGS = { autoOptimize:true, backup:true, webp:false, resize:false, resizeW:2048, sizes:[] };
const WPI_DEFAULT_COMPRESSION = 'Glossy';

function PluginShell() {
  const t = WPI_CONFIG;
  const [compression, setCompressionState] = React.useState(WPI_DEFAULT_COMPRESSION);
  const [synced, setSynced] = React.useState(false);
  const [syncing, setSyncing] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState('login');
  const openLogin = (mode = 'login') => { setAuthMode(mode); setLoginOpen(true); };
  const [toast, setToast] = React.useState(null);
  const [tab, setTab] = React.useState('dashboard');
  const [moreOpen, setMoreOpen] = React.useState(false);
  React.useEffect(() => {
    if (!moreOpen) return;
    const onDocClick = (e) => {
      if (e.target.closest && e.target.closest('.wpi-brand-more')) return;
      setMoreOpen(false);
    };
    const id = setTimeout(() => document.addEventListener('click', onDocClick), 0);
    return () => { clearTimeout(id); document.removeEventListener('click', onDocClick); };
  }, [moreOpen]);
  const [settings, setSettings] = React.useState(() => ({ ...WPI_DEFAULT_SETTINGS }));
  const [saving, setSaving] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  const set = (k,v) => { setSettings(s => ({ ...s, [k]:v })); setDirty(true); };
  const setCompression = (v) => { setCompressionState(v); setDirty(true); };
  const toggleSize = (id) => set('sizes', settings.sizes.includes(id) ? settings.sizes.filter(x=>x!==id) : [...settings.sizes, id]);

  const fireToast = (msg) => {
    setToast({ msg, leaving:false });
    clearTimeout(window.__wpiT); clearTimeout(window.__wpiTout);
    window.__wpiT = setTimeout(() => {
      setToast(t => t ? { ...t, leaving:true } : null);
      window.__wpiTout = setTimeout(() => setToast(null), 230);
    }, 2800);
  };
  const save = () => { setSaving(true); setTimeout(()=>{ setSaving(false); setDirty(false); fireToast('Settings saved. Your changes are now live on the site.'); }, 2000); };
  const resetToDefaults = () => {
    setSettings({ ...WPI_DEFAULT_SETTINGS });
    setCompressionState(WPI_DEFAULT_COMPRESSION);
    setDirty(true);
  };
  const onLogin = () => {
    setLoginOpen(false);
    setSyncing(true);
    setTimeout(()=>{ setSyncing(false); setSynced(true); fireToast('Account synced. API key retrieved.'); }, 2000);
  };
  const onDisconnect = () => { setSynced(false); fireToast('Account disconnected.'); };

  const tabs = [
    { id:'dashboard', label:'Dashboard', icon:'dashboard' },
    { id:'settings',  label:'Settings',  icon:'settings' },
    { id:'plugins',   label:'About us', icon:'people' },
  ];

  return (
    <React.Fragment>
      <div className="wpi-pageheader" style={{ ...wpiPage.header, paddingBottom:0 }}>
        <div className="wpi-brand" style={{ ...wpiPage.brand, marginBottom:16 }}>
          <WPImageMark size={36} variant={t.markColor} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:18, fontWeight:600, letterSpacing:'-0.01em', display:'flex', alignItems:'center', gap:8 }}>
              WPImage
              <span style={{ fontSize:12, fontWeight:500, color:'var(--fg-muted)' }}>v2.8.15</span>
            </div>
            <div style={{ font:'12px/1.4 var(--font-sans)', color:'var(--fg-muted)', marginTop:1 }}>Image compression for WordPress</div>
          </div>
          <div className="wpi-brand-more">
            <button type="button" className="wpi-head-kebab" aria-label="More actions"
              aria-expanded={moreOpen} onClick={()=>setMoreOpen(o=>!o)}><Ic name="more" /></button>
            <div className={'wpi-brand-actions' + (moreOpen ? ' is-open' : '')}>
              <a className="components-button is-tertiary is-small wpi-head-btn" href="#" onClick={e=>{e.preventDefault(); setMoreOpen(false);}}><Ic name="megaphone" cls="sm" />Submit your idea</a>
              <button className={'button button-small wpi-head-btn' + (tab==='support' ? ' is-active' : '')} onClick={()=>{ setTab('support'); setMoreOpen(false); }}><Ic name="lifesaver" cls="sm" />Support</button>
            </div>
          </div>
        </div>
        <div className="components-tab-panel__tabs wpi-tabs" style={{ maxWidth:1080, margin:'0 auto', border:'none' }}>
          {tabs.map(tb => (
            <div key={tb.id} className={'components-tab-panel__tabs-item' + (tab===tb.id ? ' active' : '')} onClick={()=>setTab(tb.id)}
              style={{ display:'flex', alignItems:'center', gap:6 }}>
              <Ic name={tb.icon} cls="sm" />{tb.label}
            </div>
          ))}
        </div>
      </div>

      {tab === 'dashboard' && (
        <DashboardPage t={t} synced={synced} syncing={syncing} openLogin={openLogin} onDisconnect={onDisconnect} />
      )}
      {tab === 'settings' && (
        <SettingsPage compression={compression} setCompression={setCompression} settings={settings} set={set} toggleSize={toggleSize} saving={saving} save={save} dirty={dirty} onReset={resetToDefaults} />
      )}
      {tab === 'plugins' && (
        <PluginsPage fireToast={fireToast} layout={t.pluginLayout} about={t.aboutUs} />
      )}
      {tab === 'support' && (
        <SupportPage fireToast={fireToast} />
      )}

      {toast && (
        <div className="wpi-toast-wrap">
          <div className={`components-snackbar ${toast.leaving ? 'wpi-toast-out' : 'wpi-toast-in'}`}>
            <Ic name="check" cls="sm" style={{ color:'var(--alert-green)', flex:'none' }} />
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      {window.LoginModal && (
        <window.LoginModal open={loginOpen} mode={authMode} markVariant={t.markColor}
          onClose={() => setLoginOpen(false)} onLogin={onLogin} />
      )}
    </React.Fragment>
  );
}

function App() { return <PluginShell />; }

(function mountWPImage() {
  const el = document.getElementById('wpimage-root');
  if (!el) return;
  el.innerHTML = '';
  ReactDOM.createRoot(el).render(<App />);
})();
