<?php
/*
 * Shop-Snippet 114 "OneFam Headless: Katalog und Waehrung fuer onefam.ch"
 * Angelegt am 20.11.2026 (Probeaufbau, Plan: docs/plan-zusammenfuehrung-onefam.md).
 * Diese Datei ist die Quelle; im Shop steht derselbe Code ohne die erste Zeile.
 *
 * Zwei Aufgaben, beide nur fuer onefam.ch, beide aendern an den heutigen
 * Shop-Seiten nichts:
 *
 * 1) GET /wp-json/onefam/v1/katalog/<slug>?lang=de   (mit Cookie ofl=de)
 *    Oeffentlich und nur lesend. Liefert ein veroeffentlichtes Produkt mit allen
 *    Varianten, CHF-Preis UND EUR-Festpreis (CURCY-Meta _regular_price_wmcp),
 *    Lagerstatus, Bildern in den Groessen, die WordPress schon erzeugt hat, den
 *    Texten der Produktseite und der Lieferzeit (Texte aus Snippet 102,
 *    onefam_lieferzeit_texte()).
 *    GET /wp-json/onefam/v1/katalog liefert die Liste der oeffentlichen Produkte
 *    und die Lieferlaender.
 *    Damit braucht onefam.ch keinen WooCommerce-Schluessel. Fehlt ein
 *    EUR-Festpreis, steht null — es wird nie umgerechnet.
 *
 *    SPRACHE: Im Shop bestimmt of_visitor_lang() (Snippet 28) die Sprache, und
 *    zwar EINMAL je Anfrage: Adresspraefix, dann Cookie ofl, dann Browsersprache,
 *    dann IP-Land. Daran haengen die WordPress-Sprache (Filter determine_locale),
 *    die Produktnamen (Snippet 57), der Motivtext (Snippet 68 — gibt bei
 *    abweichender WordPress-Sprache absichtlich NICHTS aus) und die Kacheln
 *    (Snippet 69). Eine REST-Adresse hat kein Praefix; ohne Cookie fiel am
 *    20.11.2026 alles auf Deutsch zurueck (Schweizer IP), und EN/FR/ES bekamen
 *    keinen Motivtext. Deshalb schickt onefam.ch das Cookie ofl=<sprache> mit.
 *    Passt es nicht zu ?lang, bricht der Endpunkt mit 409 ab, statt falsche Texte
 *    zu liefern und zwischenzuspeichern.
 *
 * 2) Kopfzeile X-OneFam-Waehrung: CHF|EUR bei Anfragen an die Store API.
 *    Gemessen am 20.11.2026: CURCY waehlt in der Store API die Waehrung allein
 *    nach der IP-Adresse. onefam.ch fragt vom Vercel-Server aus — ohne diese
 *    Kopfzeile entschiede das Rechenzentrum. onefam.ch schickt die Entscheidung
 *    nach derselben Regel wie Snippet 25. Die Kopfzeile kann jeder setzen; das
 *    ist nicht mehr als heute, auch das Cookie of_geo setzt der Browser selbst.
 *
 * Kein JavaScript in diesem Snippet.
 */

add_action( 'rest_api_init', function () {
	// Uebersicht: welche Produkte es gibt und wohin geliefert wird. Sprachunabhaengig.
	register_rest_route( 'onefam/v1', '/katalog', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => 'onefam_hl_uebersicht_antwort',
	) );
	register_rest_route( 'onefam/v1', '/katalog/(?P<slug>[a-z0-9-]+)', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => 'onefam_hl_produkt_antwort',
		'args'                => array(
			'lang' => array( 'default' => 'en', 'sanitize_callback' => 'sanitize_key' ),
		),
	) );
	register_rest_route( 'onefam/v1', '/katalog/kategorie/(?P<slug>[a-z0-9-]+)', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => 'onefam_hl_kategorie_antwort',
		'args'                => array(
			'lang' => array( 'default' => 'en', 'sanitize_callback' => 'sanitize_key' ),
		),
	) );
	// Daten fuer das Adressformular der Kasse auf onefam.ch.
	register_rest_route( 'onefam/v1', '/kasse', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => 'onefam_hl_kasse_antwort',
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

function onefam_hl_uebersicht_antwort() {
	$fertig = get_transient( 'onefam_hl_v3_uebersicht' );
	if ( false === $fertig ) {
		$ids = get_posts( array(
			'post_type'   => 'product',
			'post_status' => 'publish',
			'numberposts' => 500,
			'fields'      => 'ids',
			'orderby'     => 'name',
			'order'       => 'ASC',
			'lang'        => '',
		) );
		$produkte = array();
		foreach ( $ids as $id ) {
			$p = wc_get_product( $id );
			if ( ! $p || ! $p->is_type( 'variable' ) || 'hidden' === $p->get_catalog_visibility() ) {
				continue;
			}
			$kat        = wp_get_post_terms( $id, 'product_cat', array( 'fields' => 'slugs' ) );
			$produkte[] = array(
				'slug'      => $p->get_slug(),
				'kategorie' => ( $kat && ! is_wp_error( $kat ) ) ? $kat[0] : null,
			);
		}
		$fertig = array(
			'produkte' => $produkte,
			'laender'  => array_keys( WC()->countries->get_shipping_countries() ),
			'stand'    => gmdate( 'c' ),
		);
		set_transient( 'onefam_hl_v3_uebersicht', $fertig, 10 * MINUTE_IN_SECONDS );
	}
	$antwort = rest_ensure_response( $fertig );
	$antwort->header( 'Cache-Control', 'public, max-age=300' );
	return $antwort;
}

function onefam_hl_produkt_antwort( WP_REST_Request $anfrage ) {
	$slug = $anfrage['slug'];
	$lang = in_array( $anfrage['lang'], array( 'en', 'de', 'fr', 'es' ), true ) ? $anfrage['lang'] : 'en';

	$besucher = function_exists( 'of_visitor_lang' ) ? of_visitor_lang() : '';
	if ( $besucher !== $lang ) {
		return new WP_Error(
			'onefam_sprache',
			'Sprache passt nicht: Cookie ofl=' . $lang . ' mitschicken.',
			array( 'status' => 409 )
		);
	}

	$schluessel = 'onefam_hl_v4_' . md5( $slug . '|' . $lang );
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
		$name      = function_exists( 'onefam_produktname' ) ? rtrim( onefam_produktname( $terms[0]->name . ' ' ) ) : $terms[0]->name;
		$kategorie = array( 'slug' => $terms[0]->slug, 'name' => $name );
	}

	// Texte ueber dieselben Filter wie auf der Produktseite des Shops — nicht
	// nachgebaut, damit es nur EINE Quelle gibt. Snippet 68 liest den Beitrag
	// ueber get_post(), deshalb wird er fuer die Dauer des Aufrufs gesetzt.
	$alt_post        = isset( $GLOBALS['post'] ) ? $GLOBALS['post'] : null;
	$GLOBALS['post'] = get_post( $produkt->get_id() );
	$inhalt          = null;
	try {
		$inhalt = (string) apply_filters( 'the_content', $produkt->get_description() );
	} catch ( Throwable $e ) {
		$inhalt = null;
	}
	$GLOBALS['post'] = $alt_post;

	// Snippet 71 entfernt auf der Shop-Seite den Rest der alten PodOS-Beschreibung
	// vor dem Erzaehltext — aber nur, wenn is_product() gilt, hier also nicht.
	// Dieselbe Regel ueber dieselbe Funktion.
	if ( null !== $inhalt && function_exists( 'onefam_podos_rest_entfernen' ) ) {
		$inhalt = onefam_podos_rest_entfernen( $inhalt );
	}

	$lieferzeit = null;
	if ( function_exists( 'onefam_lieferzeit_texte' ) ) {
		$alle       = onefam_lieferzeit_texte();
		$lieferzeit = isset( $alle[ $lang ] ) ? $alle[ $lang ] : null;
	}

	return array(
		'id'         => $produkt->get_id(),
		'slug'       => $produkt->get_slug(),
		// get_name() laeuft durch Snippet 57: "Albanien Hoodie", "Albanie Hoodie" …
		'name'       => $produkt->get_name(),
		'kategorie'  => $kategorie,
		'farben'     => array_values( array_unique( array_filter( wp_list_pluck( $varianten, 'farbe' ) ) ) ),
		'groessen'   => array_values( array_unique( array_filter( wp_list_pluck( $varianten, 'groesse' ) ) ) ),
		'bilder'     => array_values( $bilder ),
		'varianten'  => $varianten,
		'inhalt'     => $inhalt,
		'lieferzeit' => $lieferzeit,
		'sprache'    => $lang,
		'stand'      => gmdate( 'c' ),
	);
}

// Kategorie (Land oder Logo-Linie) fuer die Laenderseiten auf onefam.ch:
// GET /wp-json/onefam/v1/katalog/kategorie/<slug>?lang=de (mit Cookie ofl=de).
// Name, Kategorietext aus Snippet 70 (im Shop seit der Umleitung der
// Kategorie-Adressen nirgends mehr sichtbar) und die Produkte mit Preis und Bild.
// Preise roh aus der Datenbank gelesen, damit CURCY sie nicht umrechnet.
function onefam_hl_kategorie_antwort( WP_REST_Request $anfrage ) {
	$slug = $anfrage['slug'];
	$lang = in_array( $anfrage['lang'], array( 'en', 'de', 'fr', 'es' ), true ) ? $anfrage['lang'] : 'en';

	$besucher = function_exists( 'of_visitor_lang' ) ? of_visitor_lang() : '';
	if ( $besucher !== $lang ) {
		return new WP_Error(
			'onefam_sprache',
			'Sprache passt nicht: Cookie ofl=' . $lang . ' mitschicken.',
			array( 'status' => 409 )
		);
	}

	$schluessel = 'onefam_hl_v6_kat_' . md5( $slug . '|' . $lang );
	$fertig     = get_transient( $schluessel );
	if ( false === $fertig ) {
		$fertig = onefam_hl_kategorie_daten( $slug, $lang );
		if ( $fertig ) {
			set_transient( $schluessel, $fertig, 10 * MINUTE_IN_SECONDS );
		}
	}
	if ( ! $fertig ) {
		return new WP_Error( 'onefam_nicht_gefunden', 'Kategorie nicht gefunden.', array( 'status' => 404 ) );
	}
	$antwort = rest_ensure_response( $fertig );
	$antwort->header( 'Cache-Control', 'public, max-age=300' );
	return $antwort;
}

function onefam_hl_kategorie_daten( $slug, $lang ) {
	$term = get_term_by( 'slug', $slug, 'product_cat' );
	if ( ! $term || is_wp_error( $term ) ) {
		return null;
	}
	$ids = get_posts( array(
		'post_type'   => 'product',
		'post_status' => 'publish',
		'numberposts' => 100,
		'fields'      => 'ids',
		'lang'        => '',
		'tax_query'   => array(
			array( 'taxonomy' => 'product_cat', 'field' => 'term_id', 'terms' => (int) $term->term_id ),
		),
	) );
	// Reihenfolge wie auf den heutigen Laenderseiten: Hoodie, Sweater, Shirt.
	$reihenfolge = array( 'hoodie' => 0, 'sweater' => 1, 'shirt' => 2 );
	$produkte    = array();
	foreach ( $ids as $id ) {
		$p = wc_get_product( $id );
		if ( ! $p || ! $p->is_type( 'variable' ) || 'hidden' === $p->get_catalog_visibility() ) {
			continue;
		}
		$chf       = array();
		$eur       = array();
		$eur_fehlt = false;
		$farben    = array();
		foreach ( $p->get_children() as $vid ) {
			if ( 'publish' !== get_post_status( $vid ) ) {
				continue;
			}
			$chf[] = (float) get_post_meta( $vid, '_regular_price', true );
			$meta  = get_post_meta( $vid, '_regular_price_wmcp', true );
			if ( is_string( $meta ) ) {
				$meta = json_decode( $meta, true );
			}
			if ( is_array( $meta ) && isset( $meta['EUR'] ) && is_numeric( $meta['EUR'] ) && (float) $meta['EUR'] > 0 ) {
				$eur[] = (float) $meta['EUR'];
			} else {
				$eur_fehlt = true;
			}
			$farben[ (string) get_post_meta( $vid, 'attribute_colour', true ) ] = true;
		}
		if ( ! $chf ) {
			continue;
		}
		$platz = 9;
		foreach ( $reihenfolge as $wort => $nr ) {
			if ( false !== strpos( $p->get_slug(), $wort ) ) {
				$platz = $nr;
				break;
			}
		}
		$eur_ok     = ( ! $eur_fehlt && count( $eur ) > 0 );
		$produkte[] = array(
			'slug'        => $p->get_slug(),
			'name'        => $p->get_name(),
			'chf'         => min( $chf ),
			'eur'         => $eur_ok ? min( $eur ) : null,
			'einheitlich' => ( min( $chf ) === max( $chf ) && $eur_ok && min( $eur ) === max( $eur ) ),
			'farben'      => count( $farben ),
			'bild'        => onefam_hl_bild( $p->get_image_id() ),
			'platz'       => $platz,
		);
	}
	usort( $produkte, function ( $a, $b ) {
		return $a['platz'] <=> $b['platz'];
	} );

	$text = null;
	if ( function_exists( 'onefam_kat_key' ) && function_exists( 'onefam_kat_texte' ) ) {
		$key  = onefam_kat_key( $slug );
		$alle = onefam_kat_texte();
		if ( '' !== $key && isset( $alle[ $lang ][ $key ] ) ) {
			$text = (string) $alle[ $lang ][ $key ];
		}
	}

	// Erzaehltext des Motivs aus Snippet 68 — dieselben Absaetze wie auf der
	// Produktseite, hier einzeln, damit die Laenderseite sie als Abschnitte setzen
	// kann. Aufbau dort (20.11.2026 fuer alle 14 Motive und vier Sprachen gezaehlt):
	// der letzte Absatz ist "Fuer wen", der vorletzte "Das Zeichen", davor die
	// Erzaehlung. Die beiden Ueberschriften stehen ebenfalls in Snippet 68.
	$motiv = null;
	if ( $produkte && function_exists( 'onefam_motiv_key' ) && function_exists( 'onefam_motiv_texte' ) ) {
		$mkey  = onefam_motiv_key( $produkte[0]['slug'] );
		$malle = onefam_motiv_texte();
		if ( '' !== $mkey && isset( $malle[ $lang ][ $mkey ]['absaetze'], $malle[ $lang ][ $mkey ]['schluss'] ) ) {
			$titel = function_exists( 'onefam_motiv_ueberschriften' ) ? onefam_motiv_ueberschriften() : array();
			$motiv = array(
				'absaetze' => array_values( (array) $malle[ $lang ][ $mkey ]['absaetze'] ),
				'schluss'  => (string) $malle[ $lang ][ $mkey ]['schluss'],
				'titel'    => isset( $titel[ $lang ] ) ? $titel[ $lang ] : null,
			);
		}
	}

	// Versand und Rueckgabe: der Text der dritten Klappe der Produktseite (Snippet 69).
	$versand = null;
	if ( function_exists( 'onefam_kachel_titel' ) ) {
		$kachel = onefam_kachel_titel();
		if ( is_array( $kachel ) && isset( $kachel['versand'], $kachel['versand_text'] ) ) {
			$versand = array( 'titel' => (string) $kachel['versand'], 'html' => (string) $kachel['versand_text'] );
		}
	}

	return array(
		'slug'     => $term->slug,
		'name'     => function_exists( 'onefam_produktname' ) ? rtrim( onefam_produktname( $term->name . ' ' ) ) : $term->name,
		'text'     => $text,
		'motiv'    => $motiv,
		'versand'  => $versand,
		'produkte' => $produkte,
		'sprache'  => $lang,
		'stand'    => gmdate( 'c' ),
	);
}

// Kasse auf onefam.ch: Lieferlaender mit Namen in der Sprache der Seite und je Land
// die Regeln fuer Kanton/Bundesland und Postleitzahl — so, wie WooCommerce sie
// selbst anwendet (get_address_fields). Der Shop nutzt die Block-Kasse; die prueft
// Adressen ueber dieselbe Store API, ueber die auch onefam.ch bestellt.
// GET /wp-json/onefam/v1/kasse?lang=de (mit Cookie ofl=de)
function onefam_hl_kasse_antwort( WP_REST_Request $anfrage ) {
	$lang     = in_array( $anfrage['lang'], array( 'en', 'de', 'fr', 'es' ), true ) ? $anfrage['lang'] : 'en';
	$besucher = function_exists( 'of_visitor_lang' ) ? of_visitor_lang() : '';
	if ( $besucher !== $lang ) {
		return new WP_Error(
			'onefam_sprache',
			'Sprache passt nicht: Cookie ofl=' . $lang . ' mitschicken.',
			array( 'status' => 409 )
		);
	}
	$fertig = get_transient( 'onefam_hl_v7_kasse_' . $lang );
	if ( false === $fertig ) {
		$c       = WC()->countries;
		$staaten = $c->get_states();
		$laender = array();
		foreach ( $c->get_shipping_countries() as $code => $name ) {
			$felder  = $c->get_address_fields( $code, 'shipping_' );
			$region  = isset( $felder['shipping_state'] ) ? $felder['shipping_state'] : array();
			$plz     = isset( $felder['shipping_postcode'] ) ? $felder['shipping_postcode'] : array();
			$auswahl = array();
			if ( ! empty( $staaten[ $code ] ) && is_array( $staaten[ $code ] ) ) {
				foreach ( $staaten[ $code ] as $kuerzel => $bezeichnung ) {
					$auswahl[] = array( 'code' => (string) $kuerzel, 'name' => html_entity_decode( (string) $bezeichnung, ENT_QUOTES, 'UTF-8' ) );
				}
			}
			$laender[] = array(
				'code'   => (string) $code,
				'name'   => html_entity_decode( (string) $name, ENT_QUOTES, 'UTF-8' ),
				'region' => array(
					'label'     => isset( $region['label'] ) ? (string) $region['label'] : null,
					'pflicht'   => ! empty( $region['required'] ),
					'versteckt' => ! empty( $region['hidden'] ) || ( isset( $staaten[ $code ] ) && is_array( $staaten[ $code ] ) && ! $staaten[ $code ] ),
					'auswahl'   => $auswahl,
				),
				'plz'    => array(
					'label'     => isset( $plz['label'] ) ? (string) $plz['label'] : null,
					'pflicht'   => ! empty( $plz['required'] ),
					'versteckt' => ! empty( $plz['hidden'] ),
				),
			);
		}
		$fertig = array( 'laender' => $laender, 'sprache' => $lang, 'stand' => gmdate( 'c' ) );
		set_transient( 'onefam_hl_v7_kasse_' . $lang, $fertig, 10 * MINUTE_IN_SECONDS );
	}
	$antwort = rest_ensure_response( $fertig );
	$antwort->header( 'Cache-Control', 'public, max-age=300' );
	return $antwort;
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
	// Produktnamen im Warenkorb von onefam.ch: Die Store API nimmt get_title(),
	// und daran haengt Snippet 57 nicht (nur an get_name()). Gemessen 20.11.2026:
	// "Albania Hoodie" auch im deutschen Warenkorb. Nur fuer diese Anfragen.
	if ( function_exists( 'onefam_produktname' ) ) {
		add_filter( 'woocommerce_product_title', 'onefam_produktname', 999 );
	}

	// RUECKKEHR NACH DER ZAHLUNG — nur fuer Bestellungen von onefam.ch.
	// Das zahls-Plugin (2.0.7, process_payment) leitet nach erfolgreicher Zahlung auf
	// get_return_url() (Danke-Seite des Shops) und bei Abbruch oder Fehler auf
	// wc_get_cart_url() . '?zahls_error=1&order_id=…' (Warenkorb des Shops). Der
	// Kunde von onefam.ch hat dort aber keinen Warenkorb — seiner haengt am
	// Cart-Token. Deshalb zeigen beide Adressen fuer diese eine Anfrage auf onefam.ch.
	// Der Bestellstatus haengt nicht daran: den setzt die Rueckmeldung von zahls.ch
	// (wc-api=wc_zahls_gateway), wie bisher.
	// Erlaubt sind nur diese Absender; localhost fuer den Testkauf vor dem Livegang.
	$erlaubt = array( 'https://onefam.ch', 'http://localhost:3000', 'http://localhost:3001' );
	$basis   = rtrim( (string) $anfrage->get_header( 'x_onefam_rueckkehr' ), '/' );
	if ( in_array( $basis, $erlaubt, true ) ) {
		$sprache = function_exists( 'of_visitor_lang' ) ? of_visitor_lang() : 'en';
		$pfad    = in_array( $sprache, array( 'de', 'fr', 'es' ), true ) ? '/' . $sprache : '';
		add_filter( 'woocommerce_get_return_url', function () use ( $basis, $pfad ) {
			return $basis . $pfad . '/danke';
		}, 999 );
		add_filter( 'woocommerce_get_cart_url', function () use ( $basis, $pfad ) {
			return $basis . $pfad . '/warenkorb';
		}, 999 );
		// Herkunft an der Bestellung vermerken, damit im wp-admin sichtbar ist,
		// ueber welche Kasse sie kam.
		add_action( 'woocommerce_store_api_checkout_order_processed', function ( $order ) {
			if ( $order instanceof WC_Order ) {
				$order->update_meta_data( '_onefam_herkunft', 'onefam.ch' );
				$order->save();
			}
		} );
	}
	return $ergebnis;
}, 5, 3 );
