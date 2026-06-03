// auth-modal.jsx — WPImage Login / Sign up modal.
// Built on genuine WordPress core component markup:
//   .components-modal__screen-overlay / __frame / __header / __content  (Modal)
//   .components-button.is-secondary                                     (social buttons)
//   .components-base-control + .components-text-control__input          (TextControl)
//   .components-checkbox-control                                        (CheckboxControl)
//   .button.button-primary                                             (primary submit)
// Only brand glyphs + a couple of layout helpers are custom CSS.
// Load AFTER React/Babel and BEFORE app.jsx. Uses window.Ic + window.WPImageMark.

/* ---- brand marks for social login ---- */
function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" style={{ display:'block', flex:'none' }}>
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.05l3.01-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}

/* ---- Auth modal (login + signup) ---- */
function LoginModal({ open, mode = 'login', markVariant = 'blue', onClose, onLogin }) {
  const Ic = window.Ic;
  const WPImageMark = window.WPImageMark;
  const [view, setView] = React.useState(mode);
  React.useEffect(() => { if (open) setView(mode); }, [open, mode]);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;

  const isSignup = view === 'signup';
  const submit = (e) => { e.preventDefault(); onLogin(); };
  const copy = isSignup
    ? { title: 'Create your account', sub: 'Start optimizing in minutes. No credit card required.',
        social: 'Sign up with', submit: 'Create free account',
        footPrompt: 'Already have an account?', footLink: 'Log in', footTo: 'login' }
    : { title: 'Log in to WPImage', sub: 'Manage your plan, quota, and optimizations.',
        social: 'Continue with', submit: 'Log in',
        footPrompt: "Don't have an account?", footLink: 'Sign up free', footTo: 'signup' };

  return (
    <div className="components-modal__screen-overlay" onMouseDown={onClose}>
      <div className="components-modal__frame wpi-auth-frame" role="dialog" aria-modal="true"
        aria-label={copy.title} onMouseDown={(e) => e.stopPropagation()}>
        <button type="button" className="components-button components-modal__icon-button"
          onClick={onClose} aria-label="Close"><Ic name="close" /></button>
        <div className="components-modal__content wpi-auth-content">
          <div className="wpi-auth-head">
            {WPImageMark ? <WPImageMark size={44} variant={markVariant} /> : null}
            <h1 className="components-modal__header-heading">{copy.title}</h1>
            <p>{copy.sub}</p>
          </div>

          <div className="wpi-auth-social">
            <button type="button" className="components-button is-secondary" onClick={onLogin}>
              <GoogleG /><span>{copy.social + ' Google'}</span></button>
          </div>

          <div className="wpi-auth-divider"><span>or</span></div>

          <form className="wpi-auth-form" onSubmit={submit}>
            {isSignup && (
              <div className="components-base-control">
                <label className="components-base-control__label" htmlFor="wpi-auth-name">Full name</label>
                <input id="wpi-auth-name" type="text" className="components-text-control__input" placeholder="Your full name" />
              </div>
            )}
            <div className="components-base-control">
              <label className="components-base-control__label" htmlFor="wpi-auth-email">Email</label>
              <input id="wpi-auth-email" type="email" className="components-text-control__input"
                placeholder="you@yoursite.com" />
            </div>
            <div className="components-base-control">
              <label className="components-base-control__label" htmlFor="wpi-auth-pass">Password</label>
              <input id="wpi-auth-pass" type="password" className="components-text-control__input" placeholder="••••••••" />
            </div>
            {!isSignup && (
              <div style={{ textAlign:'right' }}>
                <a href="#" onClick={(e) => e.preventDefault()} style={{ font:'13px/1 var(--font-sans)', color:'var(--wp-admin-theme)', textDecoration:'none' }}>Forgot password?</a>
              </div>
            )}
            <button type="submit" className="button button-primary wpi-auth-submit">{copy.submit}</button>
          </form>

          <p className="wpi-auth-foot">{copy.footPrompt}{' '}
            <button type="button" className="components-button is-link"
              onClick={() => setView(copy.footTo)}>{copy.footLink}</button>
          </p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LoginModal, GoogleG });
