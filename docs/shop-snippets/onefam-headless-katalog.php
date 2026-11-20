<?php
/*
 * Shop-Snippet "OneFam Headless: Katalog und Waehrung fuer onefam.ch"
 * Angelegt am 20.11.2026 (Probeaufbau, Plan: docs/plan-zusammenfuehrung-onefam.md).
 * Diese Datei ist die Quelle; im Shop steht derselbe Code ohne die erste Zeile.
 *
 * Zwei Aufgaben, beide nur fuer onefam.ch, beide aendern an den heutigen
 * Shop-Seiten nichts:
 *
 * 1) GET /wp-json/onefam/v1/katalog/<slug>?lang=de
 *    Oeffentlich und nur lesend. Liefert ein veroeffentlichtes Produkt mit allen
 *    Varianten, CHF-Preis UND EUR-Festpreis (CURCY-Meta _regular_price_wmcp),
 *    Lagerstatus und Bildern in den Groessen, die WordPress schon erzeugt hat.
 *    Damit braucht onefam.ch keinen WooCommerce-Schluessel (der liegt bewusst
 *    nicht in Vercel). Fehlt ein EUR-Festpreis, steht null — es wird nie
 *    umgerechnet (82,50 ist ein Fehlerbild, kein Preis).
 *
 * 2) Kopfzeile X-OneFam-Waehrung: CHF|EUR bei Anfragen an die Store API.
 *    Gemessen am 20.11.2026: CURCY waehlt in der Store API die Waehrung allein
 *    nach der IP-Adresse; Cookie und Parameter wirken nicht. onefam.ch fragt vom
 *    Vercel-Server aus — ohne diese Kopfzeile entschiede also das Rechenzentrum.
 *    onefam.ch schickt die Entscheidung nach derselben Regel wie Snippet 25
 *    (Zeitzone des Geraets, dann IP-Land, dann Browsersprache).
 *    Die Kopfzeile kann jeder setzen. Das ist nicht mehr als heute: auch das
 *    Cookie of_geo, nach dem Snippet 25 entscheidet, setzt der Browser selbst.
 *
 * Kein JavaScript in diesem Snippet (CLAUDE.md, Regel 9).
 */

add_action( 'rest_api_init', function () {
	register_rest_route( 'onefam/v1', '/katalog/(?P<slug>[a-z0-9-]+)', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => 'onefam_hl_produkt_antwort',
		'args'                => array(
			'lang' => array( 'default' => 'en', 'sanitize_callback' => 'sanitize_key' ),
		),
	) );
} );

function onefam_hl_bild( $id ) {
	$id = (int) $id;
	if ( ! $id ) {
		return null;
	}
	$voll  = wp_get_attachment_image_src( $id, 'full' );
	$gross = wp_get_attachment_image_src( $id, 'large' );
	$klein = wp_get_attachment_image_src( $id, 'woocommerce_thumbnail' );
	if ( ! $voll ) {
		return null;
	}
	return array(
		'id'    => $id,
		'voll'  => $voll[0],
		'gross' => $gross ? $gross[0] : $voll[0],
		'klein' => $klein ? $klein[0] : $voll[0],
		'alt'   => (string) get_post_meta( $id, '_wp_attachment_image_alt', true ),
	);
}

function onefam_hl_produkt_antwort( WP_REST_Request $anfrage ) {
	$slug = $anfrage['slug'];
	$lang = in_array( $anfrage['lang'], array( 'en', 'de', 'fr', 'es' ), true ) ? $anfrage['lang'] : 'en';

	// "v2": neue Fassung der Texte, alte Zwischenspeicher-Eintraege nicht weiterverwenden.
	$schluessel = 'onefam_hl_v2_' . md5( $slug . '|' . $lang );
	$fertig     = get_transient( $schluessel );
	if ( false === $fertig ) {
		$fertig = onefam_hl_produkt_daten( $slug, $lang );
		if ( $fertig ) {
			set_transient( $schluessel, $fertig, 10 * MINUTE_IN_SECONDS );
		}
	}
	if ( ! $fertig ) {
		return new WP_Error( 'onefam_nicht_gefunden', 'Produkt nicht gefunden.', array( 'status' => 404 ) );
	}
	$antwort = rest_ensure_response( $fertig );
	$antwort->header( 'Cache-Control', 'public, max-age=300' );
	return $antwort;
}

function onefam_hl_produkt_daten( $slug, $lang ) {
	// 'lang' => '' schaltet den Sprachfilter von Polylang fuer diese Abfrage ab.
	$treffer = get_posts( array(
		'name'        => $slug,
		'post_type'   => 'product',
		'post_status' => 'publish',
		'numberposts' => 1,
		'lang'        => '',
	) );
	if ( ! $treffer ) {
		return null;
	}
	$produkt = wc_get_product( $treffer[0]->ID );
	if ( ! $produkt || ! $produkt->is_type( 'variable' ) || 'hidden' === $produkt->get_catalog_visibility() ) {
		return null;
	}

	$bilder = array();
	foreach ( array_merge( array( $produkt->get_image_id() ), $produkt->get_gallery_image_ids() ) as $bid ) {
		$b = onefam_hl_bild( $bid );
		if ( $b && ! isset( $bilder[ $b['id'] ] ) ) {
			$bilder[ $b['id'] ] = $b;
		}
	}

	$varianten = array();
	foreach ( $produkt->get_children() as $vid ) {
		$v = wc_get_product( $vid );
		if ( ! $v || 'publish' !== get_post_status( $vid ) ) {
			continue;
		}
		$eur_meta = get_post_meta( $vid, '_regular_price_wmcp', true );
		if ( is_string( $eur_meta ) ) {
			$eur_meta = json_decode( $eur_meta, true );
		}
		$eur = ( is_array( $eur_meta ) && isset( $eur_meta['EUR'] ) && is_numeric( $eur_meta['EUR'] ) && (float) $eur_meta['EUR'] > 0 )
			? (float) $eur_meta['EUR'] : null;
		$attr = $v->get_attributes();
		$varianten[] = array(
			'id'        => (int) $vid,
			'farbe'     => isset( $attr['colour'] ) ? (string) $attr['colour'] : '',
			'groesse'   => isset( $attr['size'] ) ? (string) $attr['size'] : '',
			'chf'       => (float) $v->get_regular_price( 'edit' ),
			'eur'       => $eur,
			'lieferbar' => $v->is_in_stock(),
			'bild'      => (int) $v->get_image_id(),
		);
	}

	$kategorie = null;
	$terms     = get_the_terms( $produkt->get_id(), 'product_cat' );
	if ( $terms && ! is_wp_error( $terms ) ) {
		$kategorie = array( 'slug' => $terms[0]->slug, 'name' => $terms[0]->name );
	}

	// Texte: die vorhandenen Funktionen der Snippets 68 (Produkttexte je Motiv)
	// und 70 (Kategorietexte) — nicht nachgebaut, damit es nur EINE Quelle gibt.
	// Welche Sprache sie liefern, wird nach dem Anlegen von aussen nachgemessen.
	if ( function_exists( 'PLL' ) && PLL() && isset( PLL()->model ) ) {
		$sprache = PLL()->model->get_language( $lang );
		if ( $sprache ) {
			PLL()->curlang = $sprache;
		}
	}
	// Gemessen am 20.11.2026: Polylang umzustellen reicht nicht, der Motivtext kam
	// in allen vier Sprachen deutsch. Die Textfunktionen lesen die Sprache aus dem
	// Umfeld einer Shop-Seite. Deshalb wird fuer die Dauer des Aufrufs genau dieses
	// Umfeld hergestellt — Pfad wie /fr/produkt/<slug>/ und Sprach-Cookie ofl —
	// und danach unveraendert zurueckgesetzt.
	$alt_uri  = isset( $_SERVER['REQUEST_URI'] ) ? $_SERVER['REQUEST_URI'] : '';
	$alt_ofl  = isset( $_COOKIE['ofl'] ) ? $_COOKIE['ofl'] : null;
	$alt_post = isset( $GLOBALS['post'] ) ? $GLOBALS['post'] : null;
	$_SERVER['REQUEST_URI'] = ( 'en' === $lang ? '' : '/' . $lang ) . '/produkt/' . $slug . '/';
	$_COOKIE['ofl']         = $lang;
	$GLOBALS['post']        = get_post( $produkt->get_id() );

	$texte = array( 'motiv' => null, 'titel' => null, 'inhalt' => null );
	try {
		if ( function_exists( 'onefam_motiv_html' ) ) {
			$texte['motiv'] = (string) onefam_motiv_html( $slug, $produkt->get_name() );
		}
		$texte['titel']  = (string) apply_filters( 'the_title', $produkt->get_name(), $produkt->get_id() );
		$texte['inhalt'] = (string) apply_filters( 'the_content', $produkt->get_description() );
	} catch ( Throwable $e ) {
		$texte['fehler'] = $e->getMessage();
	}

	$_SERVER['REQUEST_URI'] = $alt_uri;
	if ( null === $alt_ofl ) {
		unset( $_COOKIE['ofl'] );
	} else {
		$_COOKIE['ofl'] = $alt_ofl;
	}
	$GLOBALS['post'] = $alt_post;

	return array(
		'id'           => $produkt->get_id(),
		'slug'         => $produkt->get_slug(),
		'name'         => $produkt->get_name(),
		'beschreibung' => $produkt->get_description(),
		'kategorie'    => $kategorie,
		'farben'       => array_values( array_unique( array_filter( wp_list_pluck( $varianten, 'farbe' ) ) ) ),
		'groessen'     => array_values( array_unique( array_filter( wp_list_pluck( $varianten, 'groesse' ) ) ) ),
		'bilder'       => array_values( $bilder ),
		'varianten'    => $varianten,
		'texte'        => $texte,
		'sprache'      => $lang,
		'stand'        => gmdate( 'c' ),
	);
}

// Nach jeder Produktaenderung die zwischengespeicherten Antworten verwerfen.
add_action( 'woocommerce_update_product', function () {
	global $wpdb;
	$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '\_transient\_onefam\_hl\_%' OR option_name LIKE '\_transient\_timeout\_onefam\_hl\_%'" );
} );

add_filter( 'rest_pre_dispatch', function ( $ergebnis, $server, $anfrage ) {
	if ( 0 !== strpos( $anfrage->get_route(), '/wc/store/' ) ) {
		return $ergebnis;
	}
	$waehrung = strtoupper( (string) $anfrage->get_header( 'x_onefam_waehrung' ) );
	if ( ! in_array( $waehrung, array( 'CHF', 'EUR' ), true ) ) {
		return $ergebnis;
	}
	if ( class_exists( 'WOOMULTI_CURRENCY_F_Data' ) ) {
		$daten = WOOMULTI_CURRENCY_F_Data::get_ins();
		if ( method_exists( $daten, 'set_current_currency' ) ) {
			$daten->set_current_currency( $waehrung );
		}
	}
	return $ergebnis;
}, 5, 3 );
