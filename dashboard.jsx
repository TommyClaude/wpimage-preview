// dashboard.jsx — WPImage plugin dashboard inside the WordPress admin shell.
// Forked from the NinjaTeam WP plugin admin UI kit. Uniquely-named style objects.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "headerStyle": "clean",
  "account": "out",
  "compression": "Glossy"
} /*EDITMODE-END*/;

/* ============================================================
   WordPress admin chrome (dark top bar + left menu)
   ============================================================ */
const wpiChrome = {
  root: { display: 'flex', flexDirection: 'column', minHeight: '100%', background: 'var(--wp-admin-bg)' },
  bar: { height: 32, background: '#1d2327', color: '#f0f0f1', display: 'flex', alignItems: 'center',
    paddingRight: 12, fontSize: 13, position: 'sticky', top: 0, zIndex: 40, flex: 'none' },
  barItem: { display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 10px', color: '#c3c4c7', cursor: 'pointer', fontSize: 13 },
  body: { display: 'flex', flex: 1, minHeight: 0 },
  menu: { width: 160, background: '#1d2327', flex: 'none', paddingTop: 0 },
  content: { flex: 1, minWidth: 0, overflow: 'auto' }
};

function MenuItem({ icon, label, active, brandMark, onClick }) {
  const [hover, setHover] = React.useState(false);
  const bg = active ? 'var(--wp-admin-theme)' : hover ? '#1e1e1e' : 'transparent';
  const fg = active ? '#fff' : hover ? '#72aee6' : '#f0f0f1';
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    style={{ display: 'flex', alignItems: 'center', gap: 8, height: 34, padding: '0 10px',
      background: bg, color: fg, cursor: 'pointer', fontSize: 14, fontWeight: active ? 600 : 400 }}>
      {brandMark ?
      <img src="assets/logo-mark.png" alt="" style={{ width: 20, height: 20, flex: 'none' }} /> :
      <Ic name={icon} cls="sm" />}
      <span>{label}</span>
    </div>);

}

function AdminChrome({ children }) {
  const items = [
  { icon: 'dashboard', label: 'Dashboard' },
  { icon: 'page', label: 'Posts' },
  { icon: 'cloud', label: 'Media' },
  { icon: 'pages', label: 'Pages' },
  { icon: 'styles', label: 'Appearance' },
  { icon: 'plugins', label: 'Plugins' },
  { icon: 'people', label: 'Users' },
  { icon: 'tool', label: 'Tools' },
  { icon: 'settings', label: 'Settings' }];

  return (
    <div style={wpiChrome.root}>
      <div style={wpiChrome.bar}>
        <div style={{ ...wpiChrome.barItem, color: '#fff' }}><Ic name="wordpress" cls="sm" /></div>
        <div style={wpiChrome.barItem}><Ic name="dashboard" cls="sm" /><span>Ninja Demo Site</span></div>
        <div style={wpiChrome.barItem}><Ic name="update" cls="sm" /></div>
        <div style={wpiChrome.barItem}><Ic name="plus" cls="sm" /><span>New</span></div>
        <div style={{ flex: 1 }} />
        <div style={wpiChrome.barItem}><span>Howdy, Long</span></div>
      </div>
      <div style={wpiChrome.body}>
        <nav style={wpiChrome.menu}>
          {items.map((it, i) => <MenuItem key={i} {...it} />)}
          <MenuItem brandMark label="WPImage" active />
        </nav>
        <main style={wpiChrome.content}>{children}</main>
      </div>
    </div>);

}

/* ============================================================
   Dashboard page
   ============================================================ */
const wpiPage = {
  header: { background: '#fff', borderBottom: '1px solid var(--border)', padding: '20px 32px' },
  brand: { display: 'flex', alignItems: 'center', gap: 14, maxWidth: 1080, margin: '0 auto' },
  page: { padding: '28px 32px 64px', maxWidth: 1080, margin: '0 auto' },
  hero: { background: 'var(--nt-gradient)', borderRadius: 12, padding: '22px 26px', color: '#fff',
    display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24, boxShadow: 'var(--elevation-small)' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 },
  twoCol: { display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 20, marginBottom: 20, alignItems: 'start' },
  sectTitle: { font: 'var(--fw-semibold) 13px/1 var(--font-sans)', textTransform: 'uppercase',
    letterSpacing: '.04em', color: 'var(--fg-muted)', margin: '4px 0 12px' },
  saveBar: { position: 'sticky', bottom: 0, background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(6px)',
    borderTop: '1px solid var(--border)', padding: '12px 16px', display: 'flex', alignItems: 'center',
    justifyContent: 'flex-end', gap: 8, marginTop: 8, borderRadius: '0 0 8px 8px',
    boxShadow: '0 -2px 8px rgba(0,0,0,.03)' },
  keyField: { display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-muted)',
    border: '1px solid var(--border)', borderRadius: 4, padding: '7px 8px 7px 12px', flex: 1, minWidth: 0 },
  fileRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    padding: '11px 14px', border: '1px solid var(--border)', borderRadius: 6, background: '#fff' }
};

/* ---------- Account / login section ---------- */
function AccountSection({ synced, syncing, onLogin, onDisconnect }) {
  if (!synced) {
    return (
      <div className="wp-card" style={{ marginBottom: 20 }}>
        <div style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 46, height: 46, borderRadius: 10, flex: 'none', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'rgba(56,88,233,.1)', color: 'var(--wp-admin-theme)' }}>
            <Ic name="cloud" /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ font: 'var(--fw-semibold) 15px/1.3 var(--font-sans)' }}>Connect your WPImage account</span>
              <span className="wp-badge gray">Not connected</span>
            </div>
            <div style={{ font: '13px/1.5 var(--font-sans)', color: 'var(--fg-muted)', marginTop: 3, maxWidth: 600 }}>
              Login to sync your account and retrieve your API key. The free plan includes 200 image optimizations every month.
            </div>
          </div>
          <button className="wp-btn primary lg" style={{ flex: 'none' }} onClick={onLogin} disabled={syncing}>
            {syncing ?
            <><span className="wp-spinner" style={{ borderTopColor: '#fff', borderColor: 'rgba(255,255,255,.4)' }}></span>Syncing…</> :
            <><Ic name="cloud-download" cls="sm" />Login to sync account</>}
          </button>
        </div>
      </div>);

  }
  return (
    <div className="wp-card" style={{ marginBottom: 20 }}>
      <div style={{ padding: 18, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <span style={{ width: 46, height: 46, borderRadius: 10, flex: 'none', display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: 'rgba(74,184,102,.14)', color: 'var(--alert-green)' }}>
          <Ic name="check" /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ font: 'var(--fw-semibold) 15px/1.3 var(--font-sans)' }}>long@ninjateam.com</span>
            <span className="wp-badge green">Connected</span>
            <span className="wp-badge gray">Free plan</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
            <span className="wp-label" style={{ color: 'var(--fg-muted)', flex: 'none' }}>API key</span>
            <div style={wpiPage.keyField}>
              <span className="t-mono" style={{ fontSize: 13, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                wpi_live_••••••••••••3F9A</span>
              <button className="wp-btn tertiary sm" style={{ flex: 'none' }}><Ic name="copy" cls="xs" />Copy</button>
            </div>
          </div>
        </div>
        <button className="wp-btn tertiary sm" style={{ flex: 'none' }} onClick={onDisconnect}>Disconnect</button>
      </div>
    </div>);

}

/* ---------- WordPress image sizes (Files optimization) ---------- */
const WP_SIZES = [
{ id: 'thumb', name: 'Thumbnail', dim: '150 × 150' },
{ id: 'medium', name: 'Medium', dim: '300 × 300' },
{ id: 'mlarge', name: 'Medium Large', dim: '768 × auto' },
{ id: 'large', name: 'Large', dim: '1024 × 1024' },
{ id: 's1536', name: '1536 × 1536', dim: '1536 × 1536' },
{ id: 's2048', name: '2048 × 2048', dim: '2048 × 2048' }];


function OptRow({ o, on, toggle }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={() => toggle(o.id)}
    style={{ display: 'flex', alignItems: 'center', padding: '8px 10px', borderRadius: 4, cursor: 'pointer',
      background: hover ? 'var(--surface-muted)' : 'transparent' }}>
      <span className={'wp-check' + (on ? ' on' : '')} style={{ pointerEvents: 'none', gap: 10 }}>
        <span className="box"><Ic name="check" cls="xs" /></span>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ font: 'var(--fw-medium) 13px/1.3 var(--font-sans)', color: 'var(--fg)' }}>{o.name}</span>
          <span style={{ font: '12px/1.3 var(--font-sans)', color: 'var(--fg-muted)' }}>{o.dim}</span>
        </span>
      </span>
    </div>);

}

function FilesOptimization({ selected, toggle }) {
  const [open, setOpen] = React.useState(false);
  const [dropUp, setDropUp] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  React.useLayoutEffect(() => {
    if (open && ref.current) {
      const r = ref.current.getBoundingClientRect();
      setDropUp(window.innerHeight - r.bottom < 300);
    }
  }, [open]);
  const names = WP_SIZES.filter((o) => selected.includes(o.id)).map((o) => o.name);
  const summary = names.length ? names.join(', ') : 'Select image sizes to optimize';
  return (
    <div ref={ref} style={{ position: 'relative', maxWidth: 440 }}>
      <button type="button" className="wp-select" onClick={() => setOpen((o) => !o)}
      style={{ display: 'flex', alignItems: 'center', textAlign: 'left', cursor: 'pointer', background: '#fff' }}>
        {names.length > 0 &&
        <span className="wp-badge blue" style={{ height: 20, marginRight: 8, flex: 'none' }}>{names.length}</span>
        }
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: names.length ? 'var(--fg)' : 'var(--fg-muted)' }}>{summary}</span>
      </button>
      {open &&
      <div className="wp-menu" style={{ position: 'absolute', left: 0, right: 0, zIndex: 60,
        ...(dropUp ? { bottom: 'calc(100% + 4px)' } : { top: 'calc(100% + 4px)' }) }}>
          {WP_SIZES.map((o) => <OptRow key={o.id} o={o} on={selected.includes(o.id)} toggle={toggle} />)}
        </div>
      }
    </div>);

}

function DashboardPage({ t, setTweak, synced, syncing, onLogin, onDisconnect, fireToast }) {
  const [settings, setSettings] = React.useState({
    autoOptimize: true, backup: true, webp: true, resize: true, resizeW: 2048,
    sizes: []
  });
  const [saving, setSaving] = React.useState(false);
  const set = (k, v) => setSettings((s) => ({ ...s, [k]: v }));
  const toggleSize = (id) => set('sizes', settings.sizes.includes(id) ? settings.sizes.filter((x) => x !== id) : [...settings.sizes, id]);
  const COMPRESSION_HINT = {
    Lossy: 'Smallest files, ideal for the web — minor quality loss that is rarely visible.',
    Glossy: 'Balanced — near-original quality with strong savings. Recommended for most sites.',
    Lossless: 'Preserves maximum quality with no visible loss. Files stay larger than lossy or glossy.'
  };
  const save = () => {setSaving(true);setTimeout(() => {setSaving(false);fireToast('Settings saved. Your changes are now live on the site.');}, 900);};

  const trendVals = [3, 5, 2, 6, 4, 1, 2, 4, 7, 5, 8, 6, 2, 3, 5, 7, 4, 9, 7, 3, 2, 5, 8, 6, 10, 7, 4, 2, 6, 9];
  const trendLabels = { 0: 'May 1', 6: '7', 13: '14', 20: '21', 29: '30' };
  const trend = trendVals.map((v, i) => ({ v, label: trendLabels[i] || '', hi: i === trendVals.length - 1 }));
  const trendTotal = trendVals.reduce((a, b) => a + b, 0);
  const quotaTotal = 200,quotaUsed = trendTotal,resetDate = 'Jun 14';

  return (
    <div style={wpiPage.page}>
      {t.headerStyle === 'hero' &&
      <div style={wpiPage.hero}>
          <img src="assets/logo-mark.png" alt="" style={{ width: 54, height: 54, flex: 'none' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 21, fontWeight: 600 }}>Smaller images, faster site</div>
            <div style={{ fontSize: 14, opacity: .92, marginTop: 3 }}>WPImage compresses every image you upload — automatically, with no visible quality loss.</div>
          </div>
          {!synced &&
        <button className="wp-btn lg" style={{ background: '#fff', color: 'var(--nt-deep)', fontWeight: 600, flex: 'none' }} onClick={onLogin} disabled={syncing}>
              {syncing ? <><span className="wp-spinner" style={{ borderTopColor: 'var(--nt-deep)', borderColor: 'rgba(226,41,59,.3)' }}></span>Syncing…</> : <><Ic name="cloud-download" cls="sm" />Login to sync</>}
            </button>
        }
        </div>
      }

      {/* Account / login */}
      <AccountSection synced={synced} syncing={syncing} onLogin={onLogin} onDisconnect={onDisconnect} />

      {/* Statistics */}
      <div style={wpiPage.sectTitle}>Statistics</div>
      <div style={{ position: 'relative' }}>
        <div style={{ ...wpiPage.grid4, gridTemplateColumns: 'repeat(3,1fr)' }}>
          <StatCard icon="cloud-upload" tint="#3858e9" label="Images optimized" value="12,480" sub={`${trendTotal} this month`} locked={!synced} />
          <StatCard icon="backup" tint="#4ab866" label="Total space saved" value="3.72 GB" sub="avg 305 KB / image" locked={!synced} />
          <StatCard icon="chart-bar" tint="#7a00df" label="Avg. compression" value="62%" sub="lossy + WebP" locked={!synced} />
        </div>

        <div style={{ ...wpiPage.twoCol, alignItems: 'stretch' }}>
          <SectionCard title="Optimizations" sub="Images processed over the last 30 days" icon="chart-bar"
          action={synced && <span style={{ font: 'var(--fw-semibold) 13px/1 var(--font-sans)', color: 'var(--alert-green)' }}>▲ {trendTotal.toLocaleString()} total</span>}
          style={{ display: 'flex', flexDirection: 'column' }}
          bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <TrendChart data={trend} locked={!synced} />
          </SectionCard>
          <SectionCard title="Monthly quota" icon="cloud"
          style={{ display: 'flex', flexDirection: 'column' }}
          bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={!synced ? { filter: 'blur(7px)', userSelect: 'none' } : null}>
              <QuotaBar used={quotaUsed} total={quotaTotal} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div className="wp-label" style={{ color: 'var(--fg-muted)' }}>Remaining</div>
                <div style={{ font: 'var(--fw-semibold) 18px/1.2 var(--font-sans)', marginTop: 5,
                  ...(!synced ? { filter: 'blur(7px)', userSelect: 'none' } : null) }}>{(quotaTotal - quotaUsed).toLocaleString()}</div>
              </div>
              <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--border)', margin: '0 20px' }} />
              <div style={{ flex: 1 }}>
                <div className="wp-label" style={{ color: 'var(--fg-muted)' }}>Resets on</div>
                <div style={{ font: 'var(--fw-semibold) 18px/1.2 var(--font-sans)', marginTop: 5 }}>{resetDate}</div>
              </div>
            </div>
            <div style={{ font: '12px/1.5 var(--font-sans)', color: 'var(--fg-muted)',
              display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              Quota resets each month. Need more?
              <button className="wp-btn link" style={{ fontSize: 12 }}>Upgrade to Pro</button>
            </div>
          </SectionCard>
        </div>

        {!synced && <LockOverlay onLogin={onLogin} />}
      </div>

      {/* General settings */}
      <div style={wpiPage.sectTitle}>General settings</div>
      <SectionCard pad={false}>
        <div className="wp-panel" style={{ border: 'none', borderRadius: 8 }}>
          <SettingRow title="Auto-optimize images on upload"
          sub="Automatically optimize every image you upload to WordPress.">
            <Toggle on={settings.autoOptimize} onChange={(v) => set('autoOptimize', v)} />
          </SettingRow>
          <SettingRow last title="Backup original images"
          sub="Keep your original images in a separate folder before the optimization process.">
            <Toggle on={settings.backup} onChange={(v) => set('backup', v)} />
          </SettingRow>
        </div>
      </SectionCard>

      {/* Optimization */}
      <div style={wpiPage.sectTitle}>Optimization</div>
      <SectionCard pad={false}>
        <div className="wp-panel" style={{ border: 'none', borderRadius: '8px 8px 0 0' }}>
          <SettingRow title="Compression level"
          sub={COMPRESSION_HINT[t.compression]}>
            <SegControl value={t.compression} options={['Lossy', 'Glossy', 'Lossless']}
            onChange={(v) => setTweak('compression', v)} />
          </SettingRow>
          <SettingRow title="WebP"
          sub="Create WebP versions of your images and serve them automatically to supported browsers.">
            <Toggle on={settings.webp} onChange={(v) => set('webp', v)} />
          </SettingRow>
          <SettingRow last={!settings.resize}
          title={<>Resize larger images<InfoTip text="You can save up to 80% after resizing. The new width should not be less than your largest thumbnail width (currently 2048px). Resizing runs on upload or during optimization." /></>}
          sub="Recommended to reduce larger images.">
            <Toggle on={settings.resize} onChange={(v) => set('resize', v)} />
          </SettingRow>
          {settings.resize &&
          <div className="wp-panel-row" style={{ borderBottom: 'none', background: 'var(--surface-subtle)' }}>
              <div className="meta"><span className="ttl">Maximum width</span>
                <span className="sub">Images wider than this are scaled down on optimization.</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
                <input className="wp-input" type="number" value={settings.resizeW}
              onChange={(e) => set('resizeW', e.target.value)} style={{ width: 96, textAlign: 'right' }} />
                <span style={{ font: '13px/1 var(--font-sans)', color: 'var(--fg-muted)' }}>px</span>
              </div>
            </div>
          }
        </div>
        <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
          <div style={{ font: 'var(--fw-medium) 13px/1.4 var(--font-sans)', marginBottom: 3 }}>Files optimization</div>
          <div style={{ font: '12px/1.5 var(--font-sans)', color: 'var(--fg-muted)', marginBottom: 14, maxWidth: 640 }}>
            Choose which image sizes created by WordPress should be optimized. Optimizing more sizes saves more space but uses more of your monthly quota.
          </div>
          <FilesOptimization selected={settings.sizes} toggle={toggleSize} />
        </div>
      </SectionCard>

      <div style={wpiPage.saveBar}>
        <span style={{ font: '12px/1.4 var(--font-sans)', color: 'var(--fg-muted)', marginRight: 'auto' }}>
          Compression level: <b style={{ color: 'var(--fg)' }}>{t.compression}</b>
        </span>
        <button className="wp-btn tertiary">Reset</button>
        <button className="wp-btn primary" onClick={save} disabled={saving}>
          {saving && <span className="wp-spinner" style={{ borderTopColor: '#fff', borderColor: 'rgba(255,255,255,.4)' }}></span>}
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>);

}

/* ============================================================
   Plugin shell (header + state) + Tweaks
   ============================================================ */
function PluginShell() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [synced, setSynced] = React.useState(t.account === 'in');
  const [syncing, setSyncing] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  React.useEffect(() => {setSynced(t.account === 'in');}, [t.account]);

  const fireToast = (msg) => {setToast(msg);clearTimeout(window.__wpiT);window.__wpiT = setTimeout(() => setToast(null), 2800);};
  const onLogin = () => {
    setSyncing(true);
    setTimeout(() => {setSyncing(false);setSynced(true);setTweak('account', 'in');fireToast('Account synced. API key retrieved.');}, 1100);
  };
  const onDisconnect = () => {setSynced(false);setTweak('account', 'out');fireToast('Account disconnected.');};

  return (
    <div>
      <div style={wpiPage.header}>
        <div style={wpiPage.brand}>
          <img src="assets/logo-mark.png" alt="" style={{ width: 36, height: 36, flex: 'none' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
              WPImage
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-muted)' }}>v2.4.1</span>
            </div>
            <div style={{ font: '12px/1.4 var(--font-sans)', color: 'var(--fg-muted)', marginTop: 1 }}>Image compression for WordPress</div>
          </div>
          <span className={'wp-badge ' + (synced ? 'green' : 'gray')}>{synced ? 'Connected' : 'Free'}</span>
          <button className="wp-btn secondary sm" style={{ flex: 'none' }}><Ic name="lifesaver" cls="sm" />Support</button>
        </div>
      </div>

      <DashboardPage t={t} setTweak={setTweak} synced={synced} syncing={syncing}
      onLogin={onLogin} onDisconnect={onDisconnect} fireToast={fireToast} />

      {toast && <div style={{ position: 'fixed', left: 176, bottom: 20, zIndex: 70 }}><div className="wp-snackbar">{toast}</div></div>}

      <TweaksPanel>
        <TweakSection label="Layout" />
        <TweakRadio label="Header style" value={t.headerStyle}
        options={[{ label: 'Clean', value: 'clean' }, { label: 'Brand hero', value: 'hero' }]}
        onChange={(v) => setTweak('headerStyle', v)} />
        <TweakSection label="Account" />
        <TweakRadio label="State" value={t.account}
        options={[{ label: 'Logged out', value: 'out' }, { label: 'Logged in', value: 'in' }]}
        onChange={(v) => setTweak('account', v)} />
        <TweakSection label="Compression" />
        <TweakRadio label="Quality" value={t.compression}
        options={['Lossy', 'Glossy', 'Lossless']}
        onChange={(v) => setTweak('compression', v)} />
      </TweaksPanel>
    </div>);

}

function App() {return <AdminChrome><PluginShell /></AdminChrome>;}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);