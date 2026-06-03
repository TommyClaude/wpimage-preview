// components.jsx — shared UI for the WPImage admin app (forked from the
// NinjaTeam WordPress plugin admin UI kit). Buttons use native WordPress
// core classes (.button / .button-primary / .button-link); only the
// WPImage-specific composites are styled here. Style objects are uniquely
// named to avoid global collisions across babel scripts.

/* ---------------- Icon (inline WP SVG via icons.js) ---------------- */
function Ic({ name, cls = '', style }) {
  const inner = (window.NTIcons && window.NTIcons.paths[name]) || '';
  return (
    <i className={'nt-ic ' + cls} style={style}
       dangerouslySetInnerHTML={{ __html:
         `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" style="display:block">${inner}</svg>` }} />
  );
}

/* ---------------- Toggle (WordPress core FormToggle) ---------------- */
// Renders the genuine @wordpress/components FormToggle markup. Styling comes
// from WordPress core's `wp-components` stylesheet (enqueued in wpimage.php),
// so this matches the user's WordPress version exactly.
function Toggle({ on, onChange, disabled }) {
  return (
    <span className={'components-form-toggle' + (on ? ' is-checked' : '') + (disabled ? ' is-disabled' : '')}>
      <input className="components-form-toggle__input" type="checkbox" checked={on} disabled={disabled}
        aria-checked={on} onChange={() => !disabled && onChange(!on)} />
      <span className="components-form-toggle__track"></span>
      <span className="components-form-toggle__thumb"></span>
    </span>
  );
}

/* ---------------- Section card (titled panel) ---------------- */
function SectionCard({ title, sub, icon, action, children, pad = true, style, bodyStyle }) {
  return (
    <div className="components-card" style={{ marginBottom:20, ...style }}>
      {title && (
        <div className="components-card__header">
          <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
            {icon && <span style={{ color:'var(--fg-muted)', display:'flex' }}><Ic name={icon} cls="sm" /></span>}
            <div style={{ minWidth:0 }}>
              <h3>{title}</h3>
              {sub && <div style={{ font:'12px/1.4 var(--font-sans)', color:'var(--fg-muted)', marginTop:2 }}>{sub}</div>}
            </div>
          </div>
          {action}
        </div>
      )}
      <div style={{ padding: pad ? 16 : 0, ...bodyStyle }}>{children}</div>
    </div>
  );
}

/* ---------------- Setting row (toggle / control on the right) ---------------- */
function SettingRow({ title, sub, children, last }) {
  return (
    <div className="wp-panel-row" style={last ? { borderBottom:'none' } : null}>
      <div className="meta" style={{ maxWidth:560 }}>
        <span className="ttl">{title}</span>
        {sub && <span className="sub" style={{ lineHeight:1.5 }}>{sub}</span>}
      </div>
      <div style={{ flex:'none' }}>{children}</div>
    </div>
  );
}

/* ---------------- Stat card (with lock overlay when not synced) ---------------- */
const wpiStat = {
  card: { position:'relative', background:'#fff', border:'1px solid var(--border)', borderRadius:8,
          padding:'16px 18px', boxShadow:'var(--elevation-x-small)', overflow:'hidden' },
  top:  { display:'flex', alignItems:'center', justifyContent:'space-between' },
  ic:   { width:34, height:34, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', flex:'none' },
};
function StatCard({ icon, tint, label, value, sub, locked }) {
  return (
    <div style={wpiStat.card}>
      <div style={wpiStat.top}>
        <span className="wp-label" style={{ color:'var(--fg-muted)' }}>{label}</span>
        <span style={{ ...wpiStat.ic, background: tint + '18', color: tint }}><Ic name={icon} cls="sm" /></span>
      </div>
      {locked ? (
        <React.Fragment>
          <div style={{ height:26, width:'58%', borderRadius:4, background:'var(--gray-200)', marginTop:14 }} />
          <div style={{ height:10, width:'34%', borderRadius:4, background:'var(--gray-200)', marginTop:9, opacity:.7 }} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div style={{ fontSize:32, fontWeight:600, letterSpacing:'-0.02em', marginTop:10, color:'var(--fg)' }}>
            {value}
          </div>
          <div style={{ fontSize:12, color:'var(--fg-muted)', marginTop:8, fontWeight:500 }}>{sub}</div>
        </React.Fragment>
      )}
    </div>
  );
}

/* ---------------- Quota progress bar ---------------- */
function QuotaBar({ used, total }) {
  const pct = Math.min(100, Math.round((used / total) * 100));
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6 }}>
        <span style={{ font:'var(--fw-medium) 13px/1 var(--font-sans)' }}>{used.toLocaleString()} <span style={{ color:'var(--fg-muted)', fontWeight:400 }}>/ {total.toLocaleString()} optimizations</span></span>
        <span style={{ font:'var(--fw-medium) 12px/1 var(--font-sans)', color: pct > 85 ? 'var(--alert-red)' : 'var(--fg-muted)' }}>{pct}%</span>
      </div>
      <div style={{ height:6, borderRadius:9999, background:'var(--gray-200)', overflow:'hidden' }}>
        <div style={{ height:'100%', width:pct + '%', borderRadius:9999,
          background: pct > 85 ? 'var(--alert-red)' : 'var(--wp-admin-theme)' }} />
      </div>
    </div>
  );
}

/* ---------------- Trend chart (optimizations over time) ---------------- */
// Single baseline only (no floating gridlines — they carried no value labels).
// Hover / tap a column to reveal a tooltip with that day's image count.
function TrendChart({ data, locked }) {
  const [hover, setHover] = React.useState(null);
  const W = 560, H = 132, pad = { l:0, r:0, t:10, b:18 };
  const innerW = W - pad.l - pad.r, innerH = H - pad.t - pad.b;
  const max = Math.max(...data.map(d => d.v));
  const bw = innerW / data.length;
  const baseY = pad.t + innerH;

  // Tooltip geometry for the hovered column (clamped to stay inside the card).
  const act = (!locked && hover != null) ? data[hover] : null;
  let tip = null;
  if (act) {
    const n = data.length;
    const topY = baseY - Math.max(2, (act.v / max) * innerH);
    const cxPct = (pad.l + hover * bw + bw / 2) / W * 100;
    const above = topY > 42;                                  // room to sit above the bar?
    const ty = above ? 'calc(-100% - 8px)' : '8px';
    const horiz = hover <= 2 ? { left: 0 }                    // near left edge → pin left
                : hover >= n - 3 ? { right: 0 }               // near right edge → pin right
                : { left: cxPct + '%' };                      // else centre on the bar
    const tx = (hover <= 2 || hover >= n - 3) ? '' : 'translateX(-50%) ';
    tip = { ...horiz, top: topY, transform: tx + 'translateY(' + ty + ')' };
  }

  return (
    <div style={{ position:'relative', userSelect: locked ? 'none' : 'auto' }} aria-hidden={locked ? 'true' : undefined}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display:'block', overflow:'visible' }}
        onMouseLeave={() => setHover(null)}>
        <line x1={0} x2={W} y1={baseY} y2={baseY} stroke="var(--gray-200)" strokeWidth="1" />
        {data.map((d, i) => {
          const h = Math.max(2, (d.v / max) * innerH);
          const x = pad.l + i * bw + bw * 0.18;
          const w = bw * 0.64;
          const y = baseY - h;
          const on = !locked && hover === i;            // transient hover/tap feedback only
          const fill = locked
            ? 'var(--gray-200)'
            : (on ? 'var(--wp-admin-theme)' : 'rgba(56,88,233,0.32)');
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} rx="1.5" fill={fill} />
              {d.label && !locked && <text x={x + w / 2} y={H - 4} textAnchor="middle"
                fontSize="10" fill="var(--fg-muted)" fontFamily="var(--font-sans)">{d.label}</text>}
              {!locked && <rect x={pad.l + i * bw} y={0} width={bw} height={H} fill="transparent"
                style={{ cursor:'pointer' }} onMouseEnter={() => setHover(i)}
                onTouchStart={() => setHover(i)} />}
            </g>
          );
        })}
      </svg>
      {tip && (
        <div style={{ position:'absolute', ...tip, background:'var(--gray-900)', color:'#fff',
          font:'var(--fw-medium) 12px/1.35 var(--font-sans)', padding:'5px 9px', borderRadius:5,
          whiteSpace:'nowrap', boxShadow:'var(--elevation-medium)', pointerEvents:'none', zIndex:20 }}>
          <span style={{ opacity:.6 }}>{act.today ? 'Today' : act.date}{' · '}</span>
          <strong style={{ fontWeight:600 }}>{act.v.toLocaleString()}</strong> {act.v === 1 ? 'image' : 'images'}
        </div>
      )}
    </div>
  );
}

/* ---------------- ToggleGroupControl (segmented — WordPress core) ---------------- */
function SegControl({ value, options, onChange }) {
  return (
    <div className="components-toggle-group-control" role="radiogroup">
      {options.map(o => {
        const v = typeof o === 'object' ? o.value : o;
        const l = typeof o === 'object' ? o.label : o;
        const active = v === value;
        return (
          <button key={v} type="button" role="radio" aria-checked={active}
            className={'components-toggle-group-control-option' + (active ? ' is-selected' : '')}
            onClick={()=>onChange(v)}>{l}</button>
        );
      })}
    </div>
  );
}

/* ---------------- Info tooltip ((?) icon + hover bubble) ---------------- */
function InfoTip({ text }) {
  const [show, setShow] = React.useState(false);
  return (
    <span style={{ position:'relative', display:'inline-flex', verticalAlign:'middle', marginLeft:5 }}
      onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      <span tabIndex={0} aria-label={text} onFocus={()=>setShow(true)} onBlur={()=>setShow(false)}
        style={{ color:'var(--fg-muted)', cursor:'help', display:'inline-flex', outline:'none' }}>
        <Ic name="help" cls="xs" />
      </span>
      {show && (
        <span role="tooltip" style={{ position:'absolute', top:'calc(100% + 9px)', left:'50%',
          transform:'translateX(-50%)', width:264, background:'var(--gray-900)', color:'#fff',
          font:'var(--fw-regular) 12px/1.55 var(--font-sans)', textTransform:'none', letterSpacing:0,
          padding:'10px 12px', borderRadius:4, boxShadow:'var(--elevation-medium)', zIndex:60 }}>
          {text}
          <span style={{ position:'absolute', bottom:'100%', left:'50%', transform:'translateX(-50%)',
            borderWidth:5, borderStyle:'solid', borderColor:'transparent transparent var(--gray-900) transparent' }} />
        </span>
      )}
    </span>
  );
}

Object.assign(window, { Ic, Toggle, SectionCard, SettingRow, StatCard, QuotaBar, TrendChart, SegControl, InfoTip });
