// cross-sell.jsx — "About us" page: NinjaTeam intro + cross-sell of other
// NinjaTeam plugins. Uses native WordPress .button classes for actions; icon
// tiles from the WP glyph set. Two layouts: compact list & WP-style cards.

/* ---------------- Star rating ---------------- */
function Stars({ rating, count, size = 18 }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:7 }}>
      <span style={{ display:'inline-flex' }}>
        {[0,1,2,3,4].map(i => {
          const fill = Math.max(0, Math.min(1, rating - i));
          return (
            <span key={i} style={{ position:'relative', width:size, height:size, display:'inline-block', flex:'none', margin:'0 -2px' }}>
              <span style={{ position:'absolute', inset:0, color:'var(--gray-300)' }}>
                <Ic name="star-filled" style={{ width:'100%', height:'100%', display:'block' }} /></span>
              <span style={{ position:'absolute', inset:0, overflow:'hidden', width:(fill*100)+'%', color:'#f0a000' }}>
                <Ic name="star-filled" style={{ width:size, height:size, display:'block' }} /></span>
            </span>
          );
        })}
      </span>
      {count != null && <span style={{ font:'13px/1 var(--font-sans)', color:'var(--fg-muted)' }}>({count.toLocaleString()})</span>}
    </span>
  );
}

/* ---------------- Plugin catalog (real NinjaTeam plugins) ---------------- */
const NT_PLUGINS = [
  { id:'filebird',   name:'FileBird – WordPress Media Library Folders & File Manager', glyph:'layout',     tint:'#3858e9', rating:4.5, reviews:1114, installs:'200,000+', updated:'1 week ago',  cats:['featured','management'],
    desc:'Organize thousands of WordPress media files in folders and categories with ease.' },
  { id:'filester',   name:'Filester – File Manager Pro', glyph:'tool', tint:'#f0b849', rating:5.0, reviews:148, installs:'100,000+', updated:'1 week ago', cats:['featured','management'],
    desc:'Best WordPress file manager without FTP access. Edit code, upload files, and manage your wp directory.' },
  { id:'chatapp',    name:'WP Chat App', glyph:'connection', tint:'#4ab866', rating:5.0, reviews:216, installs:'100,000+', updated:'1 week ago', cats:['featured','marketing','woocommerce'],
    desc:'Integrate the WhatsApp experience directly into your WordPress website.' },
  { id:'click2chat', name:'WP Click to Chat – Email, Live Chat, Call & Book Now', glyph:'people', tint:'#7a00df', rating:5.0, reviews:7, installs:'1,000+', updated:'2 weeks ago', cats:['marketing','woocommerce'],
    desc:'Offer unlimited chat apps and support channels to your WordPress website.' },
  { id:'duplicate',  name:'WP Duplicate Page', glyph:'copy', tint:'#3858e9', rating:4.5, reviews:14, installs:'60,000+', updated:'1 week ago', cats:['management'], status:'activated',
    desc:'Clone any WordPress page, post, or custom post type in a single click.' },
  { id:'multistep',  name:'Multi Step for Contact Form 7', glyph:'widget', tint:'#e2293b', rating:4.5, reviews:76, installs:'10,000+', updated:'2 weeks ago', cats:['marketing','woocommerce'],
    desc:'Break your long forms into user-friendly, multi-step experiences.' },
  { id:'notibar',    name:'Notibar – Notification Bar for WordPress', glyph:'megaphone', tint:'#1f9e8a', rating:5.0, reviews:66, installs:'8,000+', updated:'20 hours ago', cats:['featured','marketing','woocommerce'],
    desc:'Multiple notification bars with a live-preview customizer, smart scheduling, and display rules.' },
  { id:'doclib',     name:'FileBird Document Library', glyph:'page', tint:'#3858e9', rating:5.0, reviews:7, installs:'5,000+', updated:'5 days ago', cats:['management'],
    desc:'Create a WordPress document library using FileBird, Gutenberg, or any page builder.' },
  { id:'cf7db',      name:'Database for Contact Form 7', glyph:'backup', tint:'#e2293b', rating:4.0, reviews:14, installs:'7,000+', updated:'2 weeks ago', cats:['management','marketing'],
    desc:'Automatically save all data submitted via Contact Form 7 to your database.' },
  { id:'fastdup',    name:'FastDup – Fastest WordPress Migration & Duplicator', glyph:'update', tint:'#2563eb', rating:4.5, reviews:26, installs:'5,000+', updated:'2 weeks ago', cats:['management'],
    desc:'The fastest WordPress migration and site duplicator — move sites in minutes.' },
  { id:'headerfoot', name:'NinjaTeam Header Footer Custom Code', glyph:'styles', tint:'#9333ea', rating:3.5, reviews:2, installs:'200+', updated:'2 weeks ago', cats:['management'],
    desc:'Easily insert custom CSS and JavaScript into your header or before the body tag.' },
  { id:'gdpr',       name:'GDPR CCPA Compliance & Cookie Consent Banner', glyph:'shield', tint:'#1e3a8a', rating:5.0, reviews:12, installs:'1,000+', updated:'1 week ago', cats:['management'],
    desc:'GDPR and CCPA compliance with a fully customizable cookie consent banner.' },
];

const NT_CATS = [
  { id:'featured',    label:'Featured' },
  { id:'woocommerce', label:'WooCommerce' },
  { id:'management',  label:'Management' },
  { id:'marketing',   label:'Marketing' },
  { id:'all',         label:'All plugins' },
];

function shortName(name) { return name.split(' – ')[0].split(' —')[0]; }

/* ---------------- Install button (shared, native .button) ---------------- */
function InstallBtn({ state, onInstall, id, now, big }) {
  const sz = big ? '' : ' button-small';
  if (state === 'activated')
    return <button className={'button' + sz} disabled style={{ color:'var(--fg-muted)' }}><Ic name="check" cls="xs" />Activated</button>;
  if (state === 'installing')
    return <button className={'button' + sz} disabled style={{ display:'inline-flex', alignItems:'center', gap:6, cursor:'default' }}><span className="components-spinner" style={{ width:14, height:14 }} />Installing…</button>;
  return <button className={'button' + sz} onClick={()=>onInstall(id)}><Ic name="cloud-download" cls="xs" />{now ? 'Install Now' : 'Install'}</button>;
}

/* ---------------- Compact list row ---------------- */
function PluginRow({ p, state, onInstall, last }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'18px 0', borderBottom: last ? 'none' : '1px solid var(--border)' }}>
      <span style={{ width:46, height:46, borderRadius:10, flex:'none', display:'flex', alignItems:'center', justifyContent:'center', background: p.tint + '18', color: p.tint }}>
        <Ic name={p.glyph} /></span>
      <div style={{ flex:1, minWidth:0 }}>
        <a href="#" onClick={e=>e.preventDefault()} style={{ font:'var(--fw-semibold) 14px/1.35 var(--font-sans)', color:'var(--wp-admin-theme)', textDecoration:'none', display:'block' }}>{p.name}</a>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
          <Stars rating={p.rating} count={p.reviews} />
          <span style={{ font:'12px/1 var(--font-sans)', color:'var(--fg-muted)' }}>· {p.installs} active installs</span>
        </div>
      </div>
      <div style={{ flex:'none', alignSelf:'center' }}><InstallBtn state={state} onInstall={onInstall} id={p.id} /></div>
    </div>
  );
}

/* ---------------- WP-style card (native .plugin-card replica) ---------------- */
function PluginCard({ p, state, onInstall }) {
  return (
    <div style={{ position:'relative', display:'flex', flexDirection:'column',
      background:'#fff', border:'1px solid var(--border)' }}>
      <div style={{ position:'relative', padding:'20px 20px 12px 96px', flex:1, overflow:'hidden' }}>
        <span style={{ position:'absolute', top:20, left:20, width:64, height:64, borderRadius:6,
          display:'flex', alignItems:'center', justifyContent:'center', background: p.tint + '18', color: p.tint }}>
          <Ic name={p.glyph} style={{ width:32, height:32, display:'block' }} /></span>

        <div style={{ float:'right', marginLeft:14, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
          <InstallBtn state={state} onInstall={onInstall} id={p.id} now big />
          <a href="#" onClick={e=>e.preventDefault()} style={{ font:'13px/1 var(--font-sans)', color:'var(--wp-admin-theme)', textDecoration:'none' }}>More Details</a>
        </div>

        <h3 style={{ margin:'0 0 8px' , font:'var(--fw-semibold) 15px/1.35 var(--font-sans)' }}>
          <a href="#" onClick={e=>e.preventDefault()} style={{ color:'var(--wp-admin-theme)', textDecoration:'none' }}>{p.name}</a>
        </h3>
        <p style={{ font:'13px/1.55 var(--font-sans)', color:'var(--fg)', margin:'0 0 10px' }}>{p.desc}</p>
        <div style={{ font:'13px/1 var(--font-sans)', color:'var(--fg-muted)', clear:'both' }}>
          By <a href="#" onClick={e=>e.preventDefault()} style={{ color:'var(--wp-admin-theme)', fontStyle:'italic', textDecoration:'none' }}>Ninja Team</a></div>
      </div>

      <div style={{ borderTop:'1px solid var(--border)', background:'var(--surface-subtle)', padding:'12px 20px',
        display:'flex', flexDirection:'column', gap:9 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
          <Stars rating={p.rating} count={p.reviews} />
          <span style={{ font:'13px/1.4 var(--font-sans)', color:'var(--fg-muted)', flex:'none', textAlign:'right' }}>
            <b style={{ color:'var(--fg)', fontWeight:600 }}>Last Updated:</b> {p.updated}</span>
        </div>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
          <span style={{ font:'13px/1.4 var(--font-sans)', color:'var(--fg-muted)', flex:'none', whiteSpace:'nowrap' }}>{p.installs} Active Installations</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Image placeholder (drop real photos in later) ---------------- */
function PhotoSlot({ label, src, style }) {
  if (src) {
    return <img src={src} alt={label}
      style={{ display:'block', width:'100%', height:'100%', objectFit:'cover', ...style }} />;
  }
  return (
    <div style={{
      position:'relative', width:'100%', height:'100%', overflow:'hidden',
      background:'var(--surface-muted)',
      backgroundImage:'repeating-linear-gradient(135deg, transparent 0 11px, rgba(120,120,120,.05) 11px 22px)',
      border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center',
      ...style }}>
      <span className="t-mono" style={{
        fontSize:11, color:'var(--fg-muted)', letterSpacing:'.01em', padding:'2px 8px',
        background:'rgba(255,255,255,.66)', borderRadius:3, textAlign:'center' }}>{label}</span>
    </div>
  );
}

/* ---------------- About Us section ---------------- */
const NT_STATS = [
  { num:'12+',   label:'WordPress plugins' },
  { num:'600K+', label:'Active installations' },
  { num:'2014',  label:'Building since' },
];

function AboutSection() {
  return (
    <div className="components-card" style={{ marginBottom:24, overflow:'hidden' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:0, alignItems:'stretch' }} className="wpi-crosssell-split">
        {/* Text column */}
        <div style={{ padding:'32px 36px' }}>
          <div style={{ font:'var(--fw-semibold) 12px/1 var(--font-sans)', textTransform:'uppercase',
            letterSpacing:'.08em', color:'var(--wp-admin-theme)', marginBottom:14 }}>About us</div>
          <h2 style={{ font:'var(--fw-semibold) 22px/1.2 var(--font-sans)', letterSpacing:'-0.01em', margin:0, color:'var(--fg)' }}>
            We build WordPress tools people love</h2>
          <p style={{ font:'14px/1.65 var(--font-sans)', color:'var(--fg-muted)', margin:'14px 0 0', maxWidth:480 }}>
            NinjaTeam is a small, focused product studio making plugins that solve everyday WordPress
            problems — from media management to lead capture. Our work powers hundreds of thousands of
            sites worldwide, and every plugin is built with the same care you'd give your own.</p>
          <p style={{ font:'14px/1.65 var(--font-sans)', color:'var(--fg-muted)', margin:'12px 0 0', maxWidth:480 }}>
            We're proud of our long-term support, transparent pricing, and a community that grows with us.</p>

          <div style={{ display:'flex', gap:36, marginTop:26 }}>
            {NT_STATS.map(s => (
              <div key={s.label}>
                <div style={{ font:'700 24px/1 var(--font-sans)', letterSpacing:'-0.02em', color:'var(--fg)' }}>{s.num}</div>
                <div style={{ font:'12px/1.4 var(--font-sans)', color:'var(--fg-muted)', marginTop:6 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:16, marginTop:28 }}>
            {/* avatar stack — swap each background image for a real customer photo */}
            <div style={{ display:'flex', alignItems:'center' }}>
              {[0,1,2,3].map(i => (
                <span key={i} style={{
                  width:42, height:42, borderRadius:'9999px', flex:'none',
                  marginLeft: i === 0 ? 0 : -12, border:'2px solid #fff', overflow:'hidden',
                  background:'var(--surface-muted)',
                  backgroundImage:'repeating-linear-gradient(135deg, transparent 0 7px, rgba(120,120,120,.08) 7px 14px)',
                  boxShadow:'var(--elevation-x-small)', position:'relative', zIndex:4 - i }} />
              ))}
            </div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <Stars rating={5} size={18} />
                <span style={{ font:'700 16px/1 var(--font-sans)', color:'var(--fg)' }}>5.0</span>
              </div>
              <div style={{ font:'13px/1.4 var(--font-sans)', color:'var(--fg-muted)', marginTop:7 }}>
                Trusted by WordPress experts.</div>
            </div>
          </div>
        </div>

        {/* Image column — replace these placeholders with real company photos */}
        <div className="wpi-crosssell-photos" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:8, padding:8, minHeight:340, background:'var(--surface-subtle)' }}>
          <div style={{ gridRow:'1 / span 2', borderRadius:8, overflow:'hidden' }}>
            <PhotoSlot label="office photo · 600×900" /></div>
          <div style={{ borderRadius:8, overflow:'hidden' }}>
            <PhotoSlot label="team · 600×450" /></div>
          <div style={{ borderRadius:8, overflow:'hidden' }}>
            <PhotoSlot label="workspace · 600×450" /></div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- About us / More plugins page ---------------- */
function PluginsPage({ fireToast, layout = 'list', about = true }) {
  const [cat, setCat] = React.useState('featured');
  const [states, setStates] = React.useState(() => {
    const s = {}; NT_PLUGINS.forEach(p => { if (p.status) s[p.id] = p.status; }); return s;
  });
  const onInstall = (id) => {
    setStates(s => ({ ...s, [id]:'installing' }));
    setTimeout(() => {
      setStates(s => ({ ...s, [id]:'activated' }));
      fireToast(`${shortName(NT_PLUGINS.find(p => p.id === id).name)} installed and activated.`);
    }, 2000);
  };
  const list = NT_PLUGINS.filter(p => cat === 'all' || p.cats.includes(cat));
  const cards = layout === 'cards';

  const head = (
    <React.Fragment>
      <h2 style={{ font:'var(--fw-semibold) 22px/1.2 var(--font-sans)', letterSpacing:'-0.01em', margin:0, color:'var(--fg)' }}>
        More plugins by NinjaTeam</h2>
      <p style={{ font:'14px/1.6 var(--font-sans)', color:'var(--fg-muted)', margin:'8px 0 0', maxWidth:680 }}>
        Get more out of WordPress with other plugins from the NinjaTeam family — trusted by millions of sites to manage media, capture leads, and grow.</p>
      <div className="components-tab-panel__tabs" style={{ marginTop:20 }}>
        {NT_CATS.map(c => (
          <div key={c.id} className={'components-tab-panel__tabs-item' + (cat===c.id ? ' active' : '')} onClick={()=>setCat(c.id)}>{c.label}</div>
        ))}
      </div>
    </React.Fragment>
  );

  if (cards) {
    return (
      <div className="wpi-page" style={{ padding:'28px 32px 64px', maxWidth:1080, margin:'0 auto' }}>
        {about && <AboutSection />}
        <div style={{ marginBottom:20 }}>{head}</div>
        <div className="wpi-plugin-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {list.map(p => <PluginCard key={p.id} p={p} state={states[p.id]} onInstall={onInstall} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="wpi-page" style={{ padding:'28px 32px 64px', maxWidth:1080, margin:'0 auto' }}>
      {about && <AboutSection />}
      <div className="components-card">
        <div style={{ padding:'24px 28px 0' }}>{head}</div>
        <div className="wpi-plugin-rows" style={{ padding:'4px 28px 20px', display:'grid', gridTemplateColumns:'1fr 1fr', columnGap:40, rowGap:0 }}>
          {list.map((p, i) => <PluginRow key={p.id} p={p} state={states[p.id]} onInstall={onInstall}
            last={Math.floor(i/2) === Math.floor((list.length-1)/2)} />)}
        </div>
        <div style={{ padding:'16px 28px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <span style={{ font:'13px/1.4 var(--font-sans)', color:'var(--fg-muted)' }}>All plugins are free on WordPress.org. Pro versions available for select plugins.</span>
          <button className="button-link" style={{ fontSize:13 }}>Browse all NinjaTeam plugins<Ic name="external" cls="xs" /></button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PluginsPage });
