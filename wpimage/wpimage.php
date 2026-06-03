<?php
/**
 * Plugin Name:       WPImage
 * Plugin URI:        https://ninjateam.org/wpimage
 * Description:       Image compression for WordPress — automatic optimization on every upload, next-gen WebP conversion, and bulk-optimize your whole media library.
 * Version:           2.8.23
 * Requires at least: 6.0
 * Requires PHP:      7.2
 * Author:            NinjaTeam
 * Author URI:        https://ninjateam.org
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wpimage
 *
 * Built on the WordPress (Gutenberg) component system — this plugin relies on
 * the styles WordPress core already loads in wp-admin (.button, form controls,
 * the admin shell). It only ships the WPImage-specific visual layer.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

define( 'WPIMAGE_VERSION', '2.8.23' );
define( 'WPIMAGE_FILE', __FILE__ );
define( 'WPIMAGE_DIR', plugin_dir_path( __FILE__ ) );
define( 'WPIMAGE_URL', plugin_dir_url( __FILE__ ) );

/**
 * SVG used for the admin-menu icon — the WPImage photo glyph (matches the
 * brand mark used in the plugin header).
 *
 * WordPress prints custom menu icons as a CSS background-image on a
 * <div class="wp-menu-image svg"> and does NOT recolor them — so the icon is a
 * transparent, single-color *silhouette* (like WordPress's own dashicons).
 * Every shape carries its own explicit #a7aaad fill (WordPress's inactive
 * menu-icon gray) so the glyph can never collapse to a solid block. The hollow
 * photo frame uses fill-rule evenodd. The active / hover white state is handled
 * in CSS (wpimage_menu_icon_css) by inverting the silhouette to white.
 */
function wpimage_menu_icon() {
	$svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">'
		. '<path fill="#a7aaad" fill-rule="evenodd" d="M5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13A2.5 2.5 0 0 1 5.5 3Zm0 2a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5h-13Z"/>'
		. '<circle fill="#a7aaad" cx="8.6" cy="9" r="1.7"/>'
		. '<path fill="#a7aaad" d="M5.8 17.2 9.4 12.4 11.7 15.1 14.6 11.2 18.4 17.2Z"/>'
		. '</svg>';
	return 'data:image/svg+xml;base64,' . base64_encode( $svg );
}

/**
 * Recolor the menu icon to white when the WPImage item is hovered / current.
 * WordPress prints the icon as a background-image on a <div class="wp-menu-image">,
 * so we can't inherit `color`; instead we invert the gray silhouette to white.
 */
function wpimage_menu_icon_css() {
	echo '<style id="wpimage-menu-icon">'
		. '#adminmenu li.toplevel_page_wpimage div.wp-menu-image{opacity:1;}'
		. '#adminmenu li.toplevel_page_wpimage:hover div.wp-menu-image,'
		. '#adminmenu li.toplevel_page_wpimage.current div.wp-menu-image,'
		. '#adminmenu li.toplevel_page_wpimage.wp-has-current-submenu div.wp-menu-image,'
		. '#adminmenu li.toplevel_page_wpimage.opensub div.wp-menu-image{filter:brightness(0) invert(1);}'
		. '</style>';
}
add_action( 'admin_head', 'wpimage_menu_icon_css' );

/**
 * Register the top-level "WPImage" admin menu page.
 */
function wpimage_register_menu() {
	$hook = add_menu_page(
		__( 'WPImage', 'wpimage' ),       // Page title.
		__( 'WPImage', 'wpimage' ),       // Menu title.
		'manage_options',                 // Capability.
		'wpimage',                        // Menu slug.
		'wpimage_render_page',            // Callback.
		wpimage_menu_icon(),              // Icon (custom WPImage photo glyph).
		81                                // Position (below Settings).
	);

	// Only load our assets on our own screen.
	add_action( "admin_print_scripts-{$hook}", 'wpimage_noop' ); // ensure hook exists
	add_action( 'admin_enqueue_scripts', function ( $screen_hook ) use ( $hook ) {
		if ( $screen_hook === $hook ) {
			wpimage_enqueue_assets();
		}
	} );
}
add_action( 'admin_menu', 'wpimage_register_menu' );

function wpimage_noop() {}

/**
 * Enqueue the WPImage admin app.
 *
 * Styling note: WordPress core already provides button, form-control, card and
 * admin-shell styles, so we do NOT re-ship those. We enqueue only:
 *   - tokens.css        — design tokens (CSS custom properties) + type helpers
 *   - wpimage-admin.css — the WPImage-specific component layer, scoped to .wpimage-app
 *
 * The UI is a React app. React/ReactDOM are loaded from the public CDN and the
 * component files are transpiled in-browser by Babel Standalone (no build step).
 * For a production release you would precompile the JSX and drop Babel.
 */
function wpimage_enqueue_assets() {
	$css = WPIMAGE_URL . 'assets/css/';
	$js  = WPIMAGE_URL . 'assets/js/';

	// --- Styles (only the non-core, WPImage-specific layer) ---
	// `wp-components` is WordPress core's own Gutenberg component stylesheet —
	// we enqueue it so controls like the toggle (ToggleControl / FormToggle) use
	// the genuine WordPress core component instead of a custom reimplementation.
	wp_enqueue_style( 'wp-components' );
	wp_enqueue_style( 'wpimage-tokens', $css . 'tokens.css', array(), WPIMAGE_VERSION );
	wp_enqueue_style( 'wpimage-admin', $css . 'wpimage-admin.css', array( 'wpimage-tokens', 'wp-components' ), WPIMAGE_VERSION );

	// --- React runtime (CDN) ---
	wp_enqueue_script( 'wpimage-react', 'https://unpkg.com/react@18.3.1/umd/react.production.min.js', array(), '18.3.1', true );
	wp_enqueue_script( 'wpimage-react-dom', 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js', array( 'wpimage-react' ), '18.3.1', true );
	wp_enqueue_script( 'wpimage-babel', 'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js', array(), '7.29.0', true );

	// --- Icon injector (plain JS) ---
	wp_enqueue_script( 'wpimage-icons', $js . 'icons.js', array(), WPIMAGE_VERSION, true );

	// --- App component files (transpiled in-browser; see script_loader_tag filter) ---
	wp_enqueue_script( 'wpimage-components', $js . 'components.jsx', array( 'wpimage-react-dom', 'wpimage-babel', 'wpimage-icons' ), WPIMAGE_VERSION, true );
	wp_enqueue_script( 'wpimage-crosssell', $js . 'cross-sell.jsx', array( 'wpimage-components' ), WPIMAGE_VERSION, true );
	wp_enqueue_script( 'wpimage-support', $js . 'support.jsx', array( 'wpimage-components' ), WPIMAGE_VERSION, true );
	wp_enqueue_script( 'wpimage-authmodal', $js . 'auth-modal.jsx', array( 'wpimage-components' ), WPIMAGE_VERSION, true );
	wp_enqueue_script( 'wpimage-app', $js . 'app.jsx', array( 'wpimage-crosssell', 'wpimage-support', 'wpimage-authmodal' ), WPIMAGE_VERSION, true );
}

/**
 * Mark the component handles so they are emitted as <script type="text/babel">.
 */
function wpimage_script_type( $tag, $handle, $src ) {
	$babel_handles = array( 'wpimage-components', 'wpimage-crosssell', 'wpimage-support', 'wpimage-authmodal', 'wpimage-app' );
	if ( in_array( $handle, $babel_handles, true ) ) {
		$tag = '<script type="text/babel" src="' . esc_url( $src ) . '"></script>' . "\n";
	}
	if ( in_array( $handle, array( 'wpimage-react', 'wpimage-react-dom', 'wpimage-babel' ), true ) ) {
		$tag = str_replace( ' src=', ' crossorigin="anonymous" src=', $tag );
	}
	return $tag;
}
add_filter( 'script_loader_tag', 'wpimage_script_type', 10, 3 );

/**
 * Render the admin page shell. The React app mounts into #wpimage-root.
 */
function wpimage_render_page() {
	echo '<div class="wrap wpimage-wrap">';
	echo '<h1 class="screen-reader-text">' . esc_html__( 'WPImage', 'wpimage' ) . '</h1>';
	echo '<div id="wpimage-root" class="wpimage-app">' . wpimage_skeleton_html() . '</div>';
	echo '</div>';
}

/**
 * Loading skeleton markup shown inside #wpimage-root before the React app
 * mounts. Pure HTML/CSS (styled in wpimage-admin.css) so it paints instantly.
 */
function wpimage_skeleton_html() {
	$label = esc_attr__( 'Loading WPImage…', 'wpimage' );
	return '<div class="wpi-skeleton" role="status" aria-live="polite" aria-label="' . $label . '">'
		. '<div class="wpi-sk-header">'
			. '<div class="wpi-sk-headrow">'
				. '<span class="wpi-sk sk-logo"></span>'
				. '<div class="sk-titles"><span class="wpi-sk sk-title"></span><span class="wpi-sk sk-subtitle"></span></div>'
				. '<div class="sk-btns"><span class="wpi-sk sk-btn"></span><span class="wpi-sk sk-btn"></span></div>'
			. '</div>'
			. '<div class="wpi-sk-tabs"><span class="wpi-sk sk-tab"></span><span class="wpi-sk sk-tab"></span><span class="wpi-sk sk-tab"></span></div>'
		. '</div>'
		. '<div class="wpi-sk-body">'
			. '<div class="wpi-sk wpi-sk-hero"></div>'
			. '<div class="wpi-sk-stats">'
				. '<div class="wpi-sk-stat"><span class="wpi-sk sk-ico"></span><span class="wpi-sk sk-num"></span><span class="wpi-sk sk-sub"></span></div>'
				. '<div class="wpi-sk-stat"><span class="wpi-sk sk-ico"></span><span class="wpi-sk sk-num"></span><span class="wpi-sk sk-sub"></span></div>'
				. '<div class="wpi-sk-stat"><span class="wpi-sk sk-ico"></span><span class="wpi-sk sk-num"></span><span class="wpi-sk sk-sub"></span></div>'
			. '</div>'
			. '<div class="wpi-sk-cols">'
				. '<div class="wpi-sk-panel"><span class="wpi-sk sk-h"></span><span class="wpi-sk sk-fill"></span></div>'
				. '<div class="wpi-sk-panel"><span class="wpi-sk sk-h"></span><span class="wpi-sk sk-fill"></span></div>'
			. '</div>'
		. '</div>'
	. '</div>';
}
