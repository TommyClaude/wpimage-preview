=== WPImage ===
Contributors: ninjateam
Tags: image optimization, compress images, webp, performance, media
Requires at least: 6.0
Tested up to: 6.5
Requires PHP: 7.2
Stable tag: 2.8.7
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Smaller images, faster site. WPImage compresses every image you upload — automatically, with no visible quality loss.

== Description ==

WPImage is an image-compression plugin for WordPress. It optimizes images on
upload, converts them to next-gen WebP, and can bulk-optimize your whole media
library.

Features:

* Automatic optimization on every upload
* Next-gen WebP conversion served to supported browsers
* Bulk-optimize the existing media library
* Lossy / Glossy / Lossless compression levels
* Optional backup of original images
* Resize oversized images on upload
* Free plan: 200 image optimizations every 30 days

The admin interface is built on the WordPress (Gutenberg) component system and
reuses the styles WordPress core already loads in wp-admin — so the plugin ships
only its own WPImage-specific visual layer.

== Installation ==

1. Upload the `wpimage` folder to the `/wp-content/plugins/` directory, or
   install the .zip via Plugins → Add New → Upload Plugin.
2. Activate the plugin through the "Plugins" menu in WordPress.
3. Open the new "WPImage" item in the admin menu.

== Frequently Asked Questions ==

= Does it modify my original images? =

Only if you turn off "Backup original images". With backups enabled, originals
are kept in a separate folder before optimization.

= Is there a free plan? =

Yes — the free plan includes 200 image optimizations every 30 days.

== Changelog ==

= 2.8.7 =
* Header: both utility buttons now use the small button size (matching the
  original), still equal to each other.

= 2.8.6 =
* Header: the "Submit your idea" and "Support" buttons are now exactly the same
  size (height and icon).
* Cleanup: removed dead code to lighten the plugin — trimmed the icon library to
  only the glyphs in use (icons.js ~42KB → ~24KB) and removed an unused social
  login mark.

= 2.8.5 =
* Loading skeleton: simplified the banner to a plain block (no inner lines), and
  the two bottom cards are now balanced and equal-height to match the real
  layout. Header kebab menu items align evenly.

= 2.8.4 =
* Loading skeleton hero now mirrors the real banner's structure and height (and
  stacks the same way on mobile), eliminating the layout jump on load.
* Fixed alignment of items in the header kebab dropdown menu.

= 2.8.3 =
* Header: on mobile the two utility buttons now collapse into a 3-dot (kebab)
  menu instead of stacking, for a cleaner header.
* Loading skeleton header height now matches the real header so there is no
  layout nudge when the app finishes loading.

= 2.8.2 =
* Header: "Submit your idea" now uses the minimal (text) button style; on mobile
  the two header buttons stack into a single full-width column and the title no
  longer gets squeezed.

= 2.8.1 =
* Loading skeleton now also includes the header (logo, title, buttons, tabs) so
  the layout no longer jumps when the app finishes loading.

= 2.8.0 =
* New: a polished loading skeleton (hero + stat cards + panels with a shimmer)
  now shows while the admin app loads, replacing the small spinner.

= 2.7.7 =
* Auth modal: the Google button text no longer turns blue on hover (WordPress
  core secondary-button hover color is now overridden to stay dark).

= 2.7.6 =
* Fixed a large empty gap at the top of the login modal on live WordPress sites,
  caused by the WordPress core modal reserving header space we don't use.

= 2.7.5 =
* Auth modal: the Google button now shows a pointer cursor on hover.

= 2.7.4 =
* Auth modal: the Google button no longer darkens its border on hover (keeps the
  same neutral outline, only a faint background tint).

= 2.7.3 =
* Auth modal: the Google button border now matches the Email/Password input
  border color (heavier neutral outline).

= 2.7.2 =
* Auth modal: Google button border restored to the medium neutral outline (no
  longer too faint), and the "Log in" submit button is now taller (48px).

= 2.7.1 =
* Fixed the Google button showing a dark native browser border; it now uses only
  the light neutral outline.

= 2.7.0 =
* Responsive: the admin screen now reflows for tablet and mobile widths — the
  hero stacks, stat/quota/add-on grids collapse to fewer columns, the tab bar
  scrolls horizontally, and the account CTA + header buttons wrap cleanly.

= 2.6.2 =
* Auth modal: lightened the Google button border to match the WordPress neutral
  outline button.

= 2.6.1 =
* Auth modal: social login is now a single Google button with a lighter neutral
  outline (removed the GitHub option).

= 2.6.0 =
* New: Login / Sign up modal (WordPress core Modal, Button, TextControl and
  CheckboxControl markup) with Google / GitHub social options. "Login to sync
  account" now opens the modal; submitting it syncs the account.

= 2.5.5 =
* Primary button loading (isBusy) stripe now renders reliably during processing
  by using aria-disabled instead of the native disabled attribute, so the
  WordPress core busy stripe is never dulled by core's disabled styling.

= 2.5.4 =
* Toggle focus ring now appears on click as well as keyboard focus (matches
  WordPress 7 core).

= 2.5.3 =
* Added the WordPress 7 core focus ring to toggles (white gap + theme outline)
  for keyboard accessibility.
* Buttons now use the WordPress 7 default 36px height for a larger, consistent
  hit target.
* The account Copy / Disconnect buttons now use the minimal (tertiary) text style.

= 2.5.2 =
* Fixed the primary button "busy" stripe not showing while a button was disabled
  during processing; the animated stripe is now clearly visible.

= 2.5.1 =
* Processing buttons now use the WordPress core Button "busy" state (animated
  diagonal stripe) instead of a spinner.

= 2.5.0 =
* Controls now use genuine WordPress core components: ToggleGroupControl
  (compression level), CheckboxControl, Spinner, Card, TabPanel and Snackbar.
* Reset action restyled as a tertiary (minimal) button.

= 2.4.2 =
* Badge now matches the WordPress core Badge default (removed extra border).

= 2.4.1 =
* Admin dashboard, settings, and About us pages rebuilt on the WordPress
  component system.
