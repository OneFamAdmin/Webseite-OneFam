<?php
/*
 * Shop-Snippet 117 "OneFam Widerrufsbelehrung in der Bestellbestaetigung"
 * Angelegt am 21.11.2026. Diese Datei ist die Quelle; im Shop steht derselbe
 * Code ohne die erste Zeile.
 *
 * WARUM: Seit 21.11.2026 haben Verbraucher mit Lieferung in die EU oder den EWR
 * 14 Tage Widerruf (Rechtstexte des Shops, Ziff. 1 der Rueckgaberichtlinie). Die
 * Widerrufsbelehrung und das Muster-Formular muessen ihnen auf einem dauerhaften
 * Datentraeger zugehen (Art. 8 Abs. 7 RL 2011/83/EU; Deutschland § 312f Abs. 2
 * BGB). Ein Link auf die Website genuegt dafuer nicht - der Text muss in der
 * Mail stehen.
 *
 * WAS: Haengt Belehrung und Formular unter die Bestelltabelle der Mails
 * "Bestellung in Bearbeitung" und "Bestellung wartend" an den Kunden, wenn in
 * ein Land der EU oder des EWR geliefert wird. Nicht bei Lieferung in die
 * Schweiz, nicht in Mails an den Shop.
 *
 * WOHER DIE TEXTE: Die englischen Absaetze unten sind dieselben wie auf der Seite
 * /refund-policy/ (Snippet 11), in derselben Reihenfolge. Die Uebersetzungen
 * kommen aus derselben Tabelle wie dort - of_nachtrag_teil('recht') in
 * Snippet 42, Schluessel ist der englische Absatz. Wer einen Absatz aendert,
 * aendert ihn an DREI Stellen: Snippet 11, hier, und als Schluessel in
 * Snippet 42. Fehlt eine Uebersetzung, steht der Absatz englisch in der Mail.
 * Die Belehrung ist das amtliche Muster (Anhang I Teil A RL 2011/83/EU) -
 * nicht umformulieren.
 *
 * SPRACHE: Der Shop merkte sich bisher nicht, in welcher Sprache bestellt
 * wurde, und die Mail entsteht oft erst durch die Rueckmeldung von zahls.ch -
 * dann gibt es keinen Besucher, dessen Sprache gelten koennte. Deshalb schreibt
 * dieses Snippet beim Anlegen der Bestellung die Sprache des Besuchers ins Feld
 * _onefam_sprache. Fehlt das Feld (Bestellungen von frueher), entscheidet das
 * Lieferland.
 *
 * PRUEFEN OHNE BESTELLUNG: GET /wp-json/onefam/v1/widerruf-mailvorschau?lang=de
 * (nur fuer angemeldete Shop-Verwalter) liefert den Block, wie er in der Mail
 * steht.
 *
 * Kein JavaScript in diesem Snippet.
 */

function onefam_widerruf_laender() {
	// EU-27 und die drei EWR-Staaten Island, Liechtenstein, Norwegen - dieselbe
	// Liste wie LAENDER_MIT_WIDERRUF in lib/shop/kasse.ts auf onefam.ch.
	return array(
		'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'HU',
		'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK',
		'IS', 'LI', 'NO',
	);
}

function onefam_widerruf_absaetze() {
	// h = Ueberschrift, s = fett gesetzte Zwischenzeile, p = Absatz.
	return array(
		array( 'h', 'Instructions on withdrawal' ),
		array( 's', 'Right of withdrawal' ),
		array( 'p', 'You have the right to withdraw from this contract within 14 days without giving any reason.' ),
		array( 'p', 'The withdrawal period will expire after 14 days from the day on which you acquire, or a third party other than the carrier and indicated by you acquires, physical possession of the goods.' ),
		array( 'p', 'To exercise the right of withdrawal, you must inform us (OneFam, Labinot Bajrami, Riehenstrasse 236, 4058 Basel, Switzerland, telephone +41 76 225 80 58, email info@onefam.ch) of your decision to withdraw from this contract by an unequivocal statement (e.g. a letter sent by post or email). You may use the attached model withdrawal form, but it is not obligatory. You can also exercise your right of withdrawal online at https://onefam.ch/widerruf. If you use this online feature, we will send you an acknowledgement of receipt of the withdrawal on a durable medium (e.g. by email), including its content and the date and time of its submission, without undue delay.' ),
		array( 'p', 'To meet the withdrawal deadline, it is sufficient for you to send your communication concerning your exercise of the right of withdrawal before the withdrawal period has expired.' ),
		array( 's', 'Effects of withdrawal' ),
		array( 'p', 'If you withdraw from this contract, we shall reimburse to you all payments received from you, including the costs of delivery (with the exception of the supplementary costs resulting from your choice of a type of delivery other than the least expensive type of standard delivery offered by us), without undue delay and in any event not later than 14 days from the day on which we are informed about your decision to withdraw from this contract. We will carry out such reimbursement using the same means of payment as you used for the initial transaction, unless you have expressly agreed otherwise; in any event, you will not incur any fees as a result of such reimbursement.' ),
		array( 'p', 'We may withhold reimbursement until we have received the goods back or you have supplied evidence of having sent back the goods, whichever is the earliest.' ),
		array( 'p', 'You shall send back the goods or hand them over to us (OneFam, Labinot Bajrami, Riehenstrasse 236, 4058 Basel, Switzerland), without undue delay and in any event not later than 14 days from the day on which you communicate your withdrawal from this contract to us. The deadline is met if you send back the goods before the period of 14 days has expired.' ),
		array( 'p', 'You will have to bear the direct cost of returning the goods.' ),
		array( 'p', 'You are only liable for any diminished value of the goods resulting from the handling other than what is necessary to establish the nature, characteristics and functioning of the goods.' ),
		array( 'p', 'Practical note (not a condition of your right of withdrawal): returns go to Switzerland and need a customs declaration. If you write to info@onefam.ch before sending, we will tell you what to enter.' ),
		array( 'h', 'Model withdrawal form' ),
		array( 'p', '(complete and return this form only if you wish to withdraw from the contract)' ),
		array( 'p', '— To OneFam, Labinot Bajrami, Riehenstrasse 236, 4058 Basel, Switzerland, info@onefam.ch:' ),
		array( 'p', '— I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract of sale of the following goods (*),' ),
		array( 'p', '— Ordered on (*) / received on (*),' ),
		array( 'p', '— Name of consumer(s),' ),
		array( 'p', '— Address of consumer(s),' ),
		array( 'p', '— Signature of consumer(s) (only if this form is notified on paper),' ),
		array( 'p', '— Date' ),
		array( 'p', '(*) Delete as appropriate.' ),
	);
}

function onefam_widerruf_mailblock( $lang, $nur_text = false ) {
	$lang    = in_array( $lang, array( 'de', 'en', 'fr', 'es' ), true ) ? $lang : 'en';
	$tabelle = array();
	if ( 'en' !== $lang && function_exists( 'of_nachtrag_teil' ) ) {
		$roh = json_decode( of_nachtrag_teil( 'recht' ), true );
		if ( is_array( $roh ) ) {
			$tabelle = $roh;
		}
	}
	$aus = '';
	foreach ( onefam_widerruf_absaetze() as $a ) {
		$text = isset( $tabelle[ $a[1] ][ $lang ] ) ? $tabelle[ $a[1] ][ $lang ] : $a[1];
		if ( $nur_text ) {
			// mb_strtoupper, nicht strtoupper: Das liess am 21.11.2026 die Akzente klein ("RéTRACTATION").
			$aus .= ( 'h' === $a[0] ? "\n" . mb_strtoupper( $text, 'UTF-8' ) : $text ) . "\n\n";
		} elseif ( 'h' === $a[0] ) {
			$aus .= '<h2 style="margin:28px 0 10px;">' . esc_html( $text ) . '</h2>';
		} elseif ( 's' === $a[0] ) {
			$aus .= '<p style="margin:14px 0 8px;"><strong>' . esc_html( $text ) . '</strong></p>';
		} else {
			$aus .= '<p style="margin:0 0 8px;">' . esc_html( $text ) . '</p>';
		}
	}
	return $nur_text ? "\n" . $aus : '<div style="margin-top:32px;font-size:13px;line-height:1.5;">' . $aus . '</div>';
}

function onefam_bestellsprache( $order ) {
	$lang = (string) $order->get_meta( '_onefam_sprache' );
	if ( in_array( $lang, array( 'de', 'en', 'fr', 'es' ), true ) ) {
		return $lang;
	}
	$land      = $order->get_shipping_country() ? $order->get_shipping_country() : $order->get_billing_country();
	$nach_land = array( 'DE' => 'de', 'AT' => 'de', 'LI' => 'de', 'CH' => 'de', 'FR' => 'fr', 'BE' => 'fr', 'LU' => 'fr', 'ES' => 'es' );
	return isset( $nach_land[ $land ] ) ? $nach_land[ $land ] : 'en';
}

function onefam_bestellsprache_merken( $order ) {
	if ( $order instanceof WC_Order && function_exists( 'of_visitor_lang' ) && ! $order->get_meta( '_onefam_sprache' ) ) {
		$order->update_meta_data( '_onefam_sprache', of_visitor_lang() );
		$order->save();
	}
}
// Block-Kasse (auch Bestellungen ueber onefam.ch) und die alte Kasse.
add_action( 'woocommerce_store_api_checkout_order_processed', 'onefam_bestellsprache_merken', 5 );
add_action( 'woocommerce_checkout_order_created', 'onefam_bestellsprache_merken', 5 );

add_action( 'woocommerce_email_after_order_table', function ( $order, $sent_to_admin = false, $plain_text = false, $email = null ) {
	if ( $sent_to_admin || ! ( $order instanceof WC_Order ) ) {
		return;
	}
	$art = is_object( $email ) && isset( $email->id ) ? $email->id : '';
	if ( ! in_array( $art, array( 'customer_processing_order', 'customer_on_hold_order' ), true ) ) {
		return;
	}
	$land = $order->get_shipping_country() ? $order->get_shipping_country() : $order->get_billing_country();
	if ( ! in_array( $land, onefam_widerruf_laender(), true ) ) {
		return;
	}
	echo onefam_widerruf_mailblock( onefam_bestellsprache( $order ), (bool) $plain_text ); // phpcs:ignore WordPress.Security.EscapeOutput
}, 20, 4 );

add_action( 'rest_api_init', function () {
	register_rest_route( 'onefam/v1', '/widerruf-mailvorschau', array(
		'methods'             => 'GET',
		'permission_callback' => function () {
			return current_user_can( 'manage_woocommerce' );
		},
		'callback'            => function ( WP_REST_Request $anfrage ) {
			$lang = (string) $anfrage->get_param( 'lang' );
			return rest_ensure_response( array(
				'lang' => $lang,
				'html' => onefam_widerruf_mailblock( $lang, false ),
				'text' => onefam_widerruf_mailblock( $lang, true ),
			) );
		},
	) );
} );
